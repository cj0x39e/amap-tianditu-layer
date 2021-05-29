# amap-tianditu-layer

高德地图天地图图层插件，由于高德地图使用 GCJ-02 坐标，天地图使用 CGCS2000，当在高德地图中混合使用天地图时会有偏移问题。本插件借助高德 API 提供的 CustomLayer 接口，自定义瓦片计算过程渲染天地图，修正偏移。

本插件的工作原理：

```base
高德回调 CustomLayer 的 render => 获取当前经纬度中心点(GCJ-02) => 转换中心点为 WGS84 坐标点 => 使用 WGS84 中心点投影变幻计算当前需要加载的瓦片 => 渲染瓦片
```

由于 WGS84 与 CGCS2000 误差极小，又由于有现成的 GCJ-02 => WGS84 转换工具 [gcoord](https://github.com/hujiulong/gcoord) ，所以转换过程如此处理。

### 如何使用

### 致谢

1. [gcoord](https://github.com/hujiulong/gcoord) ，该库提供了坐标系转换算法。
2. [leafletjs](https://leafletjs.com/) ，本插件的渲染过程，思路完全借鉴 leafletjs。

以及网络上众多 GIS 技术相关的博客，不一一列举了。
