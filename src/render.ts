import { TILE_SIZE } from "./const";
import { parseUrl } from "./url";
import { TileImage, Tile } from "./types";
import { getCacheStore } from "./cacheStore";

const wrapGetCacheStore = () => getCacheStore<TileImage>();
const getTileKey = (tile: Tile) => `${tile.x}-${tile.y}-${tile.z}`;

export const render = (
  tileList: Tile[],
  canvas: CanvasRenderingContext2D,
  url: string,
  renderId: { current: number },
  cacheStore: ReturnType<typeof wrapGetCacheStore>,
  width: number,
  height: number
) => {
  // 清除画布
  canvas.clearRect(0, 0, width, height);

  tileList.forEach((tile) => {
    const tileKey = getTileKey(tile);
    let img: TileImage | null = null;
    if (cacheStore.isCached(tileKey)) {
      img = cacheStore.getItem(tileKey);
      canvas.drawImage(img, tile.pX, tile.pY, TILE_SIZE, TILE_SIZE);
    } else {
      img = new Image() as TileImage;
      img.src = parseUrl(tile, url);
      img.onload = () => {
        if (img !== null) {
          cacheStore.addItem(tileKey, img);

          if (img.__renderId === renderId.current) {
            window.requestAnimationFrame(() => {
              canvas.drawImage(img!, tile.pX, tile.pY, TILE_SIZE, TILE_SIZE);
            });
          }
        }
      };
    }

    img.__renderId = renderId.current;
  });
};
