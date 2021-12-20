<template>
  <div class="login">
    <h1>处置APP</h1>
    <van-form @submit="onSubmit">
      <van-field
        v-model="form.username"
        name="用户名"
        label="用户名"
        placeholder=""
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="form.password"
        type="password"
        name="密码"
        label="密码"
        placeholder=""
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { setToken, getToken } from "@/utils/auth.js";
export default {
  name: "Login",
  data() {
    return {
      form: {}
    };
  },
  created() {},
  mounted() {},
  methods: {
    onSubmit() {
      setToken("dfdfdsfds");
      console.log(getToken());
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
}
</style>
