<template>
  <div class="total">
    <van-tabs type="card" v-model="activeName">
      <van-tab title="月" name="1"></van-tab>
      <van-tab title="日" name="2"></van-tab>
      <van-tab title="时" name="3"></van-tab>
    </van-tabs>
    <BrokenLine :value="lineData" class="chart"></BrokenLine>
    <van-button type="primary" color="#363291" block @click="goBack">返回</van-button>
  </div>
</template>

<script>
import { BrokenLine } from "@/components/echarts";
export default {
  name: "Total",
  components: {
    BrokenLine
  },
  data() {
    return {
      activeName: "1",
      lineData: []
    };
  },
  created() {
  },
  mounted() {
    this.setData()
  },
  methods: {
    goBack(){
      this.$router.push("/home")
    },
    setData() {
      this.lineData = [
        {
          name: "三轮车",
          data: [11, 12, 5, 1, 5, 756, 56, 56],
          colors:["rgba(137, 189, 27, 0.3)","rgba(137, 189, 27, 0)","rgb(137,189,27)","rgba(137,189,2,0.27)"]
        },
        {
          name: "厢式货车",
          data: [33, 55, 544, 155, 555, 756, 56, 56],
          colors:["rgba(0, 136, 212, 0.3)","rgba(0, 136, 212, 0)","rgb(0,136,212)","rgba(0,136,212,0.2)"]
        },
        {
          name: "拖拉机",
          data: [11, 22, 52, 1, 5, 756, 56, 56],
           colors:["rgba(219, 50, 51, 0.3)","rgba(219, 50, 51, 0)","rgb(219,50,51)","rgba(219,50,51,0.2)"]
        },
        {
          name: "微卡",
          data: [11, 122, 25, 21, 25, 756, 56, 56],
          colors:["rgba(166, 75, 241, 0.3)","rgba(166, 75, 241, 0)","rgb(166,75,241)","rgba(166,75,241,0.27)"]
        }
      ];
    }
  }
};
</script>

<style scoped lang="scss">
.total /deep/ .van-tabs__nav--card {
  margin: 0;
}
.total /deep/ .van-tab.van-tab--active {
  background-color: #363291;
}
.total /deep/ .van-tabs__nav--card {
  border-color: #363291;
}
.total /deep/ .van-tabs__nav--card .van-tab {
  border-color: #363291;
  color: #363291;
  &.van-tab--active {
    color: #fff;
  }
}
.total {
  .chart {
    // height: 550px;
    height: calc(100vh - 118px);
    // margin-top: -2px;
  }
}
</style>
