<template>
  <div ref="dom"></div>
</template>
<script>
import echarts from "echarts"; //引入echarts
export default {
  name: "BrokenLine",
  props: {
    value: Array,
    text: String
  },
  data() {
    return {
      dom: null
    };
  },
  watch: {
    value() {
      this.initEchart();
    }
  },
  mounted() {},
  beforeDestroy() {},

  methods: {
    initEchart() {
      // 绘制地图2
      this.dom = echarts.init(this.$refs.dom);
      let data = this.value ? this.value : [];
      let legends = data.map(x => x.name);
      let colNames = ["1号", "2号", "3号", "4号", "5号", "6号"];
      let seriesList = data.map(x => {
        return {
          name: x.name,
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 5,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new this.$echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: x.colors[0]
                  },
                  {
                    offset: 0.8,
                    color: x.colors[1]
                  }
                ],
                false
              ),
              shadowColor: "rgba(0, 0, 0, 0.1)",
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: x.colors[2],
              borderColor: x.colors[3],
              borderWidth: 12
            }
          },
          data: x.data
        };
      });
      let options = {
        backgroundColor: "rgb(38, 54, 103)",
        title: {
          text: "农用车载人告警趋势",
          textStyle: {
            fontWeight: "normal",
            fontSize: 16,
            color: "#F1F1F3",
            textAlign: "center"
          },
          left: "6%"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            lineStyle: {
              color: "#14aee9"
            }
          }
        },
        legend: {
          icon: "rect",
          itemWidth: 14,
          itemHeight: 8,
          itemGap: 13,
          data: legends,
          right: "10%",
          bottom:0,
          // align:'center',
          textStyle: {
            fontSize: 12,
            color: "#F1F1F3"
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: "#57617B"
              }
            },
            data: colNames
          },
          {
            axisPointer: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: "#57617B"
              }
            },
            axisTick: {
              show: false
            },

            position: "bottom",
            offset: 20,
            data: [
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              "",
              ""
              // {
              //   value: "周六",
              //   textStyle: {
              //     align: "left"
              //   }
              // },
              // "周日"
            ]
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "预警数",
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: "#57617B"
              }
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 14
              }
            },
            splitLine: {
              lineStyle: {
                color: "#57617B"
              }
            }
          }
        ],
        series: seriesList
      };
      // 地图上数据
      this.dom.setOption(options);
    }
  }
};
</script>

<style>
</style>
