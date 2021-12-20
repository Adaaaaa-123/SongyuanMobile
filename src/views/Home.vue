<template class='home'>
  <div class="home">
    <van-tabs type="card" v-model="params.statusCode" @change="changeType">
      <van-tab title="新预警" name="0"></van-tab>
      <van-tab title="处置中" name="1"></van-tab>
      <van-tab title="处置完" name="2"></van-tab>
    </van-tabs>
    <div :class="{'item':true,'last':item==5}" v-for="item in 5" :key="item" >
      <p>告警类型：三轮车</p>
      <p>告警时间：2021-09-17 16:47:00</p>
      <p>告警地址：松原市公安交警支队</p>
      <p>签收状态：未签收</p>
      <div v-if="params.statusCode=='0'" class="mark"></div>
      <div v-if="params.statusCode=='1'" class="mark yellow"></div>
      <div v-if="params.statusCode=='2'" class="mark green"></div>
      <div class="btns">
        操作：
        <van-button size="mini" v-if="params.statusCode=='1'" color="#363291" type="info">签收</van-button>
        <van-button size="mini" v-if="params.statusCode=='1'" color="#363291" type="info">处置</van-button>
        <van-button size="mini" v-if="params.statusCode=='1'" color="#363291" type="info">误报</van-button>
        <van-button size="mini" color="#363291" type="info">查看图片</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getList } from "@/api/home"
export default {
  data() {
    return {
      params:{
        carPositionId:'10',
        statusCode:"0"
      }

    };
  },
  created() {
    this.getData()
  },
  mounted() {},
  methods: {
      changeType(val){
        console.log(val,'val');
      },
      getCarType(type) {
      let current = "";
      if (
        (type.substr(0, 1) == "H" && type.substr(1) == 300) ||
        type.substr(1, 2) == 31
      ) {
        current = "微卡";
      } else if (type == "M10") {
        current = "三轮车";
      } else if (type == "T20") {
        current = "拖拉机";
      } else if (type == "K31") {
        current = "轻客";
      } else if (type == "K41") {
        current = "微面";
      } else if (
        type.substr(0, 1) == "H" &&
        type.substr(1, 2) >= 10 &&
        type.substr(1, 2) <= 55
      ) {
        current = "厢式货车";
      } else {
        current = "未知";
      }
      return current;
    },
    async getData(){
      let res = await getList( {
        carPositionId:'20',
        statusCode:'0'
      })
      if(res.code==0){
        console.log(res)
      }
    }
  }
};
</script>

<style scoped lang="scss">
.home /deep/ .van-tabs__nav--card{
  margin: 0;
}
.home /deep/ .van-tab.van-tab--active{
  background-color: #363291;
}
.home /deep/ .van-tabs__nav--card{
  border-color: #363291;
}
.home /deep/ .van-tabs__nav--card .van-tab{
  border-color: #363291;
  color: #363291;
  &.van-tab--active{
  color: #fff;
  }
 
}
.home{
  width: 100%;
  padding-bottom: 50px;
  background-color: #e1e0f1;
  .item{
    position: relative;
    text-align: left;
    padding: 20px 40px;
    font-size: 16px;
    font-weight: 400;
    border-bottom: 1px solid #5a6876;
    // &.last{
    //   border: none;
    // }
    .mark{
      position: absolute;
      right: 95px;
      top: 35px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background-color: red;
      &.yellow{
        background-color: yellow;
      }
       &.green{
        background-color: green;
      }
    }
    .btns{
      display: flex;
      align-items: center;
    }
  }
}
</style>
