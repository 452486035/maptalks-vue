<template>
  <div :id="mapId" class="emap">
    <slot></slot>
  </div>
</template>
<script>
import * as maptalks from 'maptalks'
import guid from '@/utils/guid'
import { getBaseMapOption } from './baseMapOptions'
/**
 * 基础地图组件
 */
export default {
  name: 'eMap',
  props: {
    // 初始化地图类型
    mapType: {
      type: String,
      default: 'amap'
    },
    // 初始化中心经纬度
    center: {
      type: Array,
      default() {
        return [114.288205, 30.591633]
      }
    },
    // 最小缩放
    minZoom: {
      type: Number,
      default: 1
    },
    // 最大缩放
    maxZoom: {
      type: Number,
      default: 18
    },
    // 初始化缩放层级
    zoom: {
      type: Number,
      default: 10
    },
    // 初始化倾斜角度
    pitch: {
      type: Number,
      default: 0
    },
    //开源框架标识
    attribution: {
      type: Boolean,
      default: false
    },
    arcgisServiceUrl: {
      type: String,
      default: ''
    },
    // 图层瓦片服务配置
    layerConfig: {
      type: Object,
      default() {
        return {}
      }
    },
    // 地图的坐标类型  BD09(百度地图坐标系) | WGS84(1984年世界大地坐标系统) | GCJ02(火星坐标系)
    coordType: {
      type: String,
      default: 'WGS84'
    },
    _options: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      mapId: `mapBox${guid()}`,
      Map: null
    }
  },
  watch: {},
  created() {},
  beforeDestroy() {
    this.Map && this.Map.remove()
  },
  mounted() {
    setTimeout(() => {
      this.createMap()
    })
  },
  methods: {
    createMap() {
      //获取底图配置--google谷歌 tencent腾讯 tdt天地图 amap高德 baidu百度 baiduDeep百度深色 arcgis-arcgis服务
      getBaseMapOption(this.mapType, this.arcgisServiceUrl, option => {
        let _view = {
          center: this.center,
          zoom: this.zoom,
          minZoom: this.minZoom,
          maxZoom: this.maxZoom,
          pitch: this.pitch,
          attribution: this.attribution
        }
        option = Object.assign(option, _view)
        // if (this.mapType != "arcgis") option = Object.assign(option, _view);
        // else option = Object.assign(_view, option);
        this.Map = new maptalks.Map(this.mapId, option)
        this.$emit('mapReady', this.Map, this)
        this.mapEvents()
      })
    },
    mapEvents() {
      this.Map.on('click', e => {
        console.log(e.coordinate)
      })
    },
    /**
     * 设置地图中心
     */
    setCenter(point) {
      this.Map && this.Map.setCenter(point)
    },
    /**
     * 缩放到指定层级
     */
    setZoom(level) {
      this.Map && this.Map.setZoom(level)
    },
    setCenterAndZoom(point, level) {
      this.Map.setCenterAndZoom(point, level)
    },
    /**
     * 地图动画(缩放到指定层级zoom、坐标center、倾斜pitch、旋转bearing等,duration-动画持续时间)
     */
    animateTo(point, level) {
      this.Map.animateTo(
        {
          center: point,
          zoom: level
        },
        {
          duration: 1000
        }
      )
    },
    /**
     * 计算两点距离(meter)
     * @param {array} coord1 例如 [114.21061405761725, 30.588973122929104]
     */
    calculateLength(coord1, coord2) {
      return this.Map.computeLength(coord1, coord2)
    },
    /**
     * 获取地图截图
     */
    getMapImage(callback) {
      let data = this.Map.toDataURL({
        mimeType: 'image/jpeg', // or 'image/png'
        save: false, // to pop a save dialog
        fileName: 'map' // file name
      })
      callback(data)
    },
    /**
     * 创建图层
     */
    createLayer(layerid) {
      if (!this.Map) {
        console.log('Map is null')
        return
      }
      let layer = this.Map.getLayer(layerid)
      if (!layer) {
        layer = new maptalks.VectorLayer(layerid, {
          enableAltitude: true,
          forceRenderOnZooming: true
        })
        this.Map.addLayer(layer)
      }
      return layer
    }
  }
}
</script>
<style lang="scss" scoped>
.emap {
  width: 100%;
  height: 100%;
}
</style>