// 导入组件，组件必须声明 name
import Map from './map'

// 为组件添加 install 方法，用于按需引入
Map.install = function (Vue) {
    Vue.component(Map.name, Map)
}
export default Map