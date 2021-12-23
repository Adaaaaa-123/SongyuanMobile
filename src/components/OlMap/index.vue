<template>
  <div class="openlayer">
    <div id="map" ref="rootmap">
      <!-- 弹出窗体 -->
      <!-- <MapPopup
        :position="mapPopupData.position"
        :title="mapPopupData.title"
        :offset="mapPopupData.offset"
        :mapShow="mapPopupData.show"
        @close="mapPopupClose"
        :className="'map-popup'"
      >
        <div class="popup-content">
          <p>姓名：{{popupData.policeName}}</p>
          <p>电话：{{popupData.policePhone}}</p>
          <p>所属中队：{{popupData.lochusId}}</p>
          <p>呼号：{{popupData.lochusPhone}}</p>
          <p>任务状态：{{popupData.state==1?"处置中":"空闲"}}</p>
          <div class="popup-btn" style="margin-bottom:10px">
            <el-button
              type="primary"
              v-if="popupData.state==0&&popupData.isHandle"
              @click="goHandle()"
            >派警</el-button>
          </div>
          <div class="popup-btn">
             <el-button type="primary" v-if="popupData.isHandle" @click="cancelHandle()">取消处置</el-button>
          </div>
        </div>
      </MapPopup> -->
      <!-- 点标注，如果只想用文字标注label，可以把图片设置成一个像素的透明图片，如果只想用图标就label设置为null，单独的懒得封装了,-->
      <MapIconMark
        v-for="(item,index) in carList"
        :position="item.postion"
        :key="item+index"
        label
        :icon="item.state==0?mapIconData.icon:mapIconData.iconHot"
        :elementName="mapIconData.elementName"
        :className="mapIconData.className"
      ></MapIconMark>
      <!-- <MapIconMark
        v-for="(item,index) in markList"
        :position="item"
        :key="item+index"
        label
        :icon="mapPointCollectionData.bgImg"
        :elementName="mapIconData.elementName"
        :className="mapIconData.className"
      ></MapIconMark> -->
      <!-- 折线 -->
      <!-- 多边形 -->
      <MapPolygon
        :pointList="mapPolygonData.pointlist"
        :fillColor="mapPolygonData.fillColor"
        :lineColor="mapPolygonData.lineColor"
        :lineWidth="mapPolygonData.lineWidth"
        :lineDash="mapPolygonData.lineDash"
        :elementName="mapPolygonData.elementName"
        :className="mapPolygonData.className"
      ></MapPolygon>
      <!-- 自定义覆盖物 -->
      <MapOverlay :position="mapOverlayData.position" :className="mapOverlayData.className">
        <div>
          <img :src="mapOverlayData.img" alt />
        </div>
      </MapOverlay>
      <!-- 圆形 -->
      <MapCircle
        :position="mapCircleData.position"
        :radius="mapCircleData.radius"
        :fillColor="mapCircleData.fillColor"
        :lineColor="mapCircleData.lineColor"
        :lineWidth="mapCircleData.lineWidth"
        :lineDash="mapCircleData.lineDash"
        :elementName="mapCircleData.elementName"
        :className="mapCircleData.className"
      ></MapCircle>
      <!-- 海量点 -->
      <MapPointCollection
        v-if="mapPointCollectionData.pointlist"
        :bgImg="mapPointCollectionData.bgImg"
        :pointList="mapPointCollectionData.pointlist"
        :distance="mapPointCollectionData.distance"
        :fillColor="mapPointCollectionData.fillColor"
        :fontColor="mapPointCollectionData.fontColor"
        :zIndex="mapPointCollectionData.zIndex"
        :offset="mapPointCollectionData.offset"
      ></MapPointCollection>
      <MapPointCollection
        :bgImg="mapPointCollectionData.bgCarImg"
        :pointList="carList"
        :distance="mapPointCollectionData.distance"
        :fillColor="mapPointCollectionData.fillColor"
        :fontColor="mapPointCollectionData.fontColor"
        :zIndex="mapPointCollectionData.zIndex"
        :offset="mapPointCollectionData.offset"
      ></MapPointCollection>
      <!-- pointlist -->
      <!-- 循环使用的方法 -->
      <template v-for="(item,index) of pointlist">
        <MapIconMark :position="item" :icon="iconImg" :key="index" :label="'标记点' + String(index)"></MapIconMark>
      </template>
      <!-- 路径示例 -->
      <MapLineString
        :pointList="pointlist"
        :lineColor="'red'"
        :lineWidth="5"
        :lineDash="null"
        :elementName="'轨迹'"
        :className="'map-road'"
      ></MapLineString>
      <MapLineString
        :pointList="mapLineStringData.pointlist"
        :lineColor="mapLineStringData.lineColor"
        :lineWidth="mapLineStringData.lineWidth"
        :lineDash="mapLineStringData.lineDash"
        :elementName="mapLineStringData.elementName"
        :className="mapLineStringData.className"
      ></MapLineString>
    </div>
    <!-- <MapPolyLine :center="pointlist"></MapPolyLine> -->
    <!-- <div class="click-center">{{clickCenter}}</div> -->
  </div>
</template>
<script>
// @ is an alias to /src
import "ol/ol.css";
import { Map, View } from "ol";
import * as olControl from "ol/control";
import MapPopup from "./MapPopup";
import MapIconMark from "./MapIconMark";
import MapLineString from "./MapLineString";
import MapPolygon from "./MapPolygon";
import MapCircle from "./MapCircle";
import MapOverlay from "./MapOverlay";
import MapPointCollection from "./MapPointCollection";
import mapconfig from "@/config/mapconfig";
// import { findAllCar,alarmDispatch } from "@/api/earlyWarning";
export default {
  name: "openlayer",
  components: {
    MapPopup,
    MapIconMark,
    MapLineString,
    MapPolygon,
    MapCircle,
    MapOverlay,
    MapPointCollection
  },
  props: {
    value: { type: Object }
  },
  data() {
    return {
      // 弹出窗体图层数据
      mapPopupData: {
        isHandle: 0,
        position: [124.82, 45.13], // 弹窗中心点 Array[array]， 必须
        title: "弹窗标题", // 弹窗标题 String，非必须，默认为 ' '
        show: false, // 弹窗显隐 Boolean，必须，默认为 true
        offset: [0, 0], // 弹窗偏移 Array[number]，必须，默认为 [0, 0]
        className: "map-popup" // 图层的class String，非必须，默认为 'map-popup'
      },
      // 点标注图层数据
      mapIconData: {
        position: [124.82, 45.13], // 标注中心点 Array， 必须
        icon: require("@/assets/car.png"),
        iconHot: require("@/assets/hot.png"),
        // 文件地址 String[url] ，必须 ，默认为 null，
        label: "", // 标注点名称 String， 非必须， 默认为 null
        elementName: "点标识ID", // 标注点识别名称 String， 可以通过 feature.get('name') 获取到， 非必须， 默认为 'el-mapIconMark'
        className: "map-icon-mark" // 图层的class String， 非必须，默认为 'map-icon-mark'
      },
      // 折线图层数据
      mapLineStringData: {
        pointlist: [
          // [126.048289, 45.014299],
          // [124.896901, 45.195401],
          // [126.048289, 45.014299],
          // [124.928063, 45.247075],
          // [126.048289, 45.014299],
          // [125.178396, 45.005102],
          // [126.048289, 45.014299],
          // [125.387864, 44.527208]
          // [125.19, 45.42],
          // [124.02, 45.02],
          // [125.23, 45.52]
        ], // 线条所有的点数组 Array[array]， 必须
        elementName: "地图线条", //弹窗标识别名 String， 非必须，默认为 'el-mapLineString'
        lineColor: "rgba(0,77,168,0.9)", // 线条颜色 String，非必须，默认为 '#409eff'
        lineWidth: 2, // 线条宽度 Number，非必须，默认为 2
        lineDash: [10], // 虚线 Array[number]， 是否使用虚线，默认为 null
        className: "map-line-string", // 图层的class String， 非必须， 默认 "map-line-string"
        zIndex: 300 // 图层z轴高度， 非必须， 默认 300
      },
      // 多边形图层数据
      mapPolygonData: {
        pointlist: [
          // [ 114.06763153723739, 22.523766343504477 ],
          // [ 114.07099169050478, 22.523803784736963 ],
          // [ 114.06770308108405, 22.521172327154904 ],
          // [ 114.0693165842837, 22.524608688036995 ],
          // [ 114.07017607779578, 22.521397632712155 ]
        ],
        fillColor: "rgba(255,0,0,0.8)", // 多边形填充颜色，非必须，默认为 'rgba(0,0,0,0.8)'
        elementName: "地图多边形", // 多边形识别名称 String, 非必须，默认为 'el-mapPolygon'
        lineColor: "rgba(0,0,0,0.5)", // 多边形线条颜色 String，非必须，默认为 '#409eff'
        lineWidth: 2, // 多边形线条宽度 Number，非必须，默认为 2
        lineDash: null, // 多边形虚线 Array[number], 是否使用虚线 ，默认为 null
        className: "map-polygon" // 图层的class String, 非必须，默认为 'map-polygon'
      },
      // 圆形图层数据
      mapCircleData: {
        position: [], // 圆中心点 Array， 必须
        radius: 100, // 圆半径 number ，默认为 100
        fillColor: "rgba(255,255,255,0.5)", // 圆形填充颜色，非必须，默认为 'rgba(255,255,255,0.5)'
        elementName: "圆形叠加", // 圆形识别名称 String, 非必须，默认为 'el-mapCircle'
        lineColor: "#409eff", // 圆形线条颜色 String，非必须，默认为 '#409eff'
        lineWidth: 2, // 圆形线条宽度 Number，非必须，默认为 2
        lineDash: [20, 5], // 圆形虚线 Array[number], 是否使用虚线 ，默认为 null
        className: "map-circle" // 图层的class String, 非必须，默认为 'map-circle'
      },
      // 自定义图层数据
      mapOverlayData: {
        position:  [  ], // 标注中心点 Array, 必须
        // className: 'map-overlay', // 设置自定义图层的class String ，非必须， 默认 'map-overlay'
        // offset:[200,200], // 设置自定义图层的偏移量 Array[number] ，非必须,默认[0, 0]
        // img: require('@/assets/hot.gif') // slot
      },
      // 海量点图层数据
      mapPointCollectionData: {
        pointlist: [],
        distance: 100, // 收起点的间距  number，必须，默认为 40
        zIndex: 500, // 图层z轴高度， 非必须， 默认 400
        offset: [0, 2], // 文字偏移距离 [x,y]， 非必须， 默认 [0,0]
        fontColor: "#ffeb00", // 文字的颜色 string （色彩标识，支持rgba），默认'#fff'(如果去掉文字那么直接rgba透明度设置为0)
        fillColor: "#06d073", // 文字的背景颜色 string（色彩标识，支持rgba），默认'#f00'(如果去不要背景颜色那么直接rgba透明度设置为0)
        bgImg: require("@/assets/mark.png") ,
        bgCarImg: require("@/assets/car.png")// 设置背景图，如果设置了此那么文字背景可以不设置
      },
      // 海量点图层数据
      carList: [],
      markList: [],
      mapData: null,
      mapCenter: [124.82, 45.13],
      mapZoom: 10,
      // clickCenter: [0,0],
      popupText: "弹窗初始化文字",
      iconImg: require("@/assets/mark.png"), // 文件地址 String[url]
      pointlist: [
        // [114.07871607950588, 22.52222782549443]
        // [ 114.07844961562236, 22.52315316542209 ],
        // [ 114.07696995439895, 22.524754342150676 ],
        // [ 114.08107178741518, 22.524136654355292 ]
      ],
      popupData: {},
      warningList: [],
      isHandle: true
    };
  },
  watch: {
    value: {
      handler(newVal, oldVal) {
        console.log("newVal", newVal, "oldVal", oldVal);
        // this.mapLineStringData.pointlist = newVal.lineList;
        this.carList=newVal.carList
        // this.warningList = newVal.warningList;
        this.mapPointCollectionData.pointlist = newVal.position;
        this.mapPopupClose()
      },
      deep: true
    }
  },
  mounted() {
    this.initMap();
  },
  created() {
    // this.getCarList();
  },
  methods: {
    cancelHandle() {
      this.mapLineStringData.pointlist = [];
      this.warningList = [];
      this.mapPointCollectionData.pointlist = [];
      this.mapPopupClose();
    },
    // async getCarList() {
    //   let res = await findAllCar();
    //   if (res.code == 0) {
    //     this.carList = res.object.map(x => {
    //       return {
    //         ...x,
    //         postion: [x.lon, x.lat]
    //       };
    //     });
    //   }
    // },
    initMap() {
      console.log("重新加载！ ");
      const mapContainer = this.$refs.rootmap;
      const FullScreen = new olControl.FullScreen(); // 全屏控件
      this.map = new Map({
        layers: mapconfig.streetmap(),
        controls: [FullScreen],
        target: mapContainer,
        view: new View({
          projection: "EPSG:4326",
          center: this.mapCenter,
          // zoom: this.mapZoom,
          zoom: this.mapZoom,
          minZoom: 8
        })
      });
      // 添加鼠标点击事件
      this.map.on("click", this.mapClick);
      // 添加鼠标经过事件
      this.map.on("pointermove", this.mapPointerMove);
      // 保存地图
      this.mapData = this.map;
      this.$forceUpdate();
    },
    // 鼠标点击地图事件
    mapClick(evt) {
      const pixel = this.mapData.getEventPixel(evt.originalEvent);
      const hit = this.mapData.hasFeatureAtPixel(pixel);
      // 获取地图上的feature
      const feature = this.mapData.forEachFeatureAtPixel(evt.pixel, function(
        feature,
        layer
      ) {
        return feature;
      });
      // 获取叠加图层对像素叠加图层（hit）设置鼠标样式（给标注点添加鼠标经过样式）
      this.mapData.getTarget().style.cursor = hit ? "pointer" : "";
      // 鼠标移动到点标注的时候显示弹出窗体，feature.get('name') 可以获取标注标题，如果设置了的话
      if (feature && feature.get("name") === this.mapIconData.elementName) {
        let posion = [...feature.geometryChangeKey_.target.flatCoordinates];
        // 显示弹出窗体
        this.popupData = this.carList.find(x => {
          return x.postion[0] == posion[0] && x.postion[1] == posion[1];
        });
        this.mapPopupData.show = true;
        // 弹出窗体的内容
        // this.popupText = `当前坐标${this.mapIconData.position}`;
        // 弹出窗体的位置
        this.warningList.find(x => {
          return x[0] == posion[0] && x[1] == posion[1];
        });

        console.log(
          this.warningList,
          posion,
          "坐标",
          this.warningList.indexOf(posion)
        );
        this.mapPopupData.position = posion;
        this.popupData.isHandle = this.warningList.find(x => {
          return x[0] == posion[0] && x[1] == posion[1];
        })
          ? 1
          : 0;
      }
      // 获取点击中心点
      // this.clickCenter = evt.coordinate
      // // 移动地图
      // this.mapData.getView().animate({
      //   center:evt.coordinate,
      // })
      // 这个做了一个点击改变中心点的操作
      // setTimeout(()=>{
      //   this.mapIconData.position = [ 124.82,45.13 ]
      //   this.mapData.getView().animate({
      //     center:[ 124.82,45.13 ],
      //   })
      // },5000)
    },
    // 鼠标划过地图事件
    mapPointerMove(evt) {
      if (evt.dragging) {
        return;
      }
      // 获取地图上的重叠像素（用来获得叠加图层）
      // const pixel = this.mapData.getEventPixel(evt.originalEvent);
      // const hit = this.mapData.hasFeatureAtPixel(pixel);
      // // 获取地图上的feature
      // const feature = this.mapData.forEachFeatureAtPixel(evt.pixel, function(
      //   feature,
      //   layer
      // ) {
      //   return feature;
      // });
      // // 获取叠加图层对像素叠加图层（hit）设置鼠标样式（给标注点添加鼠标经过样式）
      // this.mapData.getTarget().style.cursor = hit ? "pointer" : "";
      // // 鼠标移动到点标注的时候显示弹出窗体，feature.get('name') 可以获取标注标题，如果设置了的话
      // if (feature && feature.get("name") === this.mapIconData.elementName) {
      //   // 显示弹出窗体
      //   this.mapPopupData.show = true;
      //   // 弹出窗体的内容
      //   this.popupText = `当前坐标${this.mapIconData.position}`;
      //   // 弹出窗体的位置
      //   this.mapPopupData.position = this.mapIconData.position;
      // }
    },
    // async goHandle() {
    //   // console.log(this.value.warningId,this.popupData);
    //   let res = await alarmDispatch({
    //     id:this.value.warningId,
    //     carPositionId:this.popupData.id
    //   })
    //   if(res.code==0){
    //     this.cancelHandle()
    //     this.$emit("onSave")
    //     this.getCarList()
    //     this.$message.success("派警成功！");
    //   }
    // },
    // 关闭弹出窗体事件
    mapPopupClose(e) {
      this.mapPopupData.show = false;
      this.popupText = "";
    }
  }
};
</script>
<style lang="scss" scoped>
.openlayer {
  height: 100vh;
  width: 100vw;
}
#map {
  height: 100%;
  width: 100vw;
  background: #f2f2f2;
}
.click-center {
  position: absolute;
  top: 10px;
  right: 60px;
  padding: 10px;
  z-index: 2;
  background: rgba($color: #000000, $alpha: 0.5);
  color: #fff;
  border-radius: 4px;
}
.popup-content {
  padding: 0 50px;
  .popup-btn .el-button--primary {
    width: 100%;
  }
}
</style>
