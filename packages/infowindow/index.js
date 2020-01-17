import infowindow from './infowindow'

infowindow.install = function (Vue) {
    Vue.component(infowindow.name, infowindow)
}
export default infowindow