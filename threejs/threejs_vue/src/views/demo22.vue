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
    new THREE.BoxGeometry(0.5, 0.5, 10),
    new THREE.MeshBasicMaterial({ color: 0xFF0000 })
)
scene.add(zhuzi)
zhuzi.position.set(x, y, z) //设置柱子位置



//什么是法线？法线是一个垂直于某平面或曲面的向量。
//计算柱子在球面上的法线方向（即球心到柱子坐标的方向向量） 
var coordVec3 = new THREE.Vector3(x, y, z).normalize() //归一化得到单位向量

//柱子默认在XOY平面上，其法线方向是沿着Z轴的
//“柱子默认在XOY平面上”的意思是，柱子在没有旋转或其他变换的情况下，柱子的底部是放置在三维坐标系的XOY平面上的。
//“其法线方向是沿着Z轴的”的意思是，柱子的法线方向是Z轴，柱子是垂直于XOY平面的。
var zhuziNormal = new THREE.Vector3(0, 0, 1) //柱子默认法线方向（注意这里法线方向，(0, 0, 1)，(x,y,z)）

//使用setFromUnitVectors方法计算从默认法线方向到球面法线方向所需的旋转四元数  
//并将此四元数应用到柱子的quaternion属性上，使其旋转到正确的方向
zhuzi.quaternion.setFromUnitVectors(zhuziNormal, coordVec3)






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