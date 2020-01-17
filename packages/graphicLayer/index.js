import graphicLayer from './graphicLayer'

graphicLayer.install = function (Vue) {
    Vue.component(graphicLayer.name, graphicLayer)
}
export default graphicLayer