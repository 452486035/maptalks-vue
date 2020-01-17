import baseMap from './baseMap'
import graphicLayer from './graphicLayer'
import clusterLayer from './clusterLayer'
import markers from './marker'
import lineString from './lineString'
import polygons from './polygon'
import infowindow from './infowindow'
import 'maptalks/dist/maptalks.css'
const components = [
    baseMap,
    graphicLayer,
    clusterLayer,
    markers,
    lineString,
    polygons,
    infowindow
]

const install = function (Vue) {
    if (install.installed) return
    components.forEach(component => Vue.component(component.name, component))
}

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue)
}

export default {
    install,
    baseMap,
    graphicLayer,
    clusterLayer,
    markers,
    lineString,
    polygons,
    infowindow
}