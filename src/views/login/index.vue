<template>
  <div class="login" v-loading="loading">
    <h1>处置APP</h1>
    <van-form ref="form">
      <van-field
        v-model="form.username"
        name="用户名"
        label="用户名"
        placeholder
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="form.password"
        type="password"
        name="密码"
        label="密码"
        placeholder
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <van-field
        v-model="form.result"
        name="验证码"
        label="验证码"
        placeholder
        :rules="[{ required: true, message: '请填写验证码' }]"
      />
      <el-image :src="captchaImg" class="captchaImg" @click="getCaptacha"></el-image>
      <div style="margin: 16px;">
        <van-button round block type="info" @click="onSubmit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import qs from "qs";
import { loginList, getCaptacha, getUserInfo, executeList } from "@/api/login";
import { setToken, getToken, removeToken } from "@/utils/auth.js";
import VConsole from "vconsole";

export default {
  name: "Login",
  data() {
    return {
      loading: false,
      captchaImg: "",
      form: {
        username: "",
        password: "",
        result: "",
        resultKey: ""
      }
    };
  },
  created() {
    this.getCaptacha();
  },
  mounted() {},
  methods: {
    // 登录
    async loginList() {
      this.loading = true;
      let params = qs.stringify(this.form);
      let res = await loginList(params);
      console.log(res, "res");
      if (res && res.code == 0) {
        this.getUserInfo();
      } else {
        this.loading = false;
        removeToken();
      }
    },
    async getUserInfo() {
      let res = await getUserInfo();
      console.log(res, "rs");
      if (res.code == 0) {
        localStorage.setItem("userInfo", JSON.stringify(res.data.sysUser));
        let params = {
          orgId: res.data.sysUser.orgId,
          userId: res.data.sysUser.userId
        };
        this.executeList(params);
      } else {
        this.loading = false;
      }
    },
    // 执行路由规则
    async executeList(lists) {
      let res = await executeList(lists);
      if (res.code == 0) {
        localStorage.setItem("data", JSON.stringify(res.object));
        this.$router.push("/home");
        this.loading = false;
      } else {
        this.loading = false;
      }
    },
    async getCaptacha() {
      let res = await getCaptacha();
      console.log(res,'resssss');
      if (res.code == 0) {
        this.form.resultKey = res.data.data.resultKey;
        this.form.result = "";
        this.captchaImg = res.data.data.captchaImg;
      }
    },
    onSubmit() {
      this.$refs.form
        .validate()
        .then(() => {
          this.loginList();
        })
        .catch(() => {
          //验证失败
        });
    }
  }
};
</script>

<style scoped lang="scss">
.login {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  .pd15 {
    margin-top: 10px;
  }
  .captchaImg {
    display: block;
    margin: auto;
    margin-top: 8px;
  }
}
</style>
