import { Tile } from "./types";

/**
 * 解析模板地址子域名，解析 {a,b,c} 格式
 * @param url
 * @returns
 */
export const getDomainList = (url: string) => {
  const mathResult = url.match(/\{(.+)\}/);
  const subDomainStr = mathResult !== null ? mathResult[1] || "" : "";
  const subDomainList = subDomainStr !== "" ? subDomainStr.split(",") : [];
  return subDomainList;
};

/**
 * 获取随机子域名地址
 * @param domainList
 * @param url
 * @returns
 */
export const getRandomDomainUrl = (domainList: string[], url: string) => {
  if (domainList.length) {
    const random = Math.floor(Math.random() * 10) % domainList.length;
    const domain = domainList[random];
    return url.replace(/\{.+\}/, domain);
  } else {
    return url;
  }
};

/**
 * 替换模板地址坐标数据
 * @param tile
 * @param url
 * @returns
 */
export const getTileUrl = (tile: Tile, url: string) => {
  url = url.replace(/\[x\]/, tile.x.toString());
  url = url.replace(/\[y\]/, tile.y.toString());
  url = url.replace(/\[z\]/, tile.z.toString());

  return url;
};

/**
 * 根据瓦片信息和模板地址得到最终地址
 * @param tile
 * @param url
 * @returns
 */
let domainList: string[] | null = null;
export const parseUrl = (tile: Tile, url: string) => {
  if (domainList === null) {
    domainList = getDomainList(url);
  }
  return getRandomDomainUrl(domainList, getTileUrl(tile, url));
};
