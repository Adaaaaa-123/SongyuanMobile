<template>
  <div id="app">
    <router-view />
    <van-tabbar v-model="active" route v-show="currentPath">
      <van-tabbar-item replace to="/home" icon="todo-list">预警列表</van-tabbar-item>
      <van-tabbar-item replace to="/total" icon="chart-trending-o">统计</van-tabbar-item>
      <van-tabbar-item replace to="/set" icon="setting">设置</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
export default {
  data() {
    return {
      active: "Home",
      currentPath: ""
    };
  },
  created() {
    this.currentPath = this.$route.path !== "/login";
    console.log(this.currentPath, "当前路由");
  },
  mounted() {},
  watch: {
    $route(to, from) {
      this.currentPath = this.$route.path !== "/login";
    }
  },
  methods: {}
};
</script>
<style lang="scss">

body,#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #e1e0f1
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
