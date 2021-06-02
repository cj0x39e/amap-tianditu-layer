import { Tile, TileImage } from "./types";
import { TILE_SIZE } from "./const";
import { parseUrl } from "./url";

const getTileKey = (tile: Tile) => `${tile.x}-${tile.y}-${tile.z}`;

export const getRender = (url: string, width: number, height: number) => {
  // 由于高德定义的参数类型为 canvas ，但实际上他既支持 canvas 也支持 dom
  // 所以这里强制转换一下
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const container: HTMLCanvasElement = document.createElement("div") as any;
  container.style.width = width.toString() + "px";
  container.style.height = height.toString() + "px";

  const imgList: TileImage[] = [];

  return {
    render: (tileList: Tile[]) => {
      // 根据瓦片数量增量渲染图片元素
      if (tileList.length > imgList.length) {
        const newLen = tileList.length - imgList.length;
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < newLen; i++) {
          const img = new Image(TILE_SIZE, TILE_SIZE) as TileImage;
          img.style.position = "absolute";
          img.style.top = "0";
          img.style.left = "0";

          imgList.push(img);
          fragment.appendChild(img);
        }

        container.appendChild(fragment);
      }

      const imgTileKeyMap: { [key: string]: [TileImage, number] } = {};
      imgList.forEach((img, index) => {
        const tileKey = img.__tileKey;
        if (tileKey) {
          imgTileKeyMap[tileKey] = [img, index];
        }
        img.style.display = "none";
      });

      const replaceTileList: [Tile, string][] = [];
      const outImgIndexMap: { [key: number]: true } = {};
      tileList.forEach((tile) => {
        const tileKey = getTileKey(tile);
        const info = imgTileKeyMap[tileKey];
        if (info) {
          const [cacheImg, index] = info;
          cacheImg.style.transform = `translate3d(${
            tile.pX.toString() + "px"
          }, ${tile.pY.toString() + "px"}, 0)`;
          cacheImg.style.display = "block";
          outImgIndexMap[index] = true;
        } else {
          replaceTileList.push([tile, tileKey]);
        }
      });

      let index = 1;
      const replaceImgList = imgList.filter((_, i) => !outImgIndexMap[i]);
      replaceTileList.forEach(([tile, tileKey]) => {
        const img = replaceImgList[replaceImgList.length - index];
        img.src = parseUrl(tile, url);
        img.style.transform = `translate3d(${tile.pX.toString() + "px"}, ${
          tile.pY.toString() + "px"
        }, 0)`;
        img.style.display = "block";
        img.__tileKey = tileKey;
        index++;
      });
    },
    container,
  };
};
