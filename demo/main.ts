import AMapTianDiTuLayer from "../src/index";
import "./style.css";

const layer = new AMap.TileLayer({
  zooms: [3, 20], //可见级别
  visible: false, //是否可见
  opacity: 1, //透明度
  zIndex: 0, //叠加层级
});
const map = new AMap.Map("container", {
  center: [112.936419, 28.18356],
  zoom: 3,
  layers: [layer],
});

const tianDiTuLayer = AMapTianDiTuLayer({
  map: map,
  url:
    "http://t{0,1,2,3}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX=[z]&TILEROW=[y]&TILECOL=[x]&tk=5ea255f17355f877501306a82bf476b2",
  zIndex: 2,
  // renderType: "canvas",
});

map.add(tianDiTuLayer);
