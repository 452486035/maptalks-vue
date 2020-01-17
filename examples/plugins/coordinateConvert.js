/**
 * Created by Wandergis.
 * 提供了百度坐标(BD09),国测局坐标(火星坐标，GCJ02),和WGS84坐标系之间的转换
 */

// 常量
let xPI = (3.14159265358979324 * 3000.0) / 180.0;
let PI = 3.1415926535897932384626;
let a = 6378245.0;
let ee = 0.00669342162296594323;

function transformlat(lng, lat) {
    let ret = -100.0 +
        2.0 * lng +
        3.0 * lat +
        0.2 * lat * lat +
        0.1 * lng * lat +
        0.2 * Math.sqrt(Math.abs(lng));
    ret +=
        ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
            2.0) /
        3.0;
    ret +=
        ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) /
        3.0;
    ret +=
        ((160.0 * Math.sin((lat / 12.0) * PI) + 320 * Math.sin((lat * PI) / 30.0)) *
            2.0) /
        3.0;
    return ret;
}

function transformlng(lng, lat) {
    let ret =
        300.0 +
        lng +
        2.0 * lat +
        0.1 * lng * lng +
        0.1 * lng * lat +
        0.1 * Math.sqrt(Math.abs(lng));
    ret +=
        ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) *
            2.0) /
        3.0;
    ret +=
        ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) /
        3.0;
    ret +=
        ((150.0 * Math.sin((lng / 12.0) * PI) +
                300.0 * Math.sin((lng / 30.0) * PI)) *
            2.0) /
        3.0;
    return ret;
}

/**
 * 判断是否在国内，不在国内则不做偏移
 * @param lng
 * @param lat
 * @returns {boolean}
 */
function outOfChina(lng, lat) {
    return (
        lng < 72.004 || lng > 137.8347 || (lat < 0.8293 || lat > 55.8271 || false)
    );
}
/**
 * 百度坐标系 (BD-09) 与 火星坐标系 (GCJ-02)的转换
 * 即 百度 转 谷歌、高德
 * @param bdLon
 * @param bdLat
 * @returns {Array}
 */
export function bd09ToGcj02(bdLon, bdLat) {
    let x = bdLon - 0.0065;
    let y = bdLat - 0.006;
    let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * xPI);
    let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * xPI);
    let ggLng = z * Math.cos(theta);
    let ggLat = z * Math.sin(theta);
    return [ggLng, ggLat];
}

/**
 * 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
 * 即谷歌、高德 转 百度
 * @param lng
 * @param lat
 * @returns {Array}
 */
export function gcj02ToBd09(lng, lat) {
    let z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * xPI);
    let theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * xPI);
    let bdLng = z * Math.cos(theta) + 0.0065;
    let bdLat = z * Math.sin(theta) + 0.006;
    return [bdLng, bdLat];
}

/**
 * WGS84转GCj02
 * @param lng
 * @param lat
 * @returns {Array}
 */
export function wgs84ToGcj02(lng, lat) {
    if (outOfChina(lng, lat)) {
        return [lng, lat];
    } else {
        let dlat = transformlat(lng - 105.0, lat - 35.0);
        let dlng = transformlng(lng - 105.0, lat - 35.0);
        let radlat = (lat / 180.0) * PI;
        let magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        let sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
        dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
        let mglat = lat + dlat;
        let mglng = lng + dlng;
        return [mglng, mglat];
    }
}

/**
 * GCJ02 转换为 WGS84
 * @param lng
 * @param lat
 * @returns {Array}
 */
export function gcj02ToWgs84(lng, lat) {
    if (outOfChina(lng, lat)) {
        return [lng, lat];
    } else {
        let dlat = transformlat(lng - 105.0, lat - 35.0);
        let dlng = transformlng(lng - 105.0, lat - 35.0);
        let radlat = (lat / 180.0) * PI;
        let magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        let sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
        dlng = (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
        let mglat = lat + dlat;
        let mglng = lng + dlng;
        return [lng * 2 - mglng, lat * 2 - mglat];
    }
}
/**
 * Bd09 转换为 WGS84
 * @param lng
 * @param lat
 * @returns {Array}
 */
export function bd09ToWgs84(lng, lat) {
    return gcj02ToWgs84(...bd09ToGcj02(lng, lat));
}
/**
 * WGS84 转换为 Bd09
 * @param lng
 * @param lat
 * @returns {Array}
 */
export function wgs84ToBd09(lng, lat) {
    return gcj02ToBd09(...wgs84ToGcj02(lng, lat));
}
/**
 *
 * @param {String} type 坐标类型
 * @param {Array} pos 坐标值
 */
export function convertToWgs84(type, pos) {
    let posConvert = [0, 0];
    if (pos instanceof Array && pos.length >= 2) {
        posConvert = pos.map(n => parseFloat(n));
    }
    switch (type) {
        case 'WGS84':
            break;
        case 'BD09':
            posConvert = bd09ToWgs84(...pos);
            break;
        case 'GCJ02':
            posConvert = gcj02ToWgs84(...pos);
            break;
    }
    return posConvert;
}

export function convertFromWgs84(type, pos) {
    let posConvert = [0, 0];
    if (pos instanceof Array && pos.length >= 2) {
        posConvert = pos.map(n => parseFloat(n));
    }
    switch (type) {
        case 'WGS84':
            break;
        case 'BD09':
            posConvert = wgs84ToBd09(...pos);
            break;
        case 'GCJ02':
            posConvert = wgs84ToGcj02(...pos);
            break;
    }
    return posConvert;
}
