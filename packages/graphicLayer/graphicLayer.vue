<template>
  <div>
    <slot></slot>
  </div>
</template>
<script>
import guid from '../utils/guid'
import comLayer from '../mixins/comLayer'
/**
 * 地图图层组件
 */
export default {
  name: 'graphicLayer',
  mixins: [comLayer],
  mounted() {
    this.$nextTick(() => {
      this.init(this.initLayer)
    })
  },
  methods: {
    /**
     * 初始化图层
     */
    initLayer() {
      this.$layerId = this.layerId
      if (!this.layerId) this.$layerId = `graphic$Layer${guid()}`
      //创建图层
      let layer = this.$parent.createLayer(this.$layerId)
      layer.clear().bringToFront()
      this.$Layer = layer
      if (this.zIndex != 0) this.$setZindex(this.zIndex)
    }
  }
}
</script>