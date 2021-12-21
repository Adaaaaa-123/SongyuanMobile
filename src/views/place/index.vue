<template>
  <div class="place">
    <div class="map-box">
      <div class="back" @click="goBack"></div>
      <OlMap></OlMap>
    </div>
  </div>
</template>

<script>
import { coord } from "@/api/place";
import OlMap from "@/components/OlMap";
export default {
  name: "Place",
  components: {
    OlMap
  },
  data() {
    return {};
  },
  created() {
    console.log("created");
  },
  mounted() {
    console.log("mounted");
  },
  methods: {
    goBack() {
      this.$router.push("/home");
    }
  }
};
</script>

<style scoped lang="scss">
.map-box {
  position: relative;
  .back {
    width: 35px;
    height: 35px;
    background: url(../../assets/back.png) no-repeat center;
    background-size: cover;
    position: absolute;
    z-index: 9;
  }
}
</style>
