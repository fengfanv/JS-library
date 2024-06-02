<template>
    <div id="container"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js' //引入轨道控制器



//创建场景(创建一个三维空间，创建一个三维世界)
const scene = new THREE.Scene()
//修改“场景”的背景色（默认，黑色）
scene.background = new THREE.Color(0x666666) //将“场景”的背景色，从“黑色”设置成“灰色”



//创建一个平面几何体
const wuTi = new THREE.PlaneGeometry(1, 1) //这俩 1 是 平面的 width 和 hight

//为立方体创建一个材质(外观)(为立方体创建一个皮肤)
const texture = new THREE.TextureLoader().load('threejs_img/px.png') //为平面几何体创建一个图片纹理材质(图片皮肤)
//通过UV坐标，控制显示图片范围（通过UV坐标控制显示贴图范围）
//定义uv像素的取值范围（uv坐标值顺序，左上，右上，左下，右下）如不明白，请配合“UV坐标图.png”来理解
// //--展示整张图片--
// const uv = new Float32Array([
//     0, 1, //uv坐标类似xy坐标
//     1, 1,
//     0, 0,
//     1, 0 // u=1,v=0
// ])
//--只展示图片的左下角--
const uv = new Float32Array([
    0, 0.5, //uv坐标类似xy坐标
    0.5, 0.5,
    0, 0,
    0.5, 0 // u=1,v=0
])
wuTi.attributes.uv = new THREE.BufferAttribute(uv, 2)//这里这个 2 的意思是，每2个值，为一组，来代表uv坐标值范围

const material = new THREE.MeshBasicMaterial({
    //color: 0x00ff00, //立方体颜色（0x开头代表16进制）00ff00 == rgb(0,255,0) == 绿色
    side: THREE.DoubleSide, //默认是单面渲染，单面渲染的问题是，你从它正面看它时，你能看到它，但当你从它背后看它时，你看不到它。这也就是为什么，之前相机被包裹在立方体中时，相机什么都看不到的问题的原因。THREE.DoubleSide开启双面渲染，正面，反面都渲染。
    //wireframe: true //让 物体 以线框的形式 显示出来
    map: texture
})
//创建网格（想把“立方体”放进“场景”里，需要通过“网格”来操作）（可以通过“网格”，控制“立方体”在“场景”中的相对位置）
//利用网格，将 几何体 和 材质 拼接在一起，然后添加到场景中
const cube = new THREE.Mesh(wuTi, material)
scene.add(cube) //将“物体”添加到“场景”里



//创建相机(通过相机，观察(看)上边三维空间里的某个物体)
//PerspectiveCamera透视相机
const camera = new THREE.PerspectiveCamera()
//默认情况下    相机在场景中的位置是（x0,y0,z0）    立方体中心点位置也是（x0,y0,z0）   这样就导致 相机 被包裹在 立方体中 ，导致相机看不到立方体，所以这里为了能够观察到 场景里的立方体，这里调整了 相机位置
//改变相机位置
camera.position.z = 10 //这里为啥调整z轴位置，请看图片“three里xyz轴.png”
camera.position.y = 3 //为了 能看出 立方体 是立体的，这里稍微抬高了一下相机的位置



//创建一个“xyz坐标轴参考辅助线”（默认情况下，红线代表X轴，绿线代表Y轴，蓝线代表Z轴）
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper) //将“xyz坐标轴参考辅助线”添加到“场景”里



//创建一个渲染器
const renderer = new THREE.WebGLRenderer()
onMounted(() => {
    document.getElementById('container').appendChild(renderer.domElement) //将渲染器添加到html页面上
})
//设置渲染器窗口大小(设置canvas大小)
renderer.setSize(window.innerWidth, window.innerHeight)



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

    //将相机所观察到的 画面，画到canvas上
    renderer.render(scene, camera)
}
animation()
</script>