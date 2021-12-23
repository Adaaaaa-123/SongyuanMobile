<template>
  <div class="feedback">
    <div class="back" @click="goBack"></div>
    <div class="msg">
      <div class="text">
        <p>告警类型：{{getCarType(query.carAlarm.vehicleClass)}}</p>
        <p>告警时间：{{query.carAlarm.passTime.substr(0,19)}}</p>
        <p>告警地址：{{query.carAlarm.tollgateName}}</p>
      </div>
      <img :src="query.carAlarm.storageUrl" alt />
    </div>
    <div class="form">
      <p style="fontSize:16px">反馈内容 :</p>
      <van-form ref="form" @submit="onSubmit">
        <van-field
          v-model="params.disposeContent"
          type="textarea"
          name="disposeContent"
          placeholder
          :rules="[{ trigger: 'onSubmit',required: true, message: '请填写反馈内容！' }]"
        />
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">提交</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import { conduct } from "@/api/feedback";
import { Dialog } from "vant";
export default {
  name: "Feedback",
  data() {
    return {
      query: {},
      params: {
        disposeContent: "",
        img: '',
        policeId: "11",
        relationId: ""
      }
    };
  },
  created() {
    this.query = this.$route.params;
    this.params.relationId = this.query.id;
    this.params.policeId = '';
    console.log(this.query, "qeu");
  },
  mounted() {},
  methods: {
    onSubmit(values) {
      console.log("submit", values);
      this.$refs.form
        .validate()
        .then(() => {
          conduct(this.params)
            .then(res => {
              console.log(res,'返回值');
              if (res.code == 0) {
                Dialog.alert({ 
                  title: "提示",
                  message: "操作成功！"
                });
                this.goBack()
              }
            })
            .catch(error => {});
        })
        .catch(() => {});
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
    goBack() {
      this.$router.push("/home");
    },
    async goConduct() {
      let res = await conduct();
      if (res.code == 0) {
        Dialog.alert({
          title: "提示",
          message: "操作成功！"
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
.feedback {
  height: 100%;
  position: relative;
  .back {
    width: 35px;
    height: 35px;
    background: url(../../assets/back.png) no-repeat center;
    background-size: cover;
    position: absolute;
    z-index: 9;
  }
  .form {
    box-sizing: border-box;
    padding: 10px;
  }
  .msg {
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    padding-top: 30px;
    border: 1px solid #363291;

    img {
      width: 80px;
      height: 80px;
    }
    .text {
      text-align: left;
      margin-top: 12px;
    }
  }
}
</style>
