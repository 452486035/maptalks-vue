<template>
  <div class="container">
    <div style="width:50%;height:100%;float:left">
      <eMap :zoom="11" :mapType="mapType">
        <graphicLayer ref="layer1" :layerId="layerId" :show="layshow">
          <markers ref="marker1" :pointData="pointData" :symbol="markerSymbol" :showToolTip="true" toolTipField="text">
            <infowindow theme="default" textField="text" title="Title"></infowindow>
          </markers>
          <lineString ref="line1" :lineData="lineData" :symbol="lineSymbol" :isClearLayer="false" :showToolTip="true"
            toolTipField="name">
            <infowindow theme="default" textField="name"></infowindow>
          </lineString>
        </graphicLayer>
        <graphicLayer :layerId="layerId">
          <markers :pointData="pointData2" :symbol="markerSymbol2" :isZoomToFitLevel="false"
            @graphicClick="markerClick">
            <infowindow ref='infos' :isCustom="true"></infowindow>
          </markers>
          <!-- <polygons :polygonData="polyData" :symbol="polygonSymbol"></polygons> -->
        </graphicLayer>
      </eMap>
    </div>
    <div style="width:50%;height:100%;float:left">
      <eMap :zoom="11" :mapType="mapType2">
        <clusterLayer :layerId="layerId">
          <markers :pointData="clusterData" :symbol="clusterMarkerSymbol" :isZoomToFitLevel="true" :showToolTip="true"
            toolTipField="text">
            <infowindow textField="text" :zoomCloseInfowindow="true"></infowindow>
          </markers>
        </clusterLayer>
      </eMap>
    </div>
    <div class="btn-list">
      <div class="btn" @click="layshow=!layshow">新增</div>
      <div class="btn" @click="glowfun1">闪烁1</div>
      <div class="btn" @click="glowfun2">闪烁2</div>
      <div class="btn" @click="clearglowfun2">清除闪烁2</div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { randomString, randomCoord } from '@/utils/guid'
export default {
  name: 'mapIndex',
  props: {
    msg: String
  },
  data() {
    return {
      mapType: 'amap',
      mapType2: 'baiduDeep',
      layshow: false,
      arcgisUrl:
        'http://cache1.arcgisonline.cn/arcgis/rest/services/SimpleFeature/ChinaBoundaryLine/MapServer',
      layerId: '',
      pointData: [
        {
          id: 'one',
          x: 114.21061405761725,
          y: 30.588973122929104,
          text:
            '我是标注1我是标注1我是标注1我是标注1我是标注1我是标注1我是标注1我是标注1'
        },
        {
          id: 'two',
          x: 114.33764347656256,
          y: 30.528663003951834,
          text: '我是标注12'
        }
      ],
      pointData2: [
        {
          x: 114.27464378413083,
          y: 30.56343733163274,
          text: '自定义窗口'
        }
      ],
      lineData: [
        {
          data: { id: 'line', name: '嗷呜~~~' },
          path: [
            [114.22374618586423, 30.568425854793503],
            [114.22949684199216, 30.565543628255654],
            [114.23353088435056, 30.565321914975044],
            [114.23816574152829, 30.56410248287486],
            [114.24129856165769, 30.561663572693845],
            [114.24477470454099, 30.55896591881796],
            [114.24829376276853, 30.556748612905693],
            [114.25867927607419, 30.55260950632581]
          ],
          option: {}
        }
      ],
      lineSymbol: {
        lineColor: '#237DFF',
        lineWidth: 6,
        lineCap: 'round',
        lineDasharray: [30, 10] //虚线
      },
      //具体样式详情配置说明见marker组件
      markerSymbol: {
        markerFile: require('@/../public/image/marker3.png')
        // markerWidth: 30, //非必须
        // markerHeight: 46, //非必须
        // textName: "{text}",
        // textDy: -56,
        // textFill: "#227DFF",
        // textHaloFill: "#fff",
        // textHaloRadius: 3,
        // shadowColor: '#f00',
        // shadowBlur: 10
      },
      markerSymbol2: {
        markerFile: require('@/../public/image/marker4.png')
      },
      clusterMarkerSymbol: {
        markerFile: require('@/../public/image/store.png')
      },
      clusterData: [],
      polyData: [
        {
          data: {},
          rings: [
            [
              [114.20138065601941, 30.5185527878729],
              [114.16688572443626, 30.441366867977646],
              [114.27037051918572, 30.40848184905406],
              [114.34683428419504, 30.49615034120228]
            ]
          ]
        }
      ],
      polygonSymbol: {
        polygonFill: '#237DFF',
        polygonOpacity: 0.5,
        lineWidth: 3,
        lineColor: '#237DFF'
      }
    }
  },
  watch: {},
  mounted() {
    let data = []
    for (let i = 0; i < 100; i++) {
      let coord = randomCoord(114.22374618586423, 30.568425854793503)
      data.push({
        text: randomString(100),
        x: coord[0],
        y: coord[1]
      })
    }
    this.clusterData = data
  },
  methods: {
    markerClick(markerObj) {
      //自定义弹窗
      // let marker = markerObj.target //marker对象
      // let data = marker.getProperties() //获取marker绑定的数据
      let htmlTemplate = `
        <el-form ref="form" :model="form" label-width="80px" style="border-radius:5px;background:#fff;width:400px;height:400px;overflow:auto;padding:20px;">
          <el-form-item label="活动名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="活动区域">
            <el-select v-model="form.region" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="活动性质">
            <el-checkbox-group v-model="form.type">
              <el-checkbox label="美食/餐厅线上活动" name="type"></el-checkbox>
              <el-checkbox label="地推活动" name="type"></el-checkbox>
              <el-checkbox label="线下主题活动" name="type"></el-checkbox>
              <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="特殊资源">
            <el-radio-group v-model="form.resource">
              <el-radio label="线上品牌商赞助"></el-radio>
              <el-radio label="线下场地免费"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="活动形式">
            <el-input type="textarea" v-model="form.desc"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      `
      let vm = Vue.extend({
        template: htmlTemplate,
        data() {
          return {
            form: {
              name: '',
              region: '',
              date1: '',
              date2: '',
              delivery: false,
              type: [],
              resource: '',
              desc: ''
            }
          }
        },
        watch: {},
        beforeDestroy() {},
        mounted() {},
        methods: {}
      })
      let component = new vm().$mount()
      this.$refs['infos'].show(markerObj, component.$el)
    },
    glowfun1() {
      let marker = this.$refs['marker1'].findGraphic('id', ['two'])
      marker.forEach(() => this.$refs['marker1'].flash(marker[0]))
    },
    glowfun2() {
      let marker = this.$refs['marker1'].findGraphic('id', ['one', 'two'])
      let line = this.$refs['line1'].findGraphic('id', ['line'])
      marker
        .concat(line)
        .forEach(item => this.$refs['marker1'].glowEffect(item, '#00f'))
    },
    clearglowfun2() {
      this.$refs['marker1'].clearGlowEffect()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only scss(npm install node-sass sass-loader style-loader --save) -->
<style lang='scss' scoped>
.container {
  width: 100%;
  height: 100%;
  .btn-list {
    position: absolute;
    top: 15px;
    left: 40px;
    width: calc(50% - 100px);
    z-index: 999;
    height: 50px;
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.2);
    color: #000;
    text-align: center;
    float: left;
    .btn {
      padding: 5px 15px;
      float: left;
      background-color: #fff;
      border-radius: 5px;
      margin: 10px;
      cursor: pointer;
      &:hover {
        background-color: rgba(0, 0, 0, 0.8);
        color: #fff;
      }
    }
  }
}
</style>
