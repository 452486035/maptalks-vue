import marker from './marker'

marker.install = function (Vue) {
    Vue.component(marker.name, marker)
}
export default marker