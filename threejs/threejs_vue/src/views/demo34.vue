<template>
    <div id="container"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js' //引入轨道控制器
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js' //.gltf或.glb模型加载器
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js' //模型解压缩器




let width = window.innerWidth
let height = window.innerHeight





//创建场景(创建一个三维空间，创建一个三维世界)
const scene = new THREE.Scene()
//修改“场景”的背景色（默认，黑色）
scene.background = new THREE.Color(0x666666) //将“场景”的背景色，从“黑色”设置成“灰色”






//创建一个“环境光”
const light = new THREE.AmbientLight(0xffffff, 1) //0xffffff是光的颜色   1是光的强度
scene.add(light)





//创建一个“点光源”
const pointLight = new THREE.PointLight(0xffffff, 200, 1000) //0xffffff是光的颜色   200是光的强度   1000是光的最远照射距离
pointLight.position.set(-5, 10, 0) //设置光源在“场景”中的位置
pointLight.castShadow = true //让 灯光支持投射 阴影
scene.add(pointLight)





let wheelArr = []




//加载模型
const dracoLoader = new DRACOLoader() //创建解压缩器
dracoLoader.setDecoderPath('threejs_img/jsm/libs/draco/gltf/') //设置解压缩工具的地址（目录下的.wasm和.js文件就是解压缩工具）

const loader = new GLTFLoader()
loader.setDRACOLoader(dracoLoader)
let model_path = new URL('../assets/ferrari.glb', import.meta.url).href
loader.load(model_path, function (glb) {
    console.log('glb', glb)

    scene.add(glb.scene) //将加载好的“模型”添加到“场景”中
    glb.scene.rotation.y = 180 * (Math.PI / 180)

    //遍历所有子模型
    glb.scene.traverse(function (child) {
        if (/^wheel_[a-z]{1,}/i.test(child.name)) {
            //车轱辘
            wheelArr.push(child)

            getRotateAngle(child)
        }
    })
})





let torusArr = [] //圆环列表
for (let i = 0; i < 10; i++) {
    //创建圆环
    let radius = 6 //环面的半径，从环面的中心到管道横截面的中心
    let tube = 0.1 //管道的半径
    let radialSegments = 12 //管道横截面的分段数
    let tubularSegments = 48 //管道的分段数
    let arc = 180 * (Math.PI / 180) //圆环的圆心角(弧度值)
    const geometry = new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments, arc)
    const material = new THREE.MeshBasicMaterial({ color: i % 2 == 0 ? 0xff3276 : 0x318bff })
    const torus = new THREE.Mesh(geometry, material)
    torus.position.z = 40 - (i * 10)
    torus.receiveShadow = true //（制造影子）让 物体能接收 阴影
    torus.castShadow = true //（制造影子）让 物体能投射 阴影
    scene.add(torus)
    torusArr.push(torus)
}





let groundArr = [] //地面列表
let groundTexture = new THREE.TextureLoader().load('threejs_img/ground.png')
for (let i = 0; i < 6; i++) {
    //创建一个地面(平面几何体)
    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),
        new THREE.MeshStandardMaterial({ map: groundTexture })
    )
    ground.rotation.x = -90 * (Math.PI / 180); //让“平面”以x轴为基准，旋转-90deg。默认平面是竖着放的，所以这里才这样操作。
    ground.receiveShadow = true //（制造影子）让 物体能接收 阴影
    ground.castShadow = true //（制造影子）让 物体能投射 阴影
    ground.position.z = 50 - (i * 20)
    scene.add(ground)
    groundArr.push(ground)
}





// //创建一个“xyz坐标轴参考辅助线”（默认情况下，红线代表X轴，绿线代表Y轴，蓝线代表Z轴）
// const axesHelper = new THREE.AxesHelper(100)
// scene.add(axesHelper) //将“xyz坐标轴参考辅助线”添加到“场景”里





//创建相机(通过相机，观察(看)上边三维空间里的某个物体)
//PerspectiveCamera透视相机
let fov = 30 //相机垂直视角角度
let aspect = width / height //相机视锥体的长宽比，通常是使用 画布的宽/画布的高
let near = 1 //相机可视范围最小值
let far = 30000 //相机可视范围最大值(相机最远能看多远)
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
//改变相机位置
camera.position.z = 20 //这里为啥调整z轴位置，请看图片“three里xyz轴.png”
camera.position.y = 10 //为了 能看出 立方体 是立体的，这里稍微抬高了一下相机的位置





//创建一个渲染器
const renderer = new THREE.WebGLRenderer({
    antialias: true //抗锯齿
})
onMounted(async () => {
    document.getElementById('container').appendChild(renderer.domElement) //将渲染器添加到html页面上
})
//设置渲染器窗口大小(设置canvas大小)
renderer.setSize(width, height)
//设置渲染器的像素比。避免绘图模糊
renderer.setPixelRatio(window.devicePixelRatio)
renderer.shadowMap.enabled = true //（制造影子）设置 渲染器 让渲染器支持渲染阴影
//通过“渲染器”  将  场景(三维空间)里  被相机所观察到的 画面，  画出来
renderer.render(scene, camera)






//创建轨道控制器，通过“轨道控制器”控制相机围绕目标进行轨道运动
//添加“轨道控制器”后，鼠标在页面上进行移动滑动操作，能让相机 围绕目标，根据鼠标操作，来动态切换相机视角
const controls = new OrbitControls(camera, renderer.domElement)
//给“轨道控制器”添加效果1
controls.enableDamping = false //为“轨道控制器”开启，惯性阻尼(减速)效果。当鼠标 移动完 松开鼠标后，“轨道控制器”控制的相机视角，会有一个惯性阻尼(减速)效果。
controls.dampingFactor = 0.05 //设置阻尼系数，默认0.05    不是必须设置






let moveDistance = 0.001 //每次移动多少距离
let rotateRadian = 0 //每次旋转多少角度(弧度值)

//根据每次的移动距离，获取车轱辘每次应旋转多少角度
function getRotateAngle(child) {
    const box3 = new THREE.Box3()
    box3.setFromObject(child)
    const size = new THREE.Vector3()
    box3.getSize(size)
    let wheelRadius = size.y / 2 //车轱辘半径

    let rotateAngle = moveDistance / ((2 * Math.PI) * wheelRadius) * 360 //每次旋转多少角度(角度值)
    rotateRadian = rotateAngle * (Math.PI / 180) //角度转弧度
    /*
    （圆周长公式（C=2*π*r）r是圆半径，C是圆周长）
    （弧长公式（L=θ/360*C）L是弧长，θ是圆心角(角度值)，C是圆周长）

    （问，圆半径是10cm，我想知道(弧长)为2cm时的圆心角是多少度？）
    （根据题目，我们知道r=10cm，L=2cm，我们可以先求出整圆的周长C，然后再用L和C，求θ）

    2*π*10=62.83 //整圆的周长

    将L=2，C=62.83代入弧长公式中

    度数/360*62.83 = 2
    度数/360 = 2/62.83
    度数 = 2/62.83*360
    度数 = 11.45949387235397
    */
}






//实时绘制，相机所看到的画面
function animation() {

    //让车轮转起来
    for (let item of wheelArr) {
        item.rotation.x -= rotateRadian
    }

    //让圆环往后移动
    for (let item of torusArr) {
        item.position.z -= moveDistance
        if (item.position.z <= -50) {
            item.position.z = 50
        }
    }

    //让地面往后移动
    for (let item of groundArr) {
        item.position.z -= moveDistance
        if (item.position.z <= -50) {
            item.position.z = 50
        }
    }




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