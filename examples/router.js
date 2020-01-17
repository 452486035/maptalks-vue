import index from './view/index'
const routers = [{
    path: '/index',
    name: 'index',
    component: index
}, {
    path: '/',
    component: index
}]
export default routers