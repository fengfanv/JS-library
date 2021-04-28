<template>
  <div class="home">
    <div id="map_div"></div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      //echart 配制option
      options: {
        tooltip: {
          //提示窗样式
          triggerOn: "click", //mousemove、click
          padding: 8,
          borderWidth: 0,
          trigger: "item",
          extraCssText: "box-shadow: 0 0 20px rgb(198,54,95) inset;",
          backgroundColor: "rgba(198,54,95,0.5)",
          textStyle: {
            color: "#ffffff",
            fontSize: 13,
          },
          formatter: function (e, t, n) {
            let data = e.data;
            let context = `<div>
                  <p>${data.name}</p>
                  <p>
                    <span>访问量：</span>
                    <span>${data.value}</span>
                  </p>
                </div>`;
            return context;
          },
        },
        visualMap: {
          show: true,
          left: 26,
          bottom: 20,
          showLabel: true,
          textStyle: {
            color: "#00b7fa",
          },
          pieces: [
            {
              gte: 3000,
              label: "<4000",
              color: "#181b86",
            },
            {
              gte: 2000,
              lt: 3000,
              label: "<3000",
              color: "#1f2d87",
            },
            {
              gte: 1000,
              lt: 2000,
              label: "<2000",
              color: "#264289",
            },
            {
              lt: 1000,
              label: "<1000",
              color: "#266592",
            },
          ],
        },
        geo: {
          map: "china",//china，hebei等，这里换地图
          scaleLimit: {
            min: 1,
            max: 1,
          },
          zoom: 1,
          top: "center",
          label: {
            normal: {
              show: false,
              fontSize: 10,
              color: "#ffffff",
            },
          },
          itemStyle: {
            normal: {
              areaColor: "#266592",
              borderWidth: 2,
              borderColor: "rgba(36, 183, 223, 1)", //地图边的颜色
            },
          },
          emphasis: {
            //高亮状态下的样式
            itemStyle: {
              show: false,
              areaColor: "#266592",
            },
            label: {
              color: "#ffffff",
            },
          },
        },
        series: [
          {
            name: "访问量",
            type: "map",
            geoIndex: 0,
            // type: "scatter",
            coordinateSystem: "geo",
            data: [],
          },
        ],
      },

      //echart data
      dataList: [
        {
          name: "南海诸岛",
          value: 100,
        },
        {
          name: "北京",
          value: 5000,
        },
        {
          name: "天津",
          value: 3000,
        },
        {
          name: "上海",
          value: 6000,
        },
        {
          name: "重庆",
          value: 4000,
        },
        {
          name: "河北",
          value: 2000,
        },
        {
          name: "河南",
          value: 1000,
        },
        {
          name: "云南",
          value: 110,
        },
        {
          name: "辽宁",
          value: 19,
        },
        {
          name: "黑龙江",
          value: 150,
        },
        {
          name: "湖南",
          value: 690,
        },
        {
          name: "安徽",
          value: 60,
        },
        {
          name: "山东",
          value: 39,
        },
        {
          name: "新疆",
          value: 4,
        },
        {
          name: "江苏",
          value: 3000,
        },
        {
          name: "浙江",
          value: 104,
        },
        {
          name: "江西",
          value: 36,
        },
        {
          name: "湖北",
          value: 52,
        },
        {
          name: "广西",
          value: 33,
        },
        {
          name: "甘肃",
          value: 7,
        },
        {
          name: "山西",
          value: 5,
        },
        {
          name: "内蒙古",
          value: 778,
        },
        {
          name: "陕西",
          value: 22,
        },
        {
          name: "吉林",
          value: 4,
        },
        {
          name: "福建",
          value: 18,
        },
        {
          name: "贵州",
          value: 5,
        },
        {
          name: "广东",
          value: 5000,
        },
        {
          name: "青海",
          value: 1,
        },
        {
          name: "西藏",
          value: 0,
        },
        {
          name: "四川",
          value: 44,
        },
        {
          name: "宁夏",
          value: 4,
        },
        {
          name: "海南",
          value: 22,
        },
        {
          name: "台湾",
          value: 5000,
        },
        {
          name: "香港",
          value: 5000,
        },
        {
          name: "澳门",
          value: 5000,
        },
      ],
    };
  },
  mounted() {
    console.log(this);
    this.setEchartOption();

    setTimeout(() => {
      this.initEchartMap();
    }, 2000);

    
  },
  methods: {
    //初始化中国地图
    initEchartMap() {
      let mapDiv = document.getElementById("map_div");
      let myChart = this.$echarts.init(mapDiv);
      myChart.setOption(this.options);
    },
    //修改echart配制
    setEchartOption() {
      this.options.series[0]["data"] = this.dataList;
    },
  },
};
</script>
<style scoped>
#map_div {
  width: 100%;
  height: 6rem;
}
</style>
