import "@amap/amap-jsapi-types";

export type Point = {
  x: number;
  y: number;
};

export type Tile = Point & {
  z: number;
  pX: number;
  pY: number;
};

export type Bounds = {
  min: Point;
  max: Point;
};

export type Options = Omit<AMap.CustomLayerOption, "render"> & {
  // 地图地址
  url: string;
  // 高德地图实例
  map: AMap.Map;
  // 缓存图片大小,默认 50
  cacheSize?: number;
  // 渲染类型，可选 canvas 、dom ，默认 dom
  renderType?: "canvas" | "dom";
};

export type TileImage = HTMLImageElement & {
  __renderId: undefined | number;
  __tileKey: undefined | string;
};
