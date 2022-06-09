<template class='home'>
  <div class="home">
    <van-tabs type="card" v-model="params.statusCode" @change="changeType">
      <van-tab title="新预警" :name="0"></van-tab>
      <van-tab title="处置中" :name="1"></van-tab>
      <van-tab title="处置完" :name="2"></van-tab>
    </van-tabs>
    <van-overlay :show="loading">
      <van-loading type="spinner" color="#1989fa" />
    </van-overlay>
    <div
      :class="{'item':true,'last':item==5}"
      v-for="(item,index) in warnningList"
      :key="item+index"
    >
      <p>告警类型：{{item.carAlarm&&item.carAlarm.vehicleClass?getCarType(item.carAlarm.vehicleClass):""}}</p>
      <p>告警时间：{{item.carAlarm&&item.carAlarm.passTime?item.carAlarm.passTime.substr(0,19):""}}</p>
      <div class="address">
        <div class="label">告警地址：</div>
        <div>{{item.carAlarm&&item.carAlarm.tollgateName?item.carAlarm.tollgateName:""}}</div>
        <div
          v-if="item.carAlarm&&item.carAlarm.tollgateName"
          class="place"
          @click="goPlace(item.id)"
        ></div>
      </div>
      <p v-if="params.statusCode!=2">签收状态：{{item.status?"已签收":"未签收"}}</p>
      <p v-if="params.statusCode==2">是否误报：{{item.isDistort?"是":"否"}}</p>
      <div v-if="params.statusCode=='0'" class="mark"></div>
      <div v-if="params.statusCode=='1'" class="mark yellow"></div>
      <div v-if="params.statusCode=='2'" class="mark green"></div>
      <div class="btns">
        操作：
        <van-button
          size="mini"
          v-if="params.statusCode=='1'&&!item.status"
          color="#363291"
          type="info"
          @click="goReceipt(item.id)"
        >签收</van-button>
        <van-button
          size="mini"
          v-if="params.statusCode=='1'&&item.status"
          color="#363291"
          type="info"
          @click="goFeedback(item)"
        >处置</van-button>
        <van-button
          size="mini"
          v-if="params.statusCode=='1'&&item.status"
          color="#363291"
          type="info"
          @click="goDistort(item.carAlarm.id)"
        >误报</van-button>
        <van-button
          size="mini"
          color="#363291"
          type="info"
          @click="viewPicture(item.carAlarm.storageUrl)"
        >查看图片</van-button>
      </div>
    </div>
    <van-image-preview v-model="show" :images="images" @onClose="closeView" @change="onChange">
      <van-button type="warning" @click="go">误报</van-button>
    </van-image-preview>
  </div>
</template>

<script>
import { Dialog } from "vant";
import { getList, distort, receipt } from "@/api/home";
export default {
  data() {
    return {
      params: {
        carPositionId: "28",
        statusCode: 1
      },
      warnningList: [],
      loading: false,
      images: [],
      show: false
    };
  },
  created() {
    this.getData();
  },
  mounted() {},
  methods: {
    go() {},
    goFeedback(params) {
      this.$router.push({
        name: "Feedback",
        params: {
          ...params,
          id: params.carAlarm.id
        }
      });
    },
    viewPicture(url) {
      this.images = [];
      console.log(url, "url");
      if (!url) {
        Dialog.alert({
          title: "提示",
          message: "暂无图片！"
        });
      } else {
        this.images = [url];
        this.show = true;
      }
    },
    closeView() {
      this.images = [];
    },
    onChange(index) {
      console.log(index);
    },
    goPlace(id) {
      this.$router.push({
        path: "/place",
        query: {
          id
        }
      });
    },
    goDistort(id) {
      Dialog.confirm({
        title: "提示",
        message: "确认误报吗"
      })
        .then(() => {
          distort({ id })
            .then(res => {
              if (res.code == 0) {
                Dialog.alert({
                  title: "提示",
                  message: "操作成功！"
                });
                this.getData();
              }
            })
            .catch(error => {});
        })
        .catch(() => {
          // on cancel
        });
    },
    async goReceipt(id) {
      let res = await receipt({ id });
      if (res.code == 0) {
        Dialog.alert({
          title: "提示",
          message: "操作成功！"
        });
        this.getData();
      }
    },
    changeType(val) {
      this.getData();
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
    async getData() {
      this.loading = true;
      console.log(this.params, "params");
      let res = await getList(this.params);
      console.log(res, "res");
      if (res.code == 0) {
        this.warnningList = res.object;
      }
      this.loading = false;
    }
  }
};
</script>
<style>
.van-tabs__nav--card {
  margin: 0 !important;
}
.van-tab.van-tab--active {
  background-color: #363291 !important;
}
.van-tabs__nav--card {
  border-color: #363291 !important;
}
.van-tabs__nav--card .van-tab {
  border-color: #363291 !important;
  color: #363291 !important;
}
.van-tabs__nav--card .van-tab.van-tab--active {
  color: #fff !important;
}
</style>
<style scoped lang="scss">
.home {
  width: 100%;
  padding-bottom: 50px;
  background-color: #e1e0f1;
  .item {
    position: relative;
    text-align: left;
    padding: 20px 30px;
    font-size: 16px;
    font-weight: 400;
    border-bottom: 1px solid #5a6876;
    // &.last{
    //   border: none;
    // }
    .address {
      position: relative;
      display: flex;
      .label {
        white-space: nowrap;
      }
      .place {
        width: 18px;
        height: 18px;
        position: absolute;
        top: 2px;
        right: -15px;
        background: url(../assets/place.png) no-repeat center;
        background-size: cover;
        cursor: pointer;
      }
    }
    .mark {
      position: absolute;
      right: 95px;
      top: 35px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background-color: red;
      &.yellow {
        background-color: yellow;
      }
      &.green {
        background-color: green;
      }
    }
    .btns {
      display: flex;
      align-items: center;
    }
  }
}
</style>
