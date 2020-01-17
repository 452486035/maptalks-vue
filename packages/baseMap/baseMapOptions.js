import * as maptalks from 'maptalks'
/**
 * 根据类型获取底图配置
 * @param {string} type 底图类型
 * @param {string} baseUrl 底图地址
 */
export function getBaseMapOption(type, baseUrl, _call) {
    let _options = {}
    _options.fixCenterOnResize = true;
    if (type === 'arcgis') {
        getArcgisOptions(baseUrl, opts => {
            _options = opts
            _call(_options)
        })
        return;
    }
    switch (type) {
        case 'baidu': //bd09
        case 'baiduDeep': //bd09
            _options = getBaiduOptions(type);
            break;
        case 'tdt': //wgs84
            _options = getTdtOptions();
            break;
        case 'google': //gcj02(火星坐标系)
            _options = getGoogleOptions();
            break;
        case 'amap': //高德gcj02(火星坐标系)
            _options = getAMapOptions();
            break;
        case 'tencent': //gcj02(火星坐标系)
            _options = getTencentOptions()
            break;
    }
    _call(_options);
}
/**
 * 获取arcgis服务配置
 * @param {string} baseUrl arcgis底图服务地址
 * @param {function} _call 回调
 */
function getArcgisOptions(baseUrl, _call) {
    let options = null;
    maptalks.SpatialReference.loadArcgis(
        `${baseUrl}?f=pjson`,
        (err, conf) => {
            let view = conf.spatialReference
            let center = [Number((view.fullExtent.xmax + view.fullExtent.xmin) / 2), Number((view.fullExtent.ymax + view.fullExtent.ymin) / 2)]
            view.projection = 'IDENTITY'
            options = {
                center: center,
                zoom: 3,
                minZoom: 0,
                maxZoom: view.resolutions.length - 1,
                view: view,
                attribution: false,
                baseLayer: new maptalks.TileLayer("customTile", {
                    tileSystem: conf.tileSystem,
                    tileSize: conf.tileSize,
                    renderer: 'canvas',
                    urlTemplate: `${baseUrl}/tile/{z}/{y}/{x}`,
                    repeatWorld: false
                })
            };
            _call(options)
        })
}
/**
 * 获取百度地图配置
 * @param {string} type 百度地图类型baidu baiduDeep
 */
function getBaiduOptions(type) {
    return {
        view: {
            projection: 'baidu'
        },
        baseLayer: new maptalks.TileLayer('baiduTile', {
            //可选值:customid=dark, midnight, grayscale, hardedge, light, redalert, googlelite, grassgreen, pink, darkgreen, bluish
            urlTemplate: type == "baiduDeep" ? 'http://api2.map.bdimg.com/customimage/tile?&x={x}&y={y}&z={z}&udt=20161109&scale=1&styles=t%3Abackground%7Ce%3Aall%7Cc%3A%2308133eff%2Ct%3Aland%7Ce%3Aall%7Cc%3A%2308133eff%2Ct%3Awater%7Ce%3Aall%7Cc%3A%23142a55ff%2Ct%3Abuilding%7Ce%3Aall%7Cc%3A%231a4380ff%2Ct%3Agreen%7Ce%3Ag.s%7Cc%3A%231a4385ff%2Ct%3Aeducation%7Ce%3Aall%7Cc%3A%231a4385ff%2Ct%3Ahighway%7Ce%3Aall%7Cc%3A%23193675ff%2Ct%3Aarterial%7Ce%3Aall%7Cc%3A%23193675ff%2Ct%3Alocal%7Ce%3Aall%7Cc%3A%23012450ff%2Ct%3Arailway%7Ce%3Aall%7Cc%3A%23012450ff%2Ct%3Apoi%7Ce%3Al%7Cc%3A%23ffffffff%2Ct%3Apoi%7Ce%3Al.t.s%7Cc%3A%23000000ff%2Ct%3Ahighway%7Ce%3Al.t.f%7Cc%3A%23000000ff%2Ct%3Aarterial%7Ce%3Al.t.f%7Cc%3A%23000000ff%2Ct%3Aarterial%7Ce%3Al.t.s%7Cc%3A%23f4edd9ff%2Ct%3Ahighway%7Ce%3Al.t.s%7Cc%3A%23f4edd9ff' : 'http://online2.map.bdimg.com/tile/?qt=vtile&x={x}&y={y}&z={z}&styles=pl&scaler=2&udt=20190704',
            'subdomains': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
        })
    }
}
/**
 * 获取天地图配置
 */
function getTdtOptions() {
    return {
        baseLayer: new maptalks.TileLayer('TdtTile', {
            subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
            urlTemplate: 'http://t{s}.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=9071c785650c2efc428f58b64ff92c9c',
        }),
        layers: [
            new maptalks.TileLayer('wordtile', { //文字图层
                subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
                urlTemplate: 'http://t{s}.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=9071c785650c2efc428f58b64ff92c9c',
            })
        ]
    }
}
/**
 * 获取谷歌地图配置
 */
function getGoogleOptions() {
    return {
        baseLayer: new maptalks.TileLayer('googleTile', {
            urlTemplate: 'http://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}&scale=2',
            // cssFilter: 'sepia(100%) invert(90%)'
        })
    }
}
/**
 * 获取高德地图配置
 */
function getAMapOptions() {
    return {
        baseLayer: new maptalks.TileLayer('amapTile', {
            urlTemplate: 'http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
        })
    }
}
/**
 * 获取腾讯地图配置
 */
function getTencentOptions() {
    return {
        baseLayer: new maptalks.TileLayer('tencentTile', {
            urlTemplate: (x, y, z) => {
                const urlArgs = this.getUrlArgs(x, y, z);
                const _z = urlArgs.z;
                const _x = urlArgs.x;
                const _y = urlArgs.y;
                const m = Math.floor(_x / 16.0);
                const n = Math.floor(_x / 16.0);
                const urlTemplate = 'http://rt0.map.gtimg.com/realtimerender?z={z}&x={x}&y={y}&type=vector&style=3';
                const url = urlTemplate.replace('{x}', _x).replace('{y}', _y).replace('{z}', _z).replace('{m}', m).replace('{n}', n);
                return url;
            },
        })
    }
}