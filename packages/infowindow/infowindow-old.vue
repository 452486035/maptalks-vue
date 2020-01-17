<template>
  <div></div>
</template>
<style lang="scss" scoped>
@import url(./infowindow.scss);
</style>
<script>
import * as maptalks from 'maptalks'
import guid from '../utils/guid'
import { vueFormatHtml, getInfowindowThemeHtml } from './infowindowTheme'
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
      default: ''
    },
    /**
     * 是否只能同时显示一个弹窗
     */
    isSingle: {
      type: Boolean,
      default: false
    },
    textField: {
      type: String,
      default: ''
    },
    title: {
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
      closeBtnId: guid()
    }
  },
  watch: {},
  beforeDestroy() {
    if (this.inter) clearInterval(this.inter)
  },
  mounted() {},
  methods: {
    /**
     * 父组件标注点击事件
     * @param $evtObj 标注点击事件对象 $evtObj.target-标注对象 $evtObj.target.getProperties()-获取标注绑定的数据
     */
    markerClick($evtObj) {
      if (this.isCustom) $emit('markerClick', $evtObj)
      //自定义弹窗则返回标注数据让其自定义html回调setInfoWindow方法弹窗
      else if (this.theme) this.setInfoWindow($evtObj)
    },
    /**
     * 显示弹窗
     * @param evtObj 标注点击事件对象
     * @param vHtml 自定义htmlTemplate
     */
    setInfoWindow(evtObj, vHtml) {
      let graphic = evtObj.target
      let attr = graphic.getProperties()
      let content = this.isCustom
        ? vueFormatHtml(vHtml)
        : getInfowindowThemeHtml(
            this.theme,
            attr,
            this.textField,
            this.title,
            this.closeBtnId
          )
      var options = {
        custom: true,
        single: this.isSingle,
        autoPan: this.isAutoPan,
        dx: this.infoPositionDx,
        dy: this.infoPositionDy,
        content: content
      }
      if (this.theme) options = Object.assign(options, this.getOpts())
      var infoWindow = new maptalks.ui.InfoWindow(options)
      infoWindow.addTo(graphic).show()
      // infoWindow.addTo(graphic).show(evtObj.coordinate);
      this.currentGraphic = graphic
      this.infoWindowEvents(attr)
      // graphic.removeInfoWindow();
      // graphic.setInfoWindow(options);
      // graphic.openInfoWindow();
    },
    getOpts() {
      let obj = {
        simpleWhite: {
          dx: 100,
          dy: 65
        },
        simpleDark: {
          dx: 100,
          dy: 65
        }
      }
      return obj[this.theme]
    },
    /**
     * 窗口事件绑定
     */
    infoWindowEvents() {
      //关闭按钮点击事件
      let closedom = document.getElementById(this.closeBtnId)
      if (closedom) {
        closedom.addEventListener('click', e => {
          this.currentGraphic && this.currentGraphic.closeInfoWindow()
        })
      }
      return
      let poi_name_dom = document.getElementsByClassName('poi_name')
      if (poi_name_dom.length > 0)
        poi_name_dom[0].addEventListener(
          'mouseover mouseout mousemove',
          event => {
            var left = event.pageX,
              top = event.pageY
            var ele = event.target
            var title = attr[this.textField]
            var type = event.originalEvent.type
            if (type == 'mouseover') {
              //if(title && title.length > 0){
              if (title != null) {
                var showEle = $('<div></div>', {
                  text: title,
                  class: 'showTitleBox'
                }).css({
                  position: 'absolute',
                  top: top + 10,
                  left: left,
                  borderRadius: '5px',
                  background: 'ra',
                  fontFamily: 'SimHei'
                })
                showEle.appendTo('body')
              }
            } else if (type == 'mouseout') {
              $('.showTitleBox').remove()
            } else if (type == 'mousemove') {
              $('.showTitleBox').css({
                top: top + 10,
                left: left
              })
            }
          }
        )
    }
  }
}
</script>