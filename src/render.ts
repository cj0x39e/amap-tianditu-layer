import { TILE_SIZE } from "./const";
import { parseUrl } from "./url";
import { TileImage, Tile } from "./types";
import { getCacheStore } from "./cacheStore";

const wrapGetCacheStore = () => getCacheStore<TileImage>();
const getTileKey = (tile: Tile) => `${tile.x}-${tile.y}-${tile.z}`;

export const render = (
  tileList: Tile[],
  canvas: CanvasRenderingContext2D,
  url: string,
  renderId: { current: number },
  cacheStore: ReturnType<typeof wrapGetCacheStore>,
  width: number,
  height: number
) => {
  const rendererNum = 10;
  const nowRenderId = renderId.current;
  let total = tileList.length;
  let rendererCounter = 0;
  let mainCounter = 0;
  let rendererList: [TileImage, number, number][] = [];

  const renderer = (
    img: TileImage | null,
    pX: number | null,
    pY: number | null
  ) => {
    if (img !== null && pX !== null && pY !== null) {
      rendererList.push([img, pX, pY]);
    }

    if (rendererCounter === rendererNum || total - mainCounter < rendererNum) {
      window.requestAnimationFrame(
        function (list: [TileImage, number, number][]) {
          // 因为网络或者卡顿等问题可能
          // 图片到达后已经是下一次渲染了
          if (nowRenderId === renderId.current) {
            list.forEach(([img, pX, pY]) => {
              canvas.drawImage(img, pX, pY, TILE_SIZE, TILE_SIZE);
            });
          }
        }.bind(null, [...rendererList])
      );
      rendererCounter = 0;
      rendererList = [];
    }
    rendererCounter++;
    mainCounter++;
  };

  canvas.clearRect(0, 0, width, height);

  tileList.forEach((tile) => {
    const tileKey = getTileKey(tile);

    if (cacheStore.isCached(tileKey)) {
      total--;
      canvas.drawImage(
        cacheStore.getItem(tileKey),
        tile.pX,
        tile.pY,
        TILE_SIZE,
        TILE_SIZE
      );
    } else {
      const img = new Image() as TileImage;
      img.src = parseUrl(tile, url);

      img.onload = function (this: TileImage, pX: number, pY: number) {
        cacheStore.addItem(tileKey, this);
        renderer(this, pX, pY);
      }.bind(img, tile.pX, tile.pY);

      img.onerror = () => {
        renderer(null, null, null);
      };
    }
  });
};
