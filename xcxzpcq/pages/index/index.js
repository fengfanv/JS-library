Page({
  data: {
    touch:{
      src:'',
      distance: 0,  //手指之间距离
      scale: 1,     //比例
      baseWidth:0,
      baseHeight:0,
      scaleWidth:null,//计算后比例宽
      scaleHeight:null,//计算后比例高
      x:0,
      y:0,
    }
  },
  touchstart:function(e) {
    // 单手指缩放开始，也不做任何处理 
    if(e.touches.length == 1) return console.log('双手指触发开始')
    // 注意touchstart 真正代码的开始 // 一开始我并没有这个回调函数，会出现缩小的时候有瞬间被放大过程的bug // 当两根手指放上去的时候，就将distance 初始化。 
    let xMove = e.touches[1].clientX - e.touches[0].clientX;
    let yMove = e.touches[1].clientY - e.touches[0].clientY;
    let distance = Math.sqrt(xMove * xMove + yMove * yMove);
    this.setData({
      'touch.distance':distance,
    })
  },
  touchmove:function(e) {
    let touch = this.data.touch
    // 单手指缩放我们不做任何操作 
      if(e.touches.length == 1) return //console.log('双手指运动')

    let xMove = e.touches[1].clientX - e.touches[0].clientX;
    let yMove = e.touches[1].clientY - e.touches[0].clientY;
    // 新的 ditance 
    let distance = Math.sqrt(xMove * xMove + yMove * yMove);
    let distanceDiff = distance - touch.distance; //这样算不用判断是距离增加还是距离减少，直接按距离算出比例，图片在放大到这个比例
    let newScale = touch.scale + 0.005 * distanceDiff;  //新比例   distanceDiff（距离差异）   新比例要建立在就旧比例的基础上，这样能有更好的用户体验
    // 为了防止缩放得太大，所以scale需要限制，同理最小值也是 
    if(newScale >= 2) {
      newScale = 2;
    }
    if(newScale <= 0.4) {
      newScale = 0.4;
    }
    let scaleWidth = newScale * touch.baseWidth;
    let scaleHeight = newScale * touch.baseHeight;
    // 赋值 新的 => 旧的 
    this.setData({
      'touch.distance': distance,
      'touch.scale': newScale,
      'touch.scaleWidth': scaleWidth,
      'touch.scaleHeight': scaleHeight
    })
  },
  bindload:function(e) {
  // bindload 这个api是<image>组件的api类似<img>的onload属性 
    this.setData({
      'touch.baseWidth': e.detail.width,  //获取图片真实宽度
      'touch.baseHeight': e.detail.height,//获取图片真实高度
      // 'touch.scaleWidth': e.detail.width,
      // 'touch.scaleHeight': e.detail.height
    })
  },
  bindscroll: function (event){
    console.log('Y轴值：' + event.detail.scrollLeft);
    this.setData({
      'touch.x': event.detail.scrollLeft,
      'touch.y': event.detail.scrollTop,
    })
  },
  xuntu:function(){
    var _this=this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths[0];
        console.log(tempFilePaths);
        _this.setData({
          'touch.src': tempFilePaths
        })
      }
    })
  },
  jietu:function(){
    wx.showToast({
      title: '截图中...',
      icon: 'loading',
      duration: 1000
    });
    var _this = this;
    const a1 = wx.createCanvasContext('a1');
    a1.drawImage(_this.data.touch.src, 0, 0, _this.data.touch.scaleWidth, _this.data.touch.scaleHeight);
    a1.draw();
    setTimeout(function () {
      wx.canvasToTempFilePath({
        x: _this.data.touch.x + ((370/2)-50),
        y: _this.data.touch.y + ((250/2)-50),
        width:100,
        height:100,
        // destWidth:110,
        // destHeight:110,
        canvasId: 'a1',
        success: function (res) {
          console.log(res.tempFilePath);
          _this.setData({
            'touch.src': res.tempFilePath
          });
        }
      })
    }, 1000)
  },
  onLoad:function(){
    this.setData({
      'touch.src':'../../images/heng.jpg',
      'touch.scaleWidth':375,
      'touch.scaleHeight':250
    })
  }
})