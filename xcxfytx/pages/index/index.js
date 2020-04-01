Page({
  /*页面的初始数据*/
  data: {
    scrollindex: 0,  //当前页面的索引值
    totalnum: 6,  //总共页面数
    starty: 0,  //开始的位置x
    endy: 0, //结束的位置y
    critical:40, //触发翻页的临界值
    margintop:0,  //滑动下拉距离
    miao:0,
  },
  //touchstart事件 手指触摸动作开始
  scrollTouchstart: function (e) {
    let py = e.touches[0].pageY;
    //touches[0].pageY //距离 --文档-- 顶部都少距离（Y轴）
    this.setData({
      starty: py
    })
  },
  //touchmove事件  手指触摸后移动
  scrollTouchmove: function (e) {
    let py = e.touches[0].pageY;
    //touches[0].pageY //距离 --文档-- 顶部都少距离（Y轴）
    let d = this.data;
    this.setData({
      endy: py,
    })
  //移动后距离居上部分的距离 - 移动之前距离上部的距离 
    if (py - d.starty < 600 && py - d.starty > -600) {
      this.setData({
        margintop: py - d.starty
        //移动后距离居上部分的距离 - 移动之前距离上部的距离 = 移动了多少距离
      })
    }
  },
  //touchend事件   手指触摸动作结束
  scrollTouchend: function (e) {
    let that=this;
    let d = this.data;
    //向上运动（上一页）
    if (d.endy - d.starty > 100 && d.scrollindex > 0) {
      this.setData({
        scrollindex: d.scrollindex - 1
      })
    //向下运动（下一页）
    } else if (d.endy - d.starty < -100 && d.scrollindex < d.totalnum - 1) {
                                            //判断当前页数是不是最后一页
      this.setData({
        scrollindex: d.scrollindex + 1
      })
    }
    this.setData({ //手指离开后  移动前距离，移动后距离，移动多少距离赋值为0为下一次做准备
      starty: 0,
      endy: 0,
      margintop: 0,
      miao:0.3,
    })
    setTimeout(function(){
      that.setData({
        miao: 0
      });
    },300);

  },

})