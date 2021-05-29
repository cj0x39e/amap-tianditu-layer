import { toBounds, center } from "../lib/bounds";

test("toBounds test", () => {
  expect(toBounds({ x: 1, y: 1 }, { x: 2, y: 2 })).toEqual({
    min: { x: 1, y: 1 },
    max: { x: 2, y: 2 },
  });
  expect(toBounds({ x: -1, y: 1 }, { x: 2, y: -2 })).toEqual({
    min: { x: -1, y: -2 },
    max: { x: 2, y: 1 },
  });
});

test("center test", () => {
  expect(
    center({
      min: { x: 2, y: 2 },
      max: { x: 4, y: 4 },
    })
  ).toEqual({
    x: 3,
    y: 3,
  });
  expect(
    center({
      min: { x: -1, y: -2 },
      max: { x: 2, y: 1 },
    })
  ).toEqual({
    x: 1 / 2,
    y: -1 / 2,
  });
});
