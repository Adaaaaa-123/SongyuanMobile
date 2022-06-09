<template>
  <div class="feedback">
    <div class="back" @click="goBack"></div>
    <div class="msg">
      <div class="text">
        <p>告警类型：{{query.carAlarm?getCarType(query.carAlarm.vehicleClass):''}}</p>
        <p>告警时间：{{query.carAlarm?query.carAlarm.passTime.substr(0,19):""}}</p>
        <p>告警地址：{{query.carAlarm?query.carAlarm.tollgateName:""}}</p>
      </div>
      <img :src="query.carAlarm?query.carAlarm.storageUrl:''" style="margin-top:12px" alt />
    </div>
    <div class="form">
      <p style="fontSize:16px">反馈内容 :</p>
      <van-form ref="form">
        <van-field
          v-model="params.disposeContent"
          type="textarea"
          name="disposeContent"
          placeholder
          :rules="[{ trigger: 'onSubmit',required: true, message: '请填写反馈内容！' }]"
        />
        <van-uploader v-model="fileList" :max-count="3" style="margin-top:8px">
          <template #preview-cover="{ file }">
            <div class="preview-cover van-ellipsis">{{ file.name }}</div>
          </template>
        </van-uploader>
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit" @click="onSubmit(params)">提交</van-button>
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
      fileList: [],
      query: {},
      params: {
        disposeContent: "222",
        img: "11",
        policeId: "",
        relationId: ""
      },
      drawer: false,
      dialogVisible: false,
      imgFileList: [], // 图片集合
      videoFileList: [], // 视频集合
      isRecording: false, // 是否开始录制
      recordedBlobs: [], // 录制进行中视频流
      recordedBlobsArr: [], // 录制完成后，将视频流进行存储，用于播放
      mediaRecorder: null // mediaRecorder实例
    };
  },
  created() {
    this.query = this.$route.params;
    this.params.relationId = this.query.id;
    this.params.policeId = this.query.carPositionId;
    console.log(this.query, "qeu");
  },
  mounted() {
    // 注册全局文件删除事件，挂载到window
    window.fileDel = this.fileDel;
  },
  methods: {
    onSubmit(values) {
      this.$refs.form
        .validate()
        .then(() => {
          if (!this.fileList.length) {
            Dialog.alert({
              title: "提示",
              message: "请上传现场图片！"
            });
            return;
          }
          let params = {
            ...values
          };
          conduct(this.params)
            .then(res => {
              console.log(res, "返回值");
              if (res.code == 0) {
                Dialog.alert({
                  title: "提示",
                  message: "操作成功！"
                });
                this.goBack();
              }
            })
            .catch(error => {});
        })
        .catch(() => {});
    },
    getCarType(type) {
      if (!type) {
        return;
      }
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
<style>
.preview-cover {
  position: absolute;
  bottom: 0;
  box-sizing: border-box;
  width: 100%;
  padding: 4px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
}
</style>
<style scoped lang="scss">
.feedback {
  height: 100%;
  position: relative;

  .shot_container {
    display: inline-block;
  }
  .box {
    width: 100%;
    height: 100%;
    align-items: center;
    display: flex;
    justify-content: space-around;
  }
  .item {
  }
  .video_box {
    display: flex;
  }
  .img_content {
    padding-left: 20px;
  }
  .video_canvas_box,
  .canvas_box {
    display: flex;
    flex-wrap: wrap;
  }

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
      vertical-align: middle;
    }
  }
}
</style>
