<template>
    <div id="container"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js' //引入轨道控制器

import { FontLoader } from 'three/addons/loaders/FontLoader.js' //引入json字体加载器
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js' //文本缓冲几何体。需要单独引入




//创建场景(创建一个三维空间，创建一个三维世界)
const scene = new THREE.Scene()
//修改“场景”的背景色（默认，黑色）
scene.background = new THREE.Color(0x666666) //将“场景”的背景色，从“黑色”设置成“灰色”




//参考文档
//https://threejs.org/docs/#examples/zh/loaders/FontLoader
//https://threejs.org/docs/#examples/zh/geometries/TextGeometry
//https://juejin.cn/post/7104817223444725774

//普通字体文件(转)json字体文件
//https://gero3.github.io/facetype.js/




//json字体文件路径
const fontPath = new URL('../assets/Alimama_DaoLiTi_Regular.json', import.meta.url).href




//创建json字体加载器
const loader = new FontLoader()
//加载json字体
loader.load(fontPath, function (font) {
    // console.log(font)

    //创建文字几何体
    const textGeometry = new TextGeometry('王哥你好啊', {
        font: font,
        size: 1, //文字大小
        depth: 0.5, //文本厚度
        // curveSegments: 12, //(文本)曲线上“点”的数量
        // bevelEnabled: true, //是否开启斜角
        // bevelThickness: 20, //文本上斜角的深度
        // bevelSize: 8, //斜角与原始文本轮廓之间的延伸距离
        // bevelSegments: 3 //斜角的分段数
    })
    //创建文字的材质(皮肤)
    const material = new THREE.MeshBasicMaterial({
        wireframe: false,
        color: 0x550000
    })
    //通过网格，将“文字几何体”和“材质”拼接在一起，然后添加到场景中
    const text = new THREE.Mesh(textGeometry, material)
    scene.add(text)


    //默认添加到场景里的“文字”位置是不居中的，调用如下代码，让文字居中
    //方式1：
    // textGeometry.center()
    //方式2：
    textGeometry.computeBoundingBox() //使用computeBoundingBox获取“文字几何体”的尺寸
    if (textGeometry.boundingBox) {
        textGeometry.translate(
            -textGeometry.boundingBox.max.x * 0.5, // Subtract bevel size
            -textGeometry.boundingBox.max.y * 0.5, // Subtract bevel size
            -textGeometry.boundingBox.max.z * 0.5, // Subtract bevel thickness
        )
    }
    
})




//创建相机(通过相机，观察(看)上边三维空间里的某个物体)
//PerspectiveCamera透视相机
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight)
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





//监听窗口变化，更新渲染画面
window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight //重新设置相机视锥体的长宽比，默认值是1
    camera.updateProjectionMatrix() //更新相机投影矩阵，相机参数被改变后必须被调用

    renderer.setSize(window.innerWidth, window.innerHeight) //设置渲染器窗口大小(设置canvas大小)
    renderer.setPixelRatio(window.devicePixelRatio) //设置渲染器的像素比。避免绘图模糊
})
</script>