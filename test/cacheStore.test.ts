import { getCacheStore } from "../lib/cacheStore";

let cacheStore: ReturnType<typeof getCacheStore>;
let cacheKey = "test-key";
let cacheItem = { name: "cj0x39e" };

beforeEach(() => {
  cacheStore = getCacheStore(2);
});

test("调用 getCacheStore 应该有返回值", () => {
  expect(cacheStore).toBeDefined();
});

test("缓存一个值，取出应该等于缓存前的值", () => {
  cacheStore.addItem(cacheKey, cacheItem);
  const getCacheItem = cacheStore.getItem(cacheKey);
  expect(getCacheItem === cacheItem).toBe(true);
});

test("缓存一个值，检查其是否已缓存应返回 true", () => {
  cacheStore.addItem(cacheKey, cacheItem);
  expect(cacheStore.isCached(cacheKey)).toBe(true);
});

test("检查未缓存的值，应返回 false", () => {
  expect(cacheStore.isCached("no-cache-key")).toBe(false);
});

test("设置缓存大小后，超出缓存大小后应删除之前缓存的值", () => {
  const secondKey = "second-key";
  const thirdKey = "third-Key";
  const secondItem = { name: "second" };
  const thirdItem = { name: " third" };
  cacheStore.addItem(cacheKey, cacheItem);
  cacheStore.addItem(secondKey, secondItem);
  cacheStore.addItem(thirdKey, thirdItem);

  expect(cacheStore.isCached(cacheKey)).toBe(false);
  expect(cacheStore.getItem(secondKey) === secondItem).toBe(true);
  expect(cacheStore.getItem(thirdKey) === thirdItem).toBe(true);
});
