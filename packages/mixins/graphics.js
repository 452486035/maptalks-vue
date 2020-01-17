import * as maptalks from 'maptalks'

export default {
    props: {
        /**
         * 是否缩放到适应层级
         */
        isZoomToFitLevel: {
            type: Boolean,
            default: true
        },
        /**
         * 是否显示提示
         */
        showToolTip: {
            type: Boolean,
            default: false
        },
        /**
         * 提示显示内容数据字段
         */
        toolTipField: {
            type: String,
            default: ''
        },
        /**
         * 是否自定义提示
         */
        // toolTipCustom: {
        //     type: Boolean,
        //     default: false
        // }
    },
    data() {
        return {
            layer: null, //父级图层对象
            inter: null,
            glowInters: [], //'发光'定时器
            glowTarget: null,
            $Graphics: [] //当前要素集合
        }
    },
    watch: {},
    methods: {
        /**
         * 获取图层
         * @param _call 成功后回调
         */
        init(_call) {
            this.inter = setInterval(() => {
                //获取父组件图层
                this.layer = this.$parent.$Layer
                if (this.layer) {
                    clearInterval(this.inter)
                    if (_call) _call();
                }
            }, 100)
        },
        /**
         * 根据属性字段值查找要素(点 线 面等)
         * @param {string} field 字段
         * @param {array} fieldVal 字段值数组 例 ['**','**']
         * 返回marker Array<maptalks.Marker||maptalks.LineString>
         */
        findGraphic(field, fieldVal) {
            let graphics = this.$Graphics.filter(graphic =>
                fieldVal.some(item => item == graphic.getProperties()[field])
            )
            if (graphics.length == 0) return;
            return graphics
        },
        /**
         * 隐藏要素
         * @param {Array<maptalks.Marker||maptalks.LineString>} 要素对象(数组)
         */
        hide(graphics) {
            // if (!graphics) this.$Graphics.forEach(graphic => graphic.hide())
            if (!graphics) return;
            if (Array.isArray(graphics)) graphics.forEach(graphic => graphic.hide())
            else graphics.hide()
        },
        /**
         * 显示要素
         * @param {Array<maptalks.Marker||maptalks.LineString>} 要素对象(数组)
         */
        show(graphics) {
            if (!graphics) return;
            if (Array.isArray(graphics)) graphics.forEach(graphic => graphic.show())
            else graphics.show()
        },
        /**
         * 更新要素样式
         * @param {Array<maptalks.Marker||maptalks.LineString>} 要素对象(数组)
         * @param {Object} 要素样式(详见要素(点 线 面)组件symbol说明)
         */
        updateSymbol(graphics, symbol) {
            if (!graphics) return;
            if (Array.isArray(graphics))
                graphics.forEach(graphic => graphic.updateSymbol(symbol))
            else graphics.updateSymbol(symbol)
        },
        /**
         * 移除要素
         * @param {Array<maptalks.Marker||maptalks.LineString>} 要素对象(数组)
         */
        remove(graphics) {
            if (!graphics) return;
            if (Array.isArray(graphics))
                graphics.forEach(graphic => graphic.remove())
            else graphics.remove()
        },
        /**
         * 闪烁
         * @param {Object} graphic 要素对象(点 线 面)
         * @param {Number} interval 闪烁间隔
         * @param {Number} count 闪烁次数
         * @param {*} call 闪烁完回调
         */
        flash(graphic, interval, count, call) {
            graphic.flash(interval || 200, count || 5, call || null)
        },
        /**
         * 闪烁
         * @param {object} graphic 要素对象
         * @param {string} glowColor '发光'颜色
         */
        glowEffect(graphic, glowColor) {
            if (this.glowInters.length > 0) {
                let status = this.glowInters.some(item => {
                    return item.marker.getProperties() == graphic.getProperties()
                });
                if (status) return;
            }
            let status = true,
                shadowSize = 0;
            let glowinter = setInterval(() => {
                status == true ? shadowSize++ : shadowSize--;
                if (shadowSize > 20) status = false;
                if (shadowSize == 1) status = true;
                graphic.updateSymbol({
                    shadowBlur: shadowSize,
                    shadowColor: glowColor,
                })
                let data = {
                    marker: graphic,
                    inter: glowinter
                }
                this.glowInters.push(data);
            }, 50)
        },
        /**
         * 清除发光闪烁效果
         */
        clearGlowEffect() {
            if (this.glowInters.length > 0) {
                this.glowInters.forEach(item => {
                    item.marker.updateSymbol({
                        shadowBlur: 0
                    })
                    clearInterval(item.inter);
                })
                this.glowInters = [];
            }
        },
        /**
         * 要素对象移入显示tooltip
         * @param {object} graphic 要显示提示的对象(点 线 面) 
         * @param {*} data 绑定的数据集
         */
        setToolTip(graphic, data) {
            if (!this.showToolTip) return
            if (!this.toolTipField) return
            if (!data[this.toolTipField]) return
            let option = {
                animation: 'scale',
                cssName: 'mapToolTip'
            }
            new maptalks.ui.ToolTip(
                data[this.toolTipField],
                option
            ).addTo(graphic)
        },
    },
    beforeDestroy() {
        this.inter && clearInterval(this.inter)
        this.glowInters.length > 0 && this.clearGlowEffect()
    },
}