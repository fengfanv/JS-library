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






//生成一条曲线路径
let curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(20, 2, 0),
    new THREE.Vector3(10, 1, 10),
    new THREE.Vector3(0, 1, 10)
])
curve.closed = true //曲线是否闭合



const points = curve.getPoints(50) //将曲线划分为(多少个)分段（从曲线中获取50个点以创建平滑的线条）
const line = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({ color: 0xffffff })
)
scene.add(line)



//创建一个小车
const xiaoche = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.3, 2), //宽度，高度，深度
    new THREE.MeshBasicMaterial({ color: 0xffffff })
)
scene.add(xiaoche)



//根据给定进度更新小车的位置和朝向
function move(currentProcess) {
    //获取曲线在给定进度下的位置
    const position = curve.getPointAt(currentProcess)
    //将小车的位置设置为该位置
    xiaoche.position.copy(position)


    //修改小车朝向（方式1）
    //获取曲线在给定进度下的切线向量（获取曲线在当前位置的切线(方向)）（什么是切线？请看“Ai-Test/Deep-learning/导数”）
    const tangent = curve.getTangentAt(currentProcess)
    //根据(切线方向)和(当前位置)计算一个朝向点
    const lookAtVec = tangent.add(position)
    //使小车面向切线方向(朝向点)
    xiaoche.lookAt(lookAtVec)


    // //修改小车朝向（方式2）
    // const tangent = curve.getTangentAt(currentProcess).normalize(); //标准化切线向量
    // const offset = new THREE.Vector3(0, 0, 1); //假设小车默认面向Z轴正方向，(0,0,1)，(x,y,z)
    // const axis = new THREE.Vector3().crossVectors(offset, tangent).normalize(); //计算旋转轴
    // const angle = Math.acos(offset.dot(tangent)); //计算旋转角度
    // xiaoche.quaternion.setFromAxisAngle(axis, angle); //使用四元数设置小车的旋转
}
// move(0.5)





//画曲线上的切线
function drawTangent() {
    let currentProcess = 0 //0-1
    while (currentProcess <= 1) {

        //获取曲线在给定进度下的位置
        const startPosition = curve.getPointAt(currentProcess)

        //获取曲线在给定进度下的切线向量（获取曲线在当前位置的切线(方向)）（什么是切线？请看“Ai-Test/Deep-learning/导数”）
        const tangent = curve.getTangentAt(currentProcess)
        const endPosition = tangent.add(startPosition)

        const line = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints([startPosition, endPosition])
        )
        scene.add(line)

        currentProcess += 0.01
    }
}
drawTangent()





//让相机视角变成小车的第一人称视角（从第三人称视角变成第一人称视角）
function firstPerson(currentProcess) {
    //获取曲线在给定进度下的位置
    const position = curve.getPointAt(currentProcess)
    position.y += 0.5 //抬高相机位置，以获得更好的视觉效果（以获得类似驾车时的感觉）
    //将相机的位置设置为该位置
    camera.position.copy(position)


    //修改相机朝向
    //获取曲线在给定进度下的切线向量（获取曲线在当前位置的切线(方向)）（什么是切线？请看“Ai-Test/Deep-learning/导数”）
    const tangent = curve.getTangentAt(currentProcess)
    //根据(切线方向)和(当前位置)计算一个朝向点
    const lookAtVec = tangent.add(position)
    //使相机面向切线方向(朝向点)
    // camera.lookAt(lookAtVec)
    controls.target = lookAtVec //有“轨道控制器”时，需要使用该代码，来修改相机视角
}





const zhuzi1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1) //宽度，高度，深度
)
scene.add(zhuzi1)
zhuzi1.position.copy(curve.getPointAt(0.3))




const zhuzi2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1) //宽度，高度，深度
)
scene.add(zhuzi2)
zhuzi2.position.copy(curve.getPointAt(0.65))





//创建一个网格地面
const gridHelper = new THREE.GridHelper(50, 50)
scene.add(gridHelper)





//创建相机(通过相机，观察(看)上边三维空间里的某个物体)
//PerspectiveCamera透视相机
let fov = 30 //相机垂直视角角度
let aspect = width / height //相机视锥体的长宽比，通常是使用 画布的宽/画布的高
let near = 1 //相机可视范围最小值
let far = 30000 //相机可视范围最大值(相机最远能看多远)
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
//改变相机位置
camera.position.z = 50 //这里为啥调整z轴位置，请看图片“three里xyz轴.png”
camera.position.y = 10 //为了 能看出 立方体 是立体的，这里稍微抬高了一下相机的位置





//创建一个“xyz坐标轴参考辅助线”（默认情况下，红线代表X轴，绿线代表Y轴，蓝线代表Z轴）
const axesHelper = new THREE.AxesHelper(100)
scene.add(axesHelper) //将“xyz坐标轴参考辅助线”添加到“场景”里





//创建一个渲染器
const renderer = new THREE.WebGLRenderer({
    antialias: true, //抗锯齿
})
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





const loopTime = 10 * 1000 //循环一圈的时间





//实时绘制，相机所看到的画面
function animation() {



    let time = Date.now()
    let t = (time % loopTime) / loopTime //计算当前时间进度百分比（(120%10)/10=0、(121%10)/10=0.1、(122%10)/10=0.2、(123%10)/10=0.3、(141%10)/10=0.1）
    move(t)
    // firstPerson(t)


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