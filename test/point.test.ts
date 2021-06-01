import {
  toPoint,
  floor,
  ceil,
  half,
  subtract,
  add,
  pixelPointToTilePoint,
} from "../src/point";
import { TILE_SIZE } from "../src/const";

test("toPoint test", () => {
  expect(toPoint(1, 1)).toEqual({ x: 1, y: 1 });
  expect(toPoint(4, 5)).toEqual({ x: 4, y: 5 });
});

test("floor test", () => {
  expect(floor({ x: 1.8, y: 1.1 })).toEqual({ x: 1, y: 1 });
  expect(floor({ x: 1.1, y: 1.8 })).toEqual({ x: 1, y: 1 });
});

test("ceil test", () => {
  expect(ceil({ x: 1.8, y: 1.1 })).toEqual({ x: 2, y: 2 });
  expect(ceil({ x: 1.1, y: 1.8 })).toEqual({ x: 2, y: 2 });
});

test("half test", () => {
  expect(half({ x: 1.8, y: 1.1 })).toEqual({ x: 1.8 / 2, y: 1.1 / 2 });
  expect(half({ x: 1.1, y: 1.8 })).toEqual({ x: 1.1 / 2, y: 1.8 / 2 });
});

test("subtract test", () => {
  expect(subtract({ x: 2, y: 2 }, { x: 1, y: 1 })).toEqual({
    x: 1,
    y: 1,
  });
  expect(subtract({ x: 5, y: 6 }, { x: 3, y: 4 })).toEqual({
    x: 5 - 3,
    y: 6 - 4,
  });
  expect(subtract({ x: 3, y: 4 }, { x: 5, y: 6 })).toEqual({
    x: 3 - 5,
    y: 4 - 6,
  });
});

test("add test", () => {
  expect(add({ x: 2, y: 2 }, { x: 1, y: 1 })).toEqual({
    x: 3,
    y: 3,
  });

  expect(add({ x: -2, y: 2 }, { x: 1, y: -1 })).toEqual({
    x: -2 + 1,
    y: 2 + -1,
  });
});

test("pixelPointToTilePoint test", () => {
  expect(pixelPointToTilePoint({ x: TILE_SIZE * 3, y: TILE_SIZE * 4 })).toEqual(
    {
      x: 3,
      y: 4,
    }
  );
});
