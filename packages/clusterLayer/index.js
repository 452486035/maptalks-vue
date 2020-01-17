import clusterLayer from './clusterLayer'

clusterLayer.install = function (Vue) {
    Vue.component(clusterLayer.name, clusterLayer)
}
export default clusterLayer