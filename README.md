# amap-tianditu-layer

高德地图天地图图层插件，由于高德地图使用 GCJ-02 坐标，天地图使用 CGCS2000，当在高德地图中混合使用天地图时会有偏移问题。本插件借助高德 API 提供的 CustomLayer 接口，自定义瓦片计算过程渲染天地图，修正偏移。

注意目前该插件只在高德 API v1.4.15 做了测试。

本插件的工作原理：

```base
高德回调 CustomLayer 的 render
    ↓↓
获取当前经纬度中心点(GCJ-02)
    ↓↓
转换中心点为 WGS84 坐标点
    ↓↓
使用 WGS84 中心点投影变幻计算当前需要加载的瓦片
    ↓↓
渲染瓦片
```

为什么中心点坐标是转为 WGS84，而不是转为 CGCS2000 ？主要是因为有现成的 GCJ-02 => WGS84 转换工具 [gcoord](https://github.com/hujiulong/gcoord) ，而且 WGS84 和 CGCS2000 误差极小（非高精度基本可忽略），所以就这样处理了。

### 如何使用

#### npm 方式

```base
npm i amap-tianditu-layer -S

// typescript 使用需要安装 @amap/amap-jsapi-types
```

```ts
import AMapTianDiTuLayer from "amap-tianditu-layer";

const map = new AMap.Map("container", {
  center: [117.000923, 36.675807],
  zoom: 3,
});

const tianDiTuLayer = AMapTianDiTuLayer.init({
  map: map,
  url:
    "http://t{0,1,2,3}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX=[z]&TILEROW=[y]&TILECOL=[x]&tk=你的key",
  zIndex: 2,
});

map.add(tianDiTuLayer);
```

#### CDN 方式

### TODO

- 高德地图 v2 版本测试
- 渲染逻辑优化使之更流畅
- 完善测试用例

### 致谢

1. [gcoord](https://github.com/hujiulong/gcoord) ，该库提供了坐标系转换算法。
2. [leafletjs](https://leafletjs.com/) ，本插件的渲染过程，思路完全借鉴 leafletjs。

以及网络上众多 GIS 技术相关的博客，不一一列举了。
