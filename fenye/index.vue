<template>
  <div>
    <h1>I am Index</h1>
    <ul>
      <li v-for="(item,index) in showList" :key="index">{{item}}</li>
    </ul>
    <ul>
      <li v-for="(item,index) in footList" :key="index" @click="toPage(item)">第{{item}}页</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      showList: [],//显示每页数据的数组
      footList: [],//显示页码的数组
      showSize: 4,//每页显示多少条数据
      footSize: 5,//页码显示的数量
      arr: []//总共数据
    };
  },
  mounted() {
    for (let i = 0; i < 100; i++) {
      this.arr.push("数据：" + (i + 1));
    }
    this.toPage(1);
  },
  methods: {
    toPage(index) {
      this.footList = [];
      this.showList = [];
      let arrLen = this.arr.length;
      //能分多少页
      let totalPage =
        arrLen / this.showSize > parseInt(arrLen / this.showSize)
          ? parseInt(arrLen / this.showSize) + 1
          : parseInt(arrLen / this.showSize);


      //渲染页脚
      //页脚数量有this.footSize要求渲染的数量要求
      if (totalPage > this.footSize) {
        let footStart = 0;
        let footEnd = 0;
        if (index < this.footSize / 2) {
          //当前页为1或2页，如页脚要求显示5个页脚，当前页面要显示1,2,3,4,5
          footStart = 1;
          footEnd = this.footSize;
        } else if (index > totalPage - 2) {
          //当前为最后的两页
          footStart = totalPage - (this.footSize-this.footSize%2);
          footEnd = totalPage;
        } else {
          //普通情况
          footStart = index - parseInt(this.footSize / 2);
          footEnd = index + parseInt(this.footSize / 2);
        }
        for (let i = footStart; i <= footEnd; i++) {
          this.footList.push(i);
        }
      } else {
        //页脚数量达不到this.footSize要求渲染的数量要求，所以就渲染全部
        for (let i = 1; i <= totalPage; i++) {
          this.footList.push(i);
        }
      }




      let start = (index - 1) * this.showSize + 1;
      let end = index * this.showSize;
      if (index === totalPage) {
        end = end > arrLen ? arrLen : end;
      }
      for (let i = start - 1; i < end; i++) {
        this.showList.push(this.arr[i]);
      }
    }
  }
};
</script>

<style>
</style>