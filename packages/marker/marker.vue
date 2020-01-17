<template>
  <div>
    <slot></slot>
  </div>
</template>
<style lang="scss">
.mapToolTip {
  min-width: 100px;
  max-width: 300px;
  padding: 5px;
  background: rgba(
    $color: (
      #fff
    ),
    $alpha: 0.8
  ) !important;
  border: none !important;
  border-radius: 3px !important;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.4) !important;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
<script>
import * as maptalks from 'maptalks'
import graphicsManager from '../mixins/graphics'
/**
 * marker标注组件
 */
export default {
  name: 'markers', //命名marker与系统自带marker标识冲突
  mixins: [graphicsManager],
  props: {
    /**
     * 标注数据
     */
    pointData: {
      type: Array,
      default:  ()=>{
        return []
      }
    },
    /**
     * marker标注样式参数说明(官网地址：https://github.com/maptalks/maptalks.js/wiki/Symbol-Reference)
     * @param {String||object} markerFile 标注路径 例如 '../public/image/marker3.png' 或者 require('../public/image/marker3.png')
     * @param {Number} markerWidth 标注宽度 default: 标注原宽度
     * @param {Number} markerHeight 标注高度 default: 标注原高度度
     * @param {Number} markerOpacity 标注透明度 default:  1
     * @param {Number} markerDx 标注x(横)方向调整，负数向左调整，反之向右调整 default:0
     * @param {Number} markerDy 标注y(纵)方向调整，负数向上调整，反之向下调整 default:0
     * @param {String} textName 标注显示text文本 取值例如 '{name}' 此name为marker绑定数据的属性名称
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
     * @param {String} markerHorizontalAlignment 标注水平方向对齐方式 left middle right 非常用参数
     * @param {String} markerVerticalAlignment 标注竖直方向对齐方式 left middle right 非常用参数
     * @param {Number} markerRotation 标注旋转角度 非常用参数
     * @param {Number} altitude 标注高度
     */
    symbol: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    pointData(newdata, data) {
      if (data && data.length > 0) {
        newdata.forEach(item => {
          let obj = data.filter(x => x == item)
          if (obj.length == 0) this.createMarker(obj)
        })
      } else {
        this.createMarker(newdata)
      }
    }
  },
  data() {
    return {
      markerSymbol: {}
    }
  },
  beforeDestroy() {
    this.inter && clearInterval(this.inter)
  },
  mounted() {
    this.$nextTick(() => {
      this.init(() => {
        this.createMarker(this.pointData)
      })
    })
  },
  methods: {
    createMarker(data) {
      this.$Graphics = []
      if (data.length == 0) return
      if (!this.layer) return
      data.forEach(item => {
        if (this.verifyData(item)) {
          if (this.symbol && this.symbol.altitude)
            item.altitude = this.symbol.altitude
          this.markerSymbol = Object.assign(
            {},
            this.symbol,
            item.symbol ? item.symbol : {}
          )
          //创建marker
          let marker = new maptalks.Marker([Number(item.x), Number(item.y)], {
            symbol: this.markerSymbol,
            properties: item
          })
            .addTo(this.layer)
            .on('click', e => {
              this.$emit('graphicClick', e)
              this.$children.length > 0 && this.$children[0].graphicClick(e)
            })
          this.$Graphics.push(marker)
          this.setToolTip(marker, item)
        }
      })
      if (this.isZoomToFitLevel) this.$parent.$layerZoomToFit()
    },
    /**
     * 数据项验证
     */
    verifyData(item) {
      if (
        item.x &&
        item.x != null &&
        !isNaN(Number(item.x)) &&
        item.y &&
        item.y != null &&
        !isNaN(Number(item.y))
      ) {
        return true
      } else {
        console.log('Coordinates is empty or null or NAN, check your data(x,y)')
        return false
      }
    }
  }
}
</script>