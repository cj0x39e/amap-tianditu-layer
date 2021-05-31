import { GCJ02ToWGS84 } from "gcoord/src/crs/GCJ02";
import { Point, Tile, Options, TileImage } from "./types";
import { getCacheStore } from "./cacheStore";
import { TILE_SIZE } from "./const";
import * as point from "./point";
import * as bounds from "./bounds";
import { render } from "./render";

const getTileQueue = (
  center: Point,
  level: number,
  viewWidth: number,
  viewHeight: number
): Tile[] => {
  // 计算像素中点
  const pixelCenter = point.floor(
    point.projectedPointToPixelPoint(
      point.lngLatPointToProjectPoint(center),
      level
    )
  );
  const halfView = point.half(point.toPoint(viewWidth, viewHeight));

  // 计算像素范围
  const pixelBounds = bounds.toBounds(
    point.subtract(pixelCenter, halfView),
    point.add(pixelCenter, halfView)
  );

  // 计算瓦片范围
  const tileRange = bounds.toBounds(
    point.floor(point.pixelPointToTilePoint(pixelBounds.min)),
    point.subtract(
      point.ceil(point.pixelPointToTilePoint(pixelBounds.max)),
      point.toPoint(1, 1)
    )
  );

  const tileCenter = bounds.center(tileRange);
  const queue: Tile[] = [];
  const maxTileX = Math.pow(2, level);

  for (let j = tileRange.min.y; j <= tileRange.max.y; j++) {
    for (let i = tileRange.min.x; i <= tileRange.max.x; i++) {
      queue.push({
        // 当 x 超出时循环显示
        x: i >= maxTileX ? i - maxTileX : i < 0 ? i + maxTileX : i,
        y: j,
        z: level,
        pX: Math.floor(i * TILE_SIZE - pixelCenter.x + viewWidth / 2),
        pY: Math.floor(j * TILE_SIZE - pixelCenter.y + viewHeight / 2),
      });
    }
  }

  // 距离中间近的瓦片排在前面
  queue.sort(
    (a, b) => point.distance(a, tileCenter) - point.distance(b, tileCenter)
  );

  return queue;
};

/**
 * 初始化天地图图层
 * @param options
 * @param options.url 地址
 */
const init = (options: Options): AMap.CustomLayer => {
  const map = options.map;
  // 由于高德定义的参数类型为 canvas ，但实际上他既支持 canvas 也支持 dom
  // 所以这里强制转换一下
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const canvas = document.createElement("canvas");
  const canvasContext = canvas.getContext("2d");
  const mapSize = map.getSize();
  const cacheStore = getCacheStore<TileImage>(options.cacheSize);
  const width = mapSize.width;
  const height = mapSize.height;
  canvas.width = width;
  canvas.height = height;

  const customerLayer = new AMap.CustomLayer(canvas, {
    ...options,
    // 该 render 函数无实际作用，仅仅是为了修复 TS 报错
    render: () => {
      // nothing
    },
  }) as AMap.CustomLayer & { render: () => void };

  const renderId = { current: 1 };
  customerLayer.render = () => {
    renderId.current += 1;
    const centerGeoPointData = map.getCenter();

    const centerGeoPoint = GCJ02ToWGS84([
      centerGeoPointData.lng,
      centerGeoPointData.lat,
    ]);

    const level = map.getZoom();
    const mapSize = map.getSize();
    const viewWidth = mapSize.width;
    const viewHeight = mapSize.height;

    const tileQueue = getTileQueue(
      point.toPoint(centerGeoPoint[0], centerGeoPoint[1]),
      level,
      viewWidth,
      viewHeight
    );

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    render(
      tileQueue,
      canvasContext!,
      options.url,
      renderId,
      cacheStore,
      width,
      height
    );
  };

  return customerLayer;
};

export default init;
