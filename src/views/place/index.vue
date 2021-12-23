<template>
  <div class="place">
    <div class="map-box">
      <div class="back" @click="goBack"></div>
      <OlMap :value="value"></OlMap>
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
    return {
      value: {
        carList: [],
        position: []
      }
    };
  },
  created() {
    // console.log("created");
  },
  mounted() {
    // // console.log("mounted");
    // console.log(this.$route.query,'query');
    this.getPlace();
  },
  methods: {
    async getPlace() {
      let res = await coord({
        id: this.$route.query.id
      });
      if (res.code == 0) {
        console.log(res, "返回值");
        if (res.object.carLat && res.object.carLon) {
          let arr = [];
          arr.push([res.object.carLon, res.object.carLat]);
          this.value.carList = arr;
        }
        if (res.object.tollgateLat && res.object.tollgateLon) {
          let arr = [];
          arr.push([res.object.tollgateLon, res.object.tollgateLat]);
          this.value.position = arr;
        }
        console.log(this.value, "value");
      }
    },
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
