export default {
    props: {
        //图层名称
        layerId: {
            type: String,
            default: ''
        },
        //图层上下层级顺序 zindex越大越在前显示
        zIndex: {
            type: Number,
            default: 0
        },
        // 控制图层显隐
        show: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            Map: null, //地图对象
            $layerId: '', //图层名称
            $Layer: null, //图层对象
            inter: null
        }
    },
    watch: {
        show: {
            handler(value) {
                if (value) {
                    this.$showLayer()
                } else {
                    this.$hideLayer()
                }
            },
            immediate: true
        }
    },
    methods: {
        /**
         * 获取地图对象
         * @param mapsuccess 成功后回调
         */
        init(mapsuccess) {
            this.inter = setInterval(() => {
                if (this.$parent.Map) {
                    clearInterval(this.inter)
                    this.Map = this.$parent.Map
                    if (mapsuccess) mapsuccess();
                }
            }, 100)
        },
        /**
         * 设置图层显示级别
         * @param index 层级(数值越大越在前显示)
         */
        $setZindex(index) {
            this.$Layer && this.$Layer.setZIndex(index)
        },
        /**
         * 显示当前图层
         */
        $showLayer() {
            this.$Layer && this.$Layer.show()
        },
        /**
         * 隐藏当前图层
         */
        $hideLayer() {
            this.$Layer && this.$Layer.hide()
        },
        /**
         * 清除当前图层
         */
        $clearLayer() {
            this.$Layer && this.$Layer.clear()
        },
        /**
         * 移除当前图层
         */
        $removeLayer() {
            this.$Layer && this.$Layer.remove()
        },
        /**
         * 缩放到图层适应层级
         * @param {string} _layerId 图层名称
         */
        $layerZoomToFit() {
            let layer = this.$Layer
            if (!layer) return
            if (layer.getGeometries().length == 0) return
            let Extent = layer.getExtent()
            let coord = Extent.getCenter()
            let zoom = this.Map.getFitZoom(Extent)
            this.$parent.animateTo(coord, zoom)
        }
    },

    beforeDestroy() {
        if (this.inter) clearInterval(this.inter)
    },
}