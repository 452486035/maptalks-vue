<template>
  <div>
    <slot></slot>
  </div>
</template>
<script>
import * as maptalks from 'maptalks'
import graphicsManager from '../mixins/graphics'
/**
 * polygon 面组件
 */
export default {
  name: 'polygons',
  mixins: [graphicsManager],
  props: {
    /**
     * 面数据
     */
    polygonData: {
      type: Array,
      default: () => {
        return []
      }
    },
    /**
     *  polygon 面样式参数说明(官网地址：https://github.com/maptalks/maptalks.js/wiki/Symbol-Reference)
     * @param {Number} lineWidth 线宽度 default: 1
     * @param {String} lineColor 线颜色 default: black, 十六进制#fff or rgb(0,0,0) or rgba(0,0,0,1)
     * @param {Number} lineOpacity 线透明度 default:  1
     * @param {Number} polygonOpacity 面透明度 default:  1
     * @param {Number} polygonFill 面颜色 default: black, 十六进制#fff or rgb(0,0,0) or rgba(0,0,0,1)
     * @param {Number} polygonPatternFile 面填充 可为图片路径
     * @param {String} textName 线显示text文本 取值例如 '{name}' 此name为marker绑定数据的属性名称
     * @param {String} textFaceName 文本字体名称 例如 'microsoft yahei'
     * @param {Number} textSize 文字大小
     * @param {Number} textWeight 文字加粗 normal bold bolder lighter 100 200 300 400 500 600 700 800 900 default: normal
     * @param {String} textFill 文字颜色(16进制例如：#F00) default:  '#000'
     * @param {Number} textOpacity 文字透明度 default:  1
     * @param {Number} textDx 文字x(横)方向调整，负数向左方向调整，反之右方向调整 default:0
     * @param {Number} textDy 文字y(纵)方向调整，负数向上调整，反之向下调整 default:0
     * @param {String} textHaloFill 文字光晕颜色 颜色(16进制例如：#F00)
     * @param {Number} textHaloRadius 文字光晕大小
     * @param {Number} textHaloOpacity 文字光晕透明度
     * @param {String} shadowColor 阴影颜色 非常用参数
     * @param {Number} shadowBlur 阴影扩散大小 非常用参数
     * @param {Number} shadowOffsetX 阴影x方向调整 非常用参数
     * @param {Number} shadowOffsetY 阴影y方向调整 非常用参数
     * @param {Number} altitude 线高度
     */
    symbol: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      polygonSymbol: {} // 面样式
    }
  },
  watch: {
    polygonData(newdata, data) {
      if (data && data.length > 0) {
        newdata.forEach(item => {
          let obj = data.filter(x => x == item)
          if (obj.length == 0) this.createPolygon(obj)
        })
      } else {
        this.createPolygon(newdata)
      }
    }
  },
  beforeDestroy() {
    this.inter && clearInterval(this.inter)
  },
  mounted() {
    this.$nextTick(() => {
      this.init(() => this.createPolygon(this.polygonData))
    })
  },
  methods: {
    createPolygon(data) {
      this.$Graphics = []
      if (data.length == 0) return
      if (!this.layer) return
      data.forEach(item => {
        if (this.verifyData(item)) {
          if (this.symbol && this.symbol.altitude)
            item.altitude = this.symbol.altitude
          // 设置线条样式顺序,线段样式优先级大于统一样式
          this.polygonSymbol = Object.assign(
            {},
            this.symbol,
            item.symbol ? item.symbol : {}
          )
          let polygon = new maptalks.Polygon(item.rings, {
            symbol: this.polygonSymbol,
            properties: item.data
          })
            .addTo(this.layer)
            .on('click', e => {
              this.$emit('click', e)
              this.$children.length > 0 && this.$children[0].graphicClick(e)
            })
          this.setToolTip(polygon, item.data)
          this.$Graphics.push(polygon)
        }
      })
      this.zoomToFit()
    },
    // 缩放到适应层级
    zoomToFit() {
      if (this.isZoomToFitLevel) this.$parent.$layerZoomToFit()
    },
    /**
     * 数据项验证
     */
    verifyData(item) {
      if (item.rings && item.rings.length > 0) {
        return true
      } else {
        console.warn('Coordinates is empty or null, check your data')
        return false
      }
    }
  }
}
</script>