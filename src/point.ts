import { TILE_SIZE, MAX_LATITUDE, R } from "./const";
import { Point } from "./types";

export type ThreeDPoint = Point & { z: number };

/**
 * 将坐标数据转为点数据
 * @param x
 * @param y
 * @returns
 */
export const toPoint = (x: number, y: number): Point => ({ x, y });

/**
 * 坐标点数据舍去尾数
 * @param p
 * @returns
 */
export const floor = (p: Point) => toPoint(Math.floor(p.x), Math.floor(p.y));

/**
 * 坐标点数据尾数进位
 * @param p
 * @returns
 */
export const ceil = (p: Point) => toPoint(Math.ceil(p.x), Math.ceil(p.y));

/**
 * 坐标点数据减半
 * @param p
 * @returns
 */
export const half = (p: Point) => toPoint(p.x / 2, p.y / 2);

/**
 * 计算两个坐标点差值
 * @param p1
 * @param p2
 * @returns
 */
export const subtract = (p1: Point, p2: Point) =>
  toPoint(p1.x - p2.x, p1.y - p2.y);

/**
 * 计算两个坐标点和值
 * @param p1
 * @param p2
 * @returns
 */
export const add = (p1: Point, p2: Point) => toPoint(p1.x + p2.x, p1.y + p2.y);

/**
 * 计算两点之间的直线距离
 * @param p1
 * @param p2
 * @returns
 */
export const distance = (p1: Point, p2: Point) => {
  const x = p2.x - p1.x;
  const y = p2.y - p1.y;
  return Math.sqrt(x * x + y * y);
};

/**
 * 换算像素点坐标为瓦片行列坐标
 * @param p1
 * @returns
 */
export const pixelPointToTilePoint = (p1: Point) =>
  toPoint(p1.x / TILE_SIZE, p1.y / TILE_SIZE);

/**
 * 投影坐标点转换为像素坐标点
 * @param projectedPoint
 * @param level
 * @returns
 */
export const projectedPointToPixelPoint = (
  projectedPoint: Point,
  level: number
) => {
  const a = 2.495320233665337e-8;
  const b = 0.5;
  const c = -2.495320233665337e-8;
  const d = 0.5;

  const scale = TILE_SIZE * Math.pow(2, level);

  return toPoint(
    scale * (a * projectedPoint.x + b),
    scale * (c * projectedPoint.y + d)
  );
};

/**
 * 经纬度坐标点转换为投影坐标点, EPSG:3857
 * @param point
 * @returns
 */
const d = Math.PI / 180;
export const lngLatPointToProjectPoint = (point: Point) => {
  const lat = Math.max(Math.min(MAX_LATITUDE, point.y), -MAX_LATITUDE);
  const sin = Math.sin(lat * d);

  return toPoint(R * point.x * d, (R * Math.log((1 + sin) / (1 - sin))) / 2);
};
