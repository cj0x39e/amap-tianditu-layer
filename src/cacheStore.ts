type CacheItem<T> = { key: string; data: T };

/**
 * 创建数据缓存器
 * @param cacheMax 最大缓存数量
 * @returns
 */
export const getCacheStore = <T = unknown>(cacheMax = 50) => {
  const cacheList: CacheItem<T>[] = [];
  const cacheMap: { [key: string]: number } = {};
  let deleteCount = 0;
  let index = 0;

  const isCached = (key: string) => {
    return cacheMap[key] !== undefined;
  };

  const removeOverflow = () => {
    if (cacheList.length > cacheMax) {
      const item = cacheList.shift();
      if (item !== undefined) {
        delete cacheMap[item.key];
        deleteCount += 1;
      }
    }
  };

  const addItem = (key: string, data: T) => {
    if (!isCached(key)) {
      cacheList.push({ key, data });
      removeOverflow();
      cacheMap[key] = index;
      index += 1;
    }
  };

  const getItem = (key: string) => {
    return cacheList[cacheMap[key] - deleteCount].data;
  };

  return {
    isCached,
    addItem,
    getItem,
  };
};
