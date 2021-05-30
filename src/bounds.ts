import { toPoint } from "./point";
import { Point, Bounds } from "./types";

/**
 * 构建两个点所围成的范围对象
 * @param p1
 * @param p2
 * @returns
 */
export const toBounds = (p1: Point, p2: Point): Bounds => ({
  min: toPoint(Math.min(p1.x, p2.x), Math.min(p1.y, p2.y)),
  max: toPoint(Math.max(p1.x, p2.x), Math.max(p1.y, p2.y)),
});

/**
 * 计算范围对象所在的中心点
 * @param b
 * @returns
 */
export const center = (b: Bounds) =>
  toPoint((b.min.x + b.max.x) / 2, (b.min.y + b.max.y) / 2);
