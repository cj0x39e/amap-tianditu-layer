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
  url: string;
  map: AMap.Map;
};

export type TileImage = HTMLImageElement & { __renderId: undefined | number };
