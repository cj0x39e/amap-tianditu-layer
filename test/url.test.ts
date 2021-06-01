import { Tile } from "../src/types";
import {
  getDomainList,
  getRandomDomainUrl,
  getTileUrl,
  parseUrl,
} from "../src/url";

const u1 = "https://{1,2,3}.test?[x][y][z]";
const u2 = "https://4.test?x=[x]&y=[y]&z=[z]";

test("geDomainList test", () => {
  expect(getDomainList(u1)).toEqual(["1", "2", "3"]);
  expect(getDomainList(u2)).toEqual([]);
});

test("getRandomDomainUrl test", () => {
  expect(getRandomDomainUrl(getDomainList(u1), u1)).toMatch(
    /https:\/\/[1,2,3]\.test/
  );
  expect(getRandomDomainUrl(getDomainList(u2), u2)).toMatch(/https:\/\/4.test/);
});

test("getTileUrl test", () => {
  expect(getTileUrl({ x: 1, y: 1, z: 1 } as Tile, u1)).toEqual(
    "https://{1,2,3}.test?111"
  );
  expect(getTileUrl({ x: 1, y: 1, z: 1 } as Tile, u2)).toEqual(
    "https://4.test?x=1&y=1&z=1"
  );
});

test("parse Url", () => {
  expect(parseUrl({ x: 1, y: 1, z: 1 } as Tile, u1)).toMatch(
    /https:\/\/[1,2,3]\.test\?111/
  );
  expect(parseUrl({ x: 1, y: 1, z: 1 } as Tile, u2)).toMatch(
    /https:\/\/4\.test\?x=1&y=1&z=1/
  );
});
