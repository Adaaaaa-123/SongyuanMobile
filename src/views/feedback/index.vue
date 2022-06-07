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
        <div class="shot_container">
          <el-button size="small" style="margin-top:15px" type="primary" icon="el-icon-camera-solid" @click="chooseType">拍摄</el-button>
          <!-- 移动端 -->
          <el-drawer title="请选择操作" :visible.sync="drawer" :direction="'btt'">
            <div class="box">
              <div class="item">
                <label for="fileImage">图片</label>
                <!-- 拍照或选择文件 -->
                <input id="fileImage" type="file" accept="image/*" hidden @change="fileImage" />
              </div>
              <div class="item">
                <label for="fileVideo">视频</label>
                <!-- 录像或选择文件 -->
                <input id="fileVideo" type="file" accept="video/*" hidden @change="fileVideo" />
              </div>
            </div>
          </el-drawer>
          <!-- PC端 -->
          <el-dialog title="拍摄" :visible.sync="dialogVisible" width="100%">
            <div class="video_box">
              <!-- 摄像头显示画面 -->
              <video ref="videoRef1" id="video" width="400" height="320" controls></video>
              <div class="img_content">
                <div class="img_box">
                  <div>图片：</div>
                  <div class="canvas_box">
                    <!-- 拍完照片或视频回显标签 -->
                    <!-- <canvas ref="canvasRef1" width="100" height="80"></canvas> -->
                  </div>
                </div>
                <div class="img_box">
                  <div>视频：</div>
                  <div class="video_canvas_box">
                    <!-- 拍完照片或视频回显标签 -->
                    <!-- <canvas ref="canvasRef2" width="100" height="80"></canvas> -->
                  </div>
                </div>
              </div>
            </div>
            <span slot="footer" class="dialog-footer">
              <el-button @click="recordClick">{{isRecording ? '停 止': '录 制'}}</el-button>
              <el-button @click="shotClick">拍 照</el-button>
              <el-button @click="dialogCancel">取 消</el-button>
              <el-button type="primary" @click="dialogOk">确 定</el-button>
            </span>
          </el-dialog>
        </div>
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
      fileList: [],
      query: {},
      params: {
        disposeContent: "",
        img: "",
        policeId: "11",
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
    this.params.policeId = "";
    console.log(this.query, "qeu");
  },
  mounted() {
    // 注册全局文件删除事件，挂载到window
    window.fileDel = this.fileDel;
  },
  methods: {
    // 拍摄判断
    chooseType() {
      if (this.isMobile()) {
        this.drawer = true;
      } else if (this.isPc()) {
        this.dialogVisible = true;
        this.$nextTick(() => {
          if (
            navigator.mediaDevices.getUserMedia ||
            navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia
          ) {
            //调用用户媒体设备, 访问摄像头
            this.getUserMedia(
              {
                video: {
                  width: 400,
                  height: 320
                }
              },
              this.mediaSuccess,
              this.mediaError
            );
          } else {
            alert("不支持访问用户媒体");
          }
        });
      }
    },
    // 移动端
    fileImage(e) {
      this.$emit("update", e.target.files);
      let file = e.target.files[0];
      console.log("这是图片名称" + file.name);
      this.drawer = false;
    },
    fileVideo(e) {
      this.$emit("update", e.target.files);
      let file = e.target.files[0];
      console.log("这是视频名称" + file.name);
      this.drawer = false;
    },
    // PC端
    //打开摄像头
    getUserMedia(constraints, success, error) {
      if (navigator.mediaDevices.getUserMedia) {
        //最新的标准API
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then(success)
          .catch(error);
      } else if (navigator.webkitGetUserMedia) {
        //webkit核心浏览器
        navigator.webkitGetUserMedia(constraints, success, error);
      } else if (navigator.mozGetUserMedia) {
        //firfox浏览器
        navigator.mozGetUserMedia(constraints, success, error);
      } else if (navigator.getUserMedia) {
        //旧版API
        navigator.getUserMedia(constraints, success, error);
      }
    },
    mediaSuccess(stream) {
      //兼容webkit核心浏览器
      let CompatibleURL = window.URL || window.webkitURL;
      //将视频流设置为video元素的源
      console.log(stream);
      window.stream = stream;
      if (window.URL) {
        this.$refs.videoRef1.srcObject = stream;
      } else {
        this.$refs.videoRef1.src = stream;
      }

      //video.src = CompatibleURL.createObjectURL(stream);
      this.$refs.videoRef1.srcObject = stream;
      this.$refs.videoRef1.play();
    },
    mediaError(error) {
      console.log(`访问用户媒体设备失败${error.name}, ${error.message}`);
    },
    // 弹框确定
    dialogOk() {
      console.log(this.imgFileList, this.videoFileList);
      this.$emit("update", this.imgFileList, this.videoFileList);
      this.dialogCancel();
    },
    // 弹框取消
    dialogCancel() {
      this.resetPc();
      this.dialogVisible = false;
    },
    // 重置状态
    resetPc() {
      // 图片集合
      this.imgFileList = [];
      // 图片dom清空
      let cbDom = document.getElementsByClassName("canvas_box");
      if (cbDom.length) {
        cbDom[0].innerHTML = "";
      }
      // 视频集合
      this.videoFileList = [];
      this.recordedBlobsArr = [];
      // 视频dom清空
      let vbDom = document.getElementsByClassName("video_canvas_box");
      if (vbDom.length) {
        vbDom[0].innerHTML = "";
      }
    },
    // 拍照
    shotClick() {
      // 生成随机id，用于删除查找
      let id = "id" + Math.random();
      // 创建canvas
      let canvas = this.creatCanvas(id);
      // 绘画
      canvas.getContext("2d").drawImage(this.$refs.videoRef1, 0, 0, 100, 80);
      // canvas转为图片
      let img = canvas.toDataURL("image/png");
      // 将图片转为可上传的file
      let file = this.dataURLtoFile(img);
      // 将图片file存储
      this.imgFileList.push({ key: id, file });
    },
    creatCanvas(id) {
      let canvas_box = document.getElementsByClassName("canvas_box")[0];
      let div = document.createElement("div");
      div.style.marginRight = "10px";
      div.style.position = "relative";
      let canvas = document.createElement("canvas");
      canvas.height = 80;
      canvas.width = 100;
      let span = document.createElement("span");
      span.style.cursor = "pointer";
      span.innerText = "×";
      span.style.fontSize = "30px";
      span.style.position = "absolute";
      span.style.top = "-5px";
      span.style.right = "5px";
      span.id = id;
      span.onclick = this.fileDel;
      div.appendChild(span);
      div.appendChild(canvas);
      canvas_box.appendChild(div);
      return canvas;
    },
    // 将base64转换为blob,需要file进行上传
    dataURLtoFile(dataurl, filename = "file") {
      let arr = dataurl.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let suffix = mime.split("/")[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], `${filename}.${suffix}`, { type: mime });
    },
    // 录制
    recordClick() {
      if (!this.isRecording) {
        // 点击录制
        this.startRecording();
      } else {
        // 点击停止
        this.stopRecording();
      }
      this.isRecording = !this.isRecording;
    },
    // 开始录制
    startRecording() {
      this.recordedBlobs = [];
      var options = {
        mimeType: "video/webm;codecs=vp9"
      };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.log(options.mimeType + " is not Supported");
        options = {
          mimeType: "video/webm;codecs=vp8"
        };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          console.log(options.mimeType + " is not Supported");
          options = {
            mimeType: "video/webm"
          };
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.log(options.mimeType + " is not Supported");
            options = {
              mimeType: ""
            };
          }
        }
      }
      try {
        this.mediaRecorder = new MediaRecorder(window.stream, options);
      } catch (e) {
        console.error("Exception while creating MediaRecorder: " + e);
        alert(
          "Exception while creating MediaRecorder: " +
            e +
            ". mimeType: " +
            options.mimeType
        );
        return;
      }
      console.log(
        "Created MediaRecorder",
        this.mediaRecorder,
        "with options",
        options
      );
      this.mediaRecorder.onstop = this.handleStop;
      this.mediaRecorder.ondataavailable = this.handleDataAvailable;
      this.mediaRecorder.start(10); // collect 10ms of data
      console.log("MediaRecorder started", this.mediaRecorder);
    },
    // 停止录制回调函数
    handleStop(event) {
      console.log("Recorder stopped: ", event);
    },
    // 录制中
    handleDataAvailable(event) {
      if (event.data && event.data.size > 0) {
        this.recordedBlobs.push(event.data);
      }
    },
    // 点击停止录制按钮
    stopRecording() {
      //影藏录制中提
      this.mediaRecorder.stop();
      // 生成随机id，用于删除查找
      let id = "id" + Math.random();
      // buffer转dataUrl
      this.bufferToDataUrl(id);
      // 显示
      this.showVideo(id);
      console.log("Recorded Blobs: ", this.recordedBlobs);
      //recordedVideo.controls = true;
    },
    //buffer转dataUrl
    bufferToDataUrl(id) {
      let blob = new Blob(this.recordedBlobs, {
        type: "video/webm"
      });
      this.recordedBlobsArr.push({ key: id, Blobs: this.recordedBlobs });
      this.recordedBlobs = [];
      let reader = new FileReader();
      let _this = this;
      reader.onload = function() {
        let file = _this.dataURLtoFile(reader.result, "mp4");
        // 将视频流file存储
        _this.videoFileList.push({ key: id, file });

        // 将blob转为MP4进行下载
        // var a = document.createElement('a');
        // a.style.display = 'none';
        // a.href = reader.result;
        // //文件名 通过方法传进来 检测是否合法？
        // a.download = 'record.mp4';
        // document.body.appendChild(a);
        // a.click();
        // setTimeout(function() {
        //     document.body.removeChild(a);
        //     window.URL.revokeObjectURL(reader.result);
        // }, 100);
      };
      reader.readAsDataURL(blob);
    },
    showVideo(id) {
      let video = this.creatVideoCanvas(id);
      let b = this.recordedBlobsArr.filter(item => item.key == id);
      var superBuffer = new Blob(b[0].Blobs, {
        type: "video/mp4"
      });
      //recordedVideo.src = window.URL.createObjectURL(superBuffer);
      video.src = window.URL.createObjectURL(superBuffer);
      // video.play()
    },
    creatVideoCanvas(id) {
      let video_canvas_box = document.getElementsByClassName(
        "video_canvas_box"
      )[0];
      let div = document.createElement("div");
      div.style.marginRight = "10px";
      div.style.position = "relative";
      let video = document.createElement("video");
      video.height = 160;
      video.width = 200;
      video.controls = true;
      let span = document.createElement("span");
      span.style.cursor = "pointer";
      span.innerText = "×";
      span.style.fontSize = "30px";
      span.style.position = "absolute";
      span.style.top = "-5px";
      span.style.right = "5px";
      span.style.zIndex = 1000;
      span.id = id;
      span.onclick = this.fileDel;
      div.appendChild(span);
      div.appendChild(video);
      video_canvas_box.appendChild(div);
      return video;
    },
    // 是否是移动端
    isMobile() {
      return /(iPhone|iPad|iPod|iOS|Android|Linux armv8l|Linux armv7l|Linux aarch64)/i.test(
        navigator.platform
      );
    },
    // 是否是PC
    isPc() {
      return /(Win32|Win16|WinCE|Mac68K|MacIntel|MacIntel|MacPPC|Linux mips64)/i.test(
        navigator.platform
      );
    },
    // 删除视频或图片
    fileDel(e) {
      let id = e.target.id;
      // 删除图片
      for (var i = 0; i < this.imgFileList.length; i++) {
        if (this.imgFileList[i].key == id) {
          this.imgFileList.splice(i, 1);
          e.target.parentNode.remove();
          break;
        }
      }
      // 删除视频
      for (var i = 0; i < this.videoFileList.length; i++) {
        if (this.videoFileList[i].key == id) {
          this.videoFileList.splice(i, 1);
          e.target.parentNode.remove();
          break;
        }
      }
      // 删除视频对应存储的流
      for (var i = 0; i < this.recordedBlobsArr.length; i++) {
        if (this.recordedBlobsArr[i].key == id) {
          this.recordedBlobsArr.splice(i, 1);
          break;
        }
      }
    },
    onSubmit(values) {
      console.log("submit", values);
      this.$refs.form
        .validate()
        .then(() => {
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
      margin-top: 12px;
    }
  }
}
</style>
