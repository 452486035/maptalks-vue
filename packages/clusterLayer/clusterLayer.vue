<template>
  <div>
    <slot></slot>
  </div>
</template>
<script>
import * as markercluster from 'maptalks.markercluster'
import guid from '../utils/guid'
import comLayer from '../mixins/comLayer'
/**
 * 地图聚合图层组件
 */
export default {
  name: 'clusterLayer',
  mixins: [comLayer],
  props: {
    /**
     * 显示聚合的最大层级(根据实际地图层级设置适合层级)
     */
    maxClusterZoom: {
      type: Number,
      default: 16
    },
    /**
     * 聚合文字样式
     */
    textSymbol: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  beforeDestroy() {
    this.inter && clearInterval(this.inter)
  },
  mounted() {
    this.$nextTick(() => {
      this.init(() => {
        this.initLayer()
      })
    })
  },
  methods: {
    /**
     * 初始化图层
     */
    initLayer() {
      this.$layerId = this.layerId
      if (!this.layerId) this.$layerId = `cluster$Layer${guid()}`
      //创建图层
      let symbol = this.getSymbol()
      let layer = new markercluster.ClusterLayer(
        this.$layerId,
        [],
        symbol
      ).addTo(this.Map)
      layer.clear().bringToFront()
      this.$Layer = layer
      if (this.zIndex != 0) this.$setZindex(this.zIndex)
    },
    getSymbol() {
      let symbol = {
        markerType: 'ellipse',
        markerFill: {
          property: 'count',
          type: 'interval',
          stops: [
            [0, '#90c8ff'],
            [9, '#ffcb6f'],
            [19, '#ff9595'],
            [50, '#eea9ff']
          ]
        },
        markerFillOpacity: 1,
        markerLineOpacity: 0.2,
        markerLineWidth: 15,
        markerLineColor: {
          property: 'count',
          type: 'interval',
          stops: [
            [0, '#90c8ff'],
            [9, '#ffcb6f'],
            [19, '#ff9595'],
            [50, '#eea9ff']
          ]
        },
        markerWidth: {
          property: 'count',
          type: 'interval',
          stops: [
            [0, 35],
            [9, 35],
            [19, 35],
            [50, 35]
          ]
        },
        markerHeight: {
          property: 'count',
          type: 'interval',
          stops: [
            [0, 35],
            [9, 35],
            [19, 35],
            [50, 35]
          ]
        }
      }
      let textSymbol = {
        textFaceName: 'Arial, Helvetica, sans-serif',
        textDy: 2,
        textSize: 17,
        textFill: '#fff'
      }
      textSymbol = Object.assign(textSymbol, this.textSymbol)
      let markerSymbol = {
        noClusterWithOneMarker: true,
        maxClusterZoom: this.maxClusterZoom,
        symbol: symbol,
        drawClusterText: true,
        geometryEvents: true,
        single: true,
        textSymbol: textSymbol
      }
      return markerSymbol
    }
  }
}
</script>