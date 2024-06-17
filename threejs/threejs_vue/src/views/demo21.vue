<template>
    <div id="container"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js' //引入轨道控制器






let width = window.innerWidth
let height = window.innerHeight






//创建场景(创建一个三维空间，创建一个三维世界)
const scene = new THREE.Scene()
//修改“场景”的背景色（默认，黑色）
scene.background = new THREE.Color(0x666666) //将“场景”的背景色，从“黑色”设置成“灰色”







//创建一个地球
let radius = 50 //半径
let widthSegments = 64 //球体有几个经线（竖线是经线，连接南北极的是经线）
let heightSegments = 32 //球体有几个纬线（横线是纬线）横纬竖经
const dq_geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments)
let dq_image = new URL('../assets/earth_bg_2.png', import.meta.url).href
const dq_material = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load(dq_image),
})
const dq = new THREE.Mesh(dq_geometry, dq_material)
scene.add(dq)
dq.rotation.y = 150.5 * (Math.PI / 180) //让地球自己旋转一下，来对应贴图上的经纬度







/**
* 经纬度转3D空间坐标
* lon 经度
* lat 纬度
* radius 球体半径
*/
//注意，这个方法仅供在threejs里使用
//经纬度转3D空间坐标。涉及xyz坐标轴方向(视角)问题。threejs里，z轴是前后，x是左右，y是上下。其它软件里，z是上下，x是左右，y是前后。
//其它软件里，请自行搜索，相关“经纬度转3D空间坐标”方法
function lglt2xyz(lon, lat, radius) {

    //https://juejin.cn/post/6977125921048231972 民间
    const phi = (180 + lon) * (Math.PI / 180)
    const theta = (90 - lat) * (Math.PI / 180)
    return {
        x: -radius * Math.sin(theta) * Math.cos(phi),
        y: radius * Math.cos(theta),
        z: radius * Math.sin(theta) * Math.sin(phi),
    }

    // //threejs官方
    // const theta = (90 + lon) * (Math.PI / 180)
    // const phi = (90 - lat) * (Math.PI / 180)
    // return (new THREE.Vector3()).setFromSpherical(new THREE.Spherical(radius, phi, theta))
}



//经度 lon 的范围是 [-180, 180]，其中 0 是本初子午线，向东为正，向西为负。
//纬度 lat 的范围是 [-90, 90]，其中 0 是赤道，向北为正，向南为负。



//北京经纬度
let lon = 116.55407278276036  //经度
let lat = 39.89250177349417  //纬度

// //乌鲁木齐
// let lon = 87.6231971294296  //经度
// let lat = 43.83155867874312  //纬度

// //纽约
// let lon = -73.87991253324408  //经度
// let lat = 40.85487031970448  //纬度

// //悉尼
// let lon = 151.205774  //经度
// let lat = -33.885642  //纬度

//将经纬度转成3D空间坐标
const { x, y, z } = lglt2xyz(lon, lat, radius)





//创建一个小球
const xq_size = 2 //小球大小
const xq = new THREE.Mesh(
    new THREE.SphereGeometry(xq_size),
    new THREE.MeshBasicMaterial({
        color: 0x000000
    })
)
scene.add(xq)
xq.position.set(x, y, z) //设置小球位置





//创建一个柱子
const zhuzi = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 200),
    new THREE.MeshBasicMaterial({ color: 0xFF0000 })
)
const zhuziGroup = new THREE.Group()
zhuziGroup.add(zhuzi)
scene.add(zhuziGroup)

//让柱子指向3D空间坐标（让柱子指向小球）
//让柱子上下摆动（纬度变化）（横纬竖经，lat纬度，lon经度）
//参考图片“柱子_上下摆动.png”
function rotationLat() {

    //三角函数 sinθ=对/斜    对=sinθ*斜    斜=对/sinθ

    //对边=y    斜边=radius

    let sinθ = y / radius

    let rad = Math.asin(sinθ) //反三角函数     Math.asin(sinθ)此方法需传入sin值，然后此方法返回(弧度值)

    let deg = rad * (180 / Math.PI) //弧度转角度


    zhuzi.rotation.x = -rad
}
rotationLat()


//让柱子左右摆动（经度变化）（横纬竖经，lat纬度，lon经度）
//参考图片“柱子_左右摆动_1.png”
//参考图片“柱子_左右摆动_2.png”
function rotationLon() {

    //判断坐标在第几象限
    function getQuadrant(x, y) {
        if (x > 0 && y > 0) {
            return 1
        } else if (x < 0 && y > 0) {
            return 2
        } else if (x < 0 && y < 0) {
            return 3
        } else {
            return 4
        }
    }

    //根据坐标象限来获取度数
    function getDeg(x, y) {

        //三角函数 sinθ=对/斜    对=sinθ*斜    斜=对/sinθ

        var quadrant = getQuadrant(x, y)

        var opposite //对边
        if (quadrant == 1) {
            opposite = y
        } else if (quadrant == 2) {
            opposite = y
        } else if (quadrant == 3) {
            opposite = x
        } else {
            opposite = y
        }

        var oblique = Math.abs(Math.sqrt((x * x) + (y * y))) //斜边     a^2+b^2=c^2

        var sinθ = opposite / oblique

        var rad = Math.asin(sinθ)

        var deg = rad * (180 / Math.PI)

        deg = Math.abs(deg)

        if (quadrant == 1) {
            return deg
        } else if (quadrant == 2) {
            return 180 - deg
        } else if (quadrant == 3) {
            return 270 - deg
        } else {
            return 360 - deg
        }
    }


    var deg = getDeg(x, z)
    zhuziGroup.rotation.y = (90 + (-deg)) * (Math.PI / 180) //这里为啥要操作“组”旋转，详细请看“demo10.vue”
}
rotationLon()





//创建相机(通过相机，观察(看)上边三维空间里的某个物体)
//PerspectiveCamera透视相机
let fov = 30 //相机垂直视角角度
let aspect = width / height //相机视锥体的长宽比，通常是使用 画布的宽/画布的高
let near = 1 //相机可视范围最小值
let far = 30000 //相机可视范围最大值(相机最远能看多远)
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
//改变相机位置
camera.position.z = 200 //这里为啥调整z轴位置，请看图片“three里xyz轴.png”
camera.position.y = 30 //为了 能看出 立方体 是立体的，这里稍微抬高了一下相机的位置





//创建一个“xyz坐标轴参考辅助线”（默认情况下，红线代表X轴，绿线代表Y轴，蓝线代表Z轴）
const axesHelper = new THREE.AxesHelper(100)
scene.add(axesHelper) //将“xyz坐标轴参考辅助线”添加到“场景”里





//创建一个渲染器
const renderer = new THREE.WebGLRenderer()
onMounted(async () => {
    document.getElementById('container').appendChild(renderer.domElement) //将渲染器添加到html页面上
})
//设置渲染器窗口大小(设置canvas大小)
renderer.setSize(width, height)
//设置渲染器的像素比。避免绘图模糊
renderer.setPixelRatio(window.devicePixelRatio)





//创建轨道控制器，通过“轨道控制器”控制相机围绕目标进行轨道运动
//添加“轨道控制器”后，鼠标在页面上进行移动滑动操作，能让相机 围绕目标，根据鼠标操作，来动态切换相机视角
const controls = new OrbitControls(camera, renderer.domElement)
//给“轨道控制器”添加效果1
controls.enableDamping = true //为“轨道控制器”开启，惯性阻尼(减速)效果。当鼠标 移动完 松开鼠标后，“轨道控制器”控制的相机视角，会有一个惯性阻尼(减速)效果。
controls.dampingFactor = 0.05 //设置阻尼系数，默认0.05    不是必须设置




//通过“渲染器”  将  场景(三维空间)里  被相机所观察到的 画面，  画出来
renderer.render(scene, camera)




//实时绘制，相机所看到的画面
function animation() {

    controls.update() //当鼠标在页面上移动、滑动操作的时候，实时调用“轨道控制器”的“更新”方法，来刷新(更新)相机视角



    //将相机所观察到的 画面，画到canvas上
    renderer.render(scene, camera)



    requestAnimationFrame(animation)
}
animation()





//监听窗口变化，更新渲染画面
window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight //重新设置相机视锥体的长宽比，默认值是1
    camera.updateProjectionMatrix() //更新相机投影矩阵，相机参数被改变后必须被调用

    renderer.setSize(window.innerWidth, window.innerHeight) //设置渲染器窗口大小(设置canvas大小)
    renderer.setPixelRatio(window.devicePixelRatio) //设置渲染器的像素比。避免绘图模糊
})
</script>