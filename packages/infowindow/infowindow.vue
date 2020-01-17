<template>
  <div></div>
</template>
<style lang="scss" scoped>
@import url(./infowindow.scss);
</style>
<script>
import * as maptalks from 'maptalks'
import guid from '@/utils/guid'
/**
 * graphic信息弹出窗组件
 */
export default {
  name: 'infowindow',
  props: {
    /**
     * 默认主题 simpleWhite-简白 simpleDark-简黑 largerWhite largerDark
     */
    theme: {
      type: String,
      default: 'default'
    },
    /**
     * 是否只能同时显示一个弹窗
     */
    isSingle: {
      type: Boolean,
      default: true
    },
    /**
     * 显示内容字段
     */
    textField: {
      type: String,
      default: ''
    },
    /**
     * 标题内容
     */
    title: {
      type: String,
      default: ''
    },
    /**
     * 标题字段
     */
    titleField: {
      type: String,
      default: ''
    },
    /**
     * 是否自动移动视角(当弹出窗容器显示不下的时候自动平移以显示完全)
     */
    isAutoPan: {
      type: Boolean,
      default: true
    },
    /**
     * 是否自定义弹窗
     */
    isCustom: {
      type: Boolean,
      default: false
    },
    zoomCloseInfowindow: {
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: 200
    },
    height: {
      type: Number,
      default: 0
    },
    /**
     * 弹窗x方向调整
     */
    infoPositionDx: {
      type: Number,
      default: 0
    },
    /**
     * 弹窗y方向调整
     */
    infoPositionDy: {
      type: Number,
      default: 0
    },
    infoConfig: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      currentGraphic: null,
      inter: null,
      closeBtnId: guid()
    }
  },
  watch: {},
  beforeDestroy() {
    this.zoomCloseInfowindow &&
      this.$parent.$parent.Map.removeEventListener('zoomstart', this.close)
    this.inter && clearInterval(this.inter)
  },
  mounted() {
    this.inter = setInterval(() => {
      if (this.$parent.$parent.Map) {
        if (this.zoomCloseInfowindow)
          this.$parent.$parent.Map.on('zoomstart', this.close)
        clearInterval(this.inter)
      }
    }, 100)
  },
  methods: {
    /**
     * 父组件标注点击事件
     * @param $evtObj 标注点击事件对象 $evtObj.target-标注对象 $evtObj.target.getProperties()-获取标注绑定的数据
     */
    graphicClick($evtObj) {
      if (this.isCustom) return
      //自定义弹窗则返回标注数据让其自定义html回调 show 方法弹窗
      else if (this.theme) this.show($evtObj)
    },
    /**
     * 显示弹窗
     * @param evtObj 标注点击事件对象
     * @param vHtml 自定义htmlTemplate
     */
    show(evtObj, vHtml) {
      let graphic = evtObj.target
      let attr = graphic.getProperties()
      let content = ''
      if (!this.isCustom) {
        if (!attr[this.textField]) return
        content = attr[this.textField]
      } else content = vHtml || ''
      var options = {
        custom: this.isCustom ? true : false,
        width: this.width,
        height: this.height,
        single: this.isSingle,
        autoPan: this.isAutoPan,
        dx: this.infoPositionDx,
        dy: this.infoPositionDy,
        content: content
      }
      if (this.title && !this.isCustom) {
        options.title = this.title
        if (this.titleField) options.title = attr[this.titleField]
      }
      var infoWindow = new maptalks.ui.InfoWindow(options)
      infoWindow.addTo(graphic)
      // graphic.setInfoWindow(options);
      graphic.openInfoWindow()
      // infoWindow.addTo(graphic).show(evtObj.coordinate);
      this.currentGraphic = graphic
    },
    /**
     * 窗口事件绑定
     */
    infoWindowEvents() {
      //关闭按钮点击事件
      let closedom = document.getElementById(this.closeBtnId)
      if (closedom) {
        closedom.addEventListener('click', () => {
          this.close()
        })
      }
    },
    close() {
      this.currentGraphic && this.currentGraphic.closeInfoWindow()
    }
  }
}
</script>