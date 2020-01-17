import polygon from './polygon'

polygon.install = function (Vue) {
    Vue.component(polygon.name, polygon)
}
export default polygon