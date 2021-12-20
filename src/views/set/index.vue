<template>
  <div class="set">
    <van-cell-group>
      <van-switch-cell active-color="#aba7e1" v-model="checked" title="预警播报" />
    </van-cell-group>
    <div class="btns">
      <van-button
        style="margin-bottom:10px"
        :loading="loading"
        type="info"
        color="#363291"
        block
        loading-type="spinner"
      >确认</van-button>
      <van-button color="#363291" :loading="loading" type="info" plain hairline block loading-type="spinner">返回</van-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Set",
  data() {
    return {
      checked: false,
      loading: false
    };
  },
  created() {},
  mounted() {},
  methods: {}
};
</script>

<style scoped lang="scss">
.set /deep/ .van-switch-cell {
  color: #fff;
  background-color: #363291;
}
.set {
  position: relative;
  height: 100%;
  .btns{
      width: 100%;
      position: absolute;
      bottom: 40px;
      display: flex;
  }
  //   background-color: #194c81;
}
</style>
