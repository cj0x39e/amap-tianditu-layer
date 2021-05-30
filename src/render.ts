import { Tile } from "./types";
import { TILE_SIZE } from "./const";
import { parseUrl } from "./url";
import { TileImage } from "./types";

export const render = (
  tileList: Tile[],
  canvas: HTMLElement,
  url: string,
  renderId: { current: number }
) => {
  const imgList: TileImage[] = canvas.children as any;

  tileList.forEach((tile, index) => {
    // 如果有图片元素，从最后的图片元素开始替换
    // 这样保证当替换的图片个数小于已渲染的图片个数时，未替换的图片不会
    // 盖在已替换的图片上
    let img: TileImage = imgList[imgList.length - index - 1] as TileImage;
    if (!img) {
      img = new Image(TILE_SIZE, TILE_SIZE) as TileImage;
      img.style.position = "absolute";
    }
    const src = parseUrl(tile, url);

    // 使用一个临时的图片对象监听图片是否加载完毕
    // 当某个瓦片图加载完毕之后再设置到对应的需要显示的瓦片图位置，减少闪动
    const temp = new Image() as TileImage;
    temp.src = src;
    temp.onload = () => {
      // 通过对比渲染 id,确保当前的图像是当前需要显示的
      // 因为网络问题可能导致图像的到达顺序错乱
      if (temp.__renderId === renderId.current) {
        img.src = temp.src;
      }
    };
    temp.__renderId = renderId.current;
    img.style.transform = `translate3d(${tile.pX + "px"}, ${
      tile.pY + "px"
    }, 0)`;

    if (!canvas.contains(img)) {
      canvas.appendChild(img);
    }
  });
};
