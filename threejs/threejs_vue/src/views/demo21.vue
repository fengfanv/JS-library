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
dq.rotation.y = 149.5 * (Math.PI / 180)
scene.add(dq)













/**
*经纬度 转 3D空间坐标
*lon:经度
*lat:纬度
*radius:球体半径
*/
//注意，这个方法仅供在threejs里使用
//经纬度转3D空间坐标。涉及xyz坐标轴方向(视角)问题。由于坐标轴方向(视角)不一样，地球的经纬度 和 threejs里球体的经纬度 并不对应。
//threejs里，z轴是前后，x是左右，y是上下，
//其它软件里，z是上下
//注意2，如果不听劝阻，将此方法用于其它软件里，则会出现 “纬度变 经度不变 的问题(经纬度 与 对应的xyz轴混淆 问题)”
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


// //北京经纬度
// let lon = 116.39724214611238  //经度
// let lat = 39.908267064866955  //纬度

// //乌鲁木齐
// let lon = 87.4061103  //经度
// let lat = 43.4695655  //纬度

//纽约
let lon = -73.754968  //经度
let lat = 42.6511674  //纬度


const { x, y, z } = lglt2xyz(lon, lat, radius)

//小球
const xq_geometry = new THREE.SphereGeometry(0.1)
const xq_material = new THREE.MeshBasicMaterial({
    color: 0x000000
})
const xq = new THREE.Mesh(xq_geometry, xq_material)
xq.position.set(x, y, z)
scene.add(xq)







// //创建一个柱子
// const zhuzi = new THREE.Mesh(
//     new THREE.BoxGeometry(0.5, 0.5, 200),
//     new THREE.MeshBasicMaterial({ color: 0xFF0000 })
// )
// const zhuziGroup = new THREE.Group()
// zhuziGroup.add(zhuzi)
// scene.add(zhuziGroup)



// //三角函数 cosθ=邻/斜    邻=cosθ*斜    斜=邻/cosθ

// //斜边=radius   邻边=a^2+b^2=c^2

// let value = Math.abs(Math.sqrt((x * x) + (z * z)))

// let cosθ = value / radius

// let rad = Math.acos(cosθ) //反三角函数     Math.acos(cosθ)此方法需传入cos值，然后此方法返回(弧度值)

// let deg = rad * (180 / Math.PI) //弧度转角度

// console.log(value, radius, cosθ, rad, deg)

// zhuzi.rotation.x = rad

// // zhuziGroup.rotation.y = -124 * (Math.PI / 180) //角度转弧度









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