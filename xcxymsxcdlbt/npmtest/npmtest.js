Page({
    data: {
        cardNumber: 7, //牌的数量
        indexArr: [-3, -2, -1, 0, 1, 2, 3], //牌的坐标，0就是最中间那个
        list: [], //用于渲染的列表
        listArr: [], //用来备份初始化后的list数组
        startPageX: 0, //按下触摸时的位置
        cardWidth: 0, //牌在当前设备下的真实宽度
        screenWidth: 0, //当前设备的真实宽度
        isTouch: false, //当前是否为触摸状态
    },
    onLoad() {
        let _this = this;
        _this.init();
    },
    /*层叠轮播图初始化*/
    init: function () {
        let _this = this;
        wx.getSystemInfo({
            success(res) {
                //获取屏幕的宽成功
                let arr = [];
                let len = _this.data.cardNumber;
                let cardWidth = res.screenWidth / 750 * 194;

                for (let i = 0; i < len; i++) {
                    let item = {
                        option: 0, //自定义选项
                        left: (i * (cardWidth / 2)),
                        scale: (3 - Math.abs(_this.data.indexArr[i])) * 0.4,
                        zIndex: 3 - Math.abs(_this.data.indexArr[i]),
                        style: {
                            left: (i * (cardWidth / 2)),
                            transition: 0,
                            zIndex: 3 - Math.abs(_this.data.indexArr[i]),
                            transform: "scale(" + ((3 - Math.abs(_this.data.indexArr[i])) * 0.4) + ")",
                            opacity: (3 - Math.abs(_this.data.indexArr[i]) != 0) ? 1 : 0
                        }
                    }
                    item.option = i;
                    arr.push(item);
                }
                console.log(arr);

                _this.setData({
                    screenWidth: res.screenWidth,
                    cardWidth,
                    list: arr,
                    listArr: arr
                })
            }
        })
    },
    /*触摸开始*/
    touchstart(e) {

        //console.log(e.changedTouches[0].pageX);
        this.setData({
            startPageX: e.changedTouches[0].pageX,
            isTouch: true //开始触摸
        });

    },
    /*触摸移动*/
    touchmove(e) {
        let _this = this;
        let pageX = e.changedTouches[0].pageX;
        let move = pageX - _this.data.startPageX; //正数，向右滑动；负数，向左滑动
        let list = JSON.parse(JSON.stringify(_this.data.list));
        let len = list.length;
        //console.log(move);
        if (move > 0) { //向右滑

            for (let i = 0; i < len; i++) {
                list[i].style.left = list[i].left + ((move) * 0.52);
                if (_this.data.indexArr[i] < 0) {
                    //左边的牌,不包括中间的牌
                    list[i].style.transform = "scale(" + (list[i].scale + (move * 0.005)) + ")";
                    list[i].style.zIndex = list[i].zIndex + 1;
                    if (_this.data.indexArr[i] >= -3) {
                        list[i].style.opacity = 1; //把最左边的牌显示
                    }
                } else {
                    //右边的牌,包括中间的牌
                    list[i].style.transform = "scale(" + (list[i].scale - (move * 0.005)) + ")";
                    list[i].style.zIndex = list[i].zIndex - 1;
                    if (_this.data.indexArr[i] >= 2) {
                        list[i].style.opacity = 0;//把最右边的牌关闭
                    }
                }
            }
            //检查是否，翻了一张牌，向右
            if (list[2].style.left >= list[3].left) {
                //console.log('翻牌了');
                let newArr = [];
                for (let i = 0; i < len; i++) {
                    let index = i; //当前将要变成哪一个坐标元素的位置
                    if (i + 1 != len) {
                        index = i + 1;
                    } else {
                        //最后一个元素到第一个元素的位置
                        index = 0;
                    }
                    let current_option = list[i].option;
                    // console.log('current_option',current_option);
                    // console.log('list[i].option',list[i].option);
                    let item = _this.data.listArr[index];
                    item.option = current_option;
                    newArr[index] = item;
                }
                // console.log('old', list);
                // console.log('new', newArr);
                list = newArr;
                _this.setData({
                    startPageX: pageX
                });
            }
            _this.setData({
                list
            })

        } else { //向左滑
            for (let i = 0; i < len; i++) {
                list[i].style.left = list[i].left + ((move) * 0.52);
                if (_this.data.indexArr[i] <= 0) {
                    //左边的牌,包括中间的牌
                    list[i].style.transform = "scale(" + (list[i].scale - Math.abs(move * 0.005)) + ")";
                    list[i].style.zIndex = list[i].zIndex - 1;
                    if (_this.data.indexArr[i] <= -2) {
                        list[i].style.opacity = 0; //把最左边的牌消失
                    }

                } else {
                    //右边的牌,不包括中间的牌
                    list[i].style.transform = "scale(" + (list[i].scale + Math.abs(move * 0.005)) + ")";
                    list[i].style.zIndex = list[i].zIndex + 1;
                    if (_this.data.indexArr[i] >= 2) {
                        list[i].style.opacity = 1; //把最右边的牌显示
                    }
                }
            }

            //检查是否，翻了一张牌，向左
            if (list[3].style.left <= list[2].left) {

                //console.log('翻牌了');
                let newArr = [];
                for (let i = 0; i < len; i++) {
                    let index = i; //当前将要变成哪一个坐标元素的位置
                    if (i == 0) {
                        index = len - 1;
                    } else {
                        //最后一个元素到第一个元素的位置
                        index = i - 1;
                    }

                    let current_option = list[i].option;
                    // console.log('current_option',current_option);
                    // console.log('list[i].option',list[i].option);
                    let item = _this.data.listArr[index];
                    item.option = current_option;
                    newArr[index] = item;
                }
                // console.log('old', list);
                // console.log('new', newArr);
                list = newArr;
                _this.setData({
                    startPageX: pageX
                });
            }

            _this.setData({
                list
            })

        }
    },
    /*触摸结束*/
    touchend(e) {

        console.log('触摸结束');
        let _this = this;
        let list = JSON.parse(JSON.stringify(_this.data.list));
        let len = list.length;
        _this.setData({
            isTouch: false //关闭触摸
        })
        if (list[2].style.left >= list[3].left||list[3].style.left <= list[2].left) {
            //console.log('翻牌了');
            
        } else {
            //移动的距离不够，不用翻牌
            for (let i = 0; i < len; i++) {
                list[i].style.left = list[i].left;
                list[i].style.zIndex = list[i].zIndex;
                list[i].style.transform = "scale(" + list[i].scale + ")";
                list[i].style.opacity = (3 - Math.abs(_this.data.indexArr[i]) != 0) ? 1 : 0
            }
            _this.setData({
                list
            })
        }
    }
})