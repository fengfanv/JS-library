<template>
    <div id="container"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js' //引入轨道控制器




let width = window.innerWidth
let height = window.innerHeight
let depth = 1400




//创建场景(创建一个三维空间，创建一个三维世界)
const scene = new THREE.Scene()
//添加雾效果
scene.fog = new THREE.Fog(0x000000, 0, 10000)




//创建一个立方体
const liFangTi = new THREE.BoxGeometry(width, height, depth)
//创建一个材质(外观)(为立方体创建一个皮肤)
let liFangTi_image = new URL('../assets/sky.png', import.meta.url).href
const liFangTi_material = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load(liFangTi_image),
    side: THREE.BackSide, //THREE.FrontSide前面渲染 THREE.BackSide背面渲染 THREE.DoubleSide双面渲染
})
//利用网格，将 几何体 和 材质 拼接在一起，然后添加到场景中
const liFangTi_cube = new THREE.Mesh(liFangTi, liFangTi_material)
scene.add(liFangTi_cube) //将“物体”添加到“场景”里






//创建一个球体
let radius = 50 //半径
let widthSegments = 64 //几个经线（竖线是经线，连接南北极的是经线）
let heightSegments = 32 //几个纬线（横线是纬线）横纬竖经
const qiuTi = new THREE.SphereGeometry(radius, widthSegments, heightSegments)
//为 几何体 创建一个材质(外观)(为 几何体 创建一个皮肤)
let qiuTi_image = new URL('../assets/earth_bg.png', import.meta.url).href
//注意，这里球体的皮肤，是高光反射材质。所以，需要灯光，才能看见球体的皮肤
const qiuTi_material = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load(qiuTi_image), //为球体，添加一个，图片皮肤
    shininess: 400
})
//利用网格，将 几何体 和 材质 拼接在一起
const qiuTi_cube = new THREE.Mesh(qiuTi, qiuTi_material)





//为球体，创建灯光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4) //环境光 0xffffff是光的颜色 0.4是光的强度
const pointLight = new THREE.PointLight(0xffffff, 10000000) //点光源
pointLight.position.set(1000, 0, 0) //修改 点光源 位置






//创建一个分组，将球体和灯光整合在一起
const group = new THREE.Group()
group.add(qiuTi_cube)
group.add(ambientLight)
group.add(pointLight)
scene.add(group) //将“分组”添加到“场景”里
//根据 立方体大小 动态设置组的位置
let group_x = -(width / 2) * (40 / 100)
let group_y = (height / 2) * (40 / 100)
let group_z = -(depth / 2) * (50 / 100)
group.position.set(group_x, group_y, group_z) //修改 分组 在 场景 中的位置






//创建相机(通过相机，观察(看)上边三维空间里的某个物体)
//PerspectiveCamera透视相机
let fov = 30 //相机垂直视角角度
let aspect = width / height //相机视锥体的长宽比，通常是使用 画布的宽/画布的高
let near = 1 //相机可视范围最小值
let far = 30000 //相机可视范围最大值(相机最远能看多远)
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
camera.lookAt(0, 0, 0) //让相机看向某个"点"
//计算 相机与立方体(立方体中心(0,0,0)) 二者之间的最佳距离
//三角函数 tanθ=对边/邻边    邻边=对边/tanθ    对边=tanθ*邻边    对边=height/2    邻边=z=?    tan15°=Math.tan(15*Math.PI/180)
let bestDistance = (height / 2) / Math.tan((fov / 2) * Math.PI / 180)
camera.position.z = bestDistance - (depth / 2) //这里 减(depth/2) 是因为，所计算的位置 是根据立方体中心(0,0,0)计算的（脑海中的三角函数图形的"对边"是(0,0,0)的y轴那条线）。所以为了获得最佳效果，这里 减了(depth/2)






//创建一个“xyz坐标轴参考辅助线”（默认情况下，红线代表X轴，绿线代表Y轴，蓝线代表Z轴）
const axesHelper = new THREE.AxesHelper(100) //100是size大小
scene.add(axesHelper) //将“xyz坐标轴参考辅助线”添加到“场景”里




//创建一个渲染器
const renderer = new THREE.WebGLRenderer()
onMounted(() => {
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
    requestAnimationFrame(animation)

    controls.update() //当鼠标在页面上移动、滑动操作的时候，实时调用“轨道控制器”的“更新”方法，来刷新(更新)相机视角


    qiuTi_cube.rotateY(0.01) //让球体自转。等效qiuTi_cube.rotation.y += 0.01



    //将相机所观察到的 画面，画到canvas上
    renderer.render(scene, camera)
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