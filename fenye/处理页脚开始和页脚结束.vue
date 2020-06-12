<template>
  <div>
    <h1>Index</h1>
    <ul>
      <li v-for="(item,index) in showArr" :key="index">{{item}}</li>
    </ul>
    <ul>
      <li v-for="(item,index) in footArr" :key="index" @click="toPage(item)">{{item}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      list: [],
      footArr: [],
      showArr: []
    };
  },
  created() {
    this.list = this.makeArr(100);
  },
  mounted() {
    this.toPage(1);
  },
  methods: {
    makeArr(num) {
      let arr = [];
      for (let i = 0; i < num; i++) {
        arr.push(i + 1);
      }
      return arr;
    },
    toPage(index) {
      this.showArr = [];
      this.footArr = [];
      let listLen = this.list.length;
      //每页显示多少个
      let showLen = 10;
      //总页数
      let count =
        listLen / showLen > parseInt(listLen / showLen)
          ? parseInt(listLen / showLen) + 1
          : parseInt(listLen / showLen);
      //console.log(count);


      //处理页脚开始，和页脚结束
      let footShowLen = 5; //页脚显示数量
      let footstart = 0;
      let footend = 0;
      if (count <= footShowLen) {
        //如果页脚数量得不到要渲染的数量则从1开始到页脚数量结束
        footstart = 1;
        footend = count;
      } else {
        //能够达到页脚数量渲染要求
        //处理页脚开始坐标
        if (index - parseInt(footShowLen / 2) > 0) {
          //假如一共有10个页脚，要求显示5页脚，当前为1页，因为要让当前页优先显示在中间，所以
          //先判断当前页号减去要求显示页脚的一半，判断是否大于0，如果大于0说明当前为3页或3页后面的页号
          //如果不大于说明当前为1或2页，所以为了达到页脚数量渲染要求，1,2页渲染都从1开始渲染
          if(index + parseInt(footShowLen / 2)<count){
            //但是如果有10个页脚，显示5个，当前为10页，根据上面的判断10-要求显示的一半，得出从8开始渲染，到10结束
            //很明显达不到渲染页脚数量的要求，所以就要判断当前页表有没有达到末尾，
            //而用当前页+要求显示的一半的结果大不大于页脚总数量可以判断到没到末尾
            footstart = index - parseInt(footShowLen / 2);
          }else{
            footstart = count - footShowLen+1;
          }
        } else {
          footstart = 1;
        }
        //处理页脚结束坐标
        if(index+parseInt(footShowLen / 2)<count){
          //处理页脚结束页标则和这页脚开始差不多，页脚末尾就是先判断有没有到达末附近几个（假如有10页，显示5个，当前为8,9,10）
          //达到附近几个则末尾为页脚总数量
          if(index-parseInt(footShowLen / 2)>0){
            //这里又有个判断是因为假如当前为1,2以后的页，上面那个条件也成立，但是假如当前为1,1+要求显示的一半，开始再从1开始，
            //很明显达不到要求显示的数量，所以这里要先判断一下当前页标是不是为开始的坐标
            footend = index + parseInt(footShowLen / 2);
          }else{
            footend = footShowLen;
          }
          
        }else{
          footend = count;
        }
      }
      for (let i = footstart; i <= footend; i++) {
        this.footArr.push(i);
      }
      

      let start = (index - 1) * showLen;
      let end = index * showLen;
      if (end > listLen - 1) {
        end = listLen - 1;
      }
      for (let i = start; i <= end; i++) {
        this.showArr.push(this.list[i]);
      }
    }
  }
};
</script>

<style>
</style>