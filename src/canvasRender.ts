import { TILE_SIZE } from "./const";
import { parseUrl } from "./url";
import { TileImage, Tile } from "./types";
import { getCacheStore } from "./cacheStore";

const getTileKey = (tile: Tile) => `${tile.x}-${tile.y}-${tile.z}`;

export const getRender = (
  url: string,
  width: number,
  height: number,
  cacheSize?: number
) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const canvas2DCtx = canvas.getContext("2d");
  const renderId: { current: number } = { current: 1 };
  const cacheStore = getCacheStore<TileImage>(cacheSize);

  return {
    container: canvas,
    render: (tileList: Tile[]) => {
      const eachRenderNumber = 10;
      const nowRenderId = renderId.current;
      let total = tileList.length;
      let eachCount = 0;
      let count = 0;
      let cacheList: [TileImage, number, number][] = [];

      canvas2DCtx!.clearRect(0, 0, width, height);

      const render = (
        img: TileImage | null,
        pX: number | null,
        pY: number | null
      ) => {
        if (img !== null && pX !== null && pY !== null) {
          cacheList.push([img, pX, pY]);
        }

        if (
          eachCount === eachRenderNumber ||
          total - count < eachRenderNumber
        ) {
          window.requestAnimationFrame(
            function (list: [TileImage, number, number][]) {
              if (nowRenderId == renderId.current) {
                list.forEach(([img, pX, pY]) => {
                  canvas2DCtx!.drawImage(img, pX, pY, TILE_SIZE, TILE_SIZE);
                });
              }
            }.bind(null, [...cacheList])
          );
          eachCount = 0;
          cacheList = [];
        }
        eachCount++;
        count++;
      };

      tileList.forEach((tile) => {
        const tileKey = getTileKey(tile);

        if (cacheStore.isCached(tileKey)) {
          total--;
          canvas2DCtx!.drawImage(
            cacheStore.getItem(tileKey),
            tile.pX,
            tile.pY,
            TILE_SIZE,
            TILE_SIZE
          );
        } else {
          const img = new Image() as TileImage;
          img.src = parseUrl(tile, url);

          img.onload = function (this: TileImage, pX: number, pY: number) {
            cacheStore.addItem(tileKey, this);
            render(this, pX, pY);
          }.bind(img, tile.pX, tile.pY);
          img.onerror = () => {
            render(null, null, null);
          };
        }
      });
    },
  };
};
