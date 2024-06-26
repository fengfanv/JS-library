<template>
    <div id="container"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js' //引入轨道控制器
import * as TWEEN from '@tweenjs/tween.js' //npm install @tweenjs/tween.js





let width = window.innerWidth
let height = window.innerHeight





//创建场景(创建一个三维空间，创建一个三维世界)
const scene = new THREE.Scene()
//修改“场景”的背景色（默认，黑色）
scene.background = new THREE.Color(0x666666) //将“场景”的背景色，从“黑色”设置成“灰色”





//创建一个网格地面
const gridHelper = new THREE.GridHelper(20, 20)
scene.add(gridHelper)





//创建一个“xyz坐标轴参考辅助线”（默认情况下，红线代表X轴，绿线代表Y轴，蓝线代表Z轴）
const axesHelper = new THREE.AxesHelper(100)
scene.add(axesHelper) //将“xyz坐标轴参考辅助线”添加到“场景”里





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
    antialias: true, //抗锯齿
})
onMounted(async () => {
    document.getElementById('container').appendChild(renderer.domElement) //将渲染器添加到html页面上
})
//设置渲染器窗口大小(设置canvas大小)
renderer.setSize(width, height)
//设置渲染器的像素比。避免绘图模糊
renderer.setPixelRatio(window.devicePixelRatio)
//通过“渲染器”  将  场景(三维空间)里  被相机所观察到的 画面，  画出来
renderer.render(scene, camera)





//创建轨道控制器，通过“轨道控制器”控制相机围绕目标进行轨道运动
//添加“轨道控制器”后，鼠标在页面上进行移动滑动操作，能让相机 围绕目标，根据鼠标操作，来动态切换相机视角
const controls = new OrbitControls(camera, renderer.domElement)
//给“轨道控制器”添加效果1
controls.enableDamping = false //为“轨道控制器”开启，惯性阻尼(减速)效果。当鼠标 移动完 松开鼠标后，“轨道控制器”控制的相机视角，会有一个惯性阻尼(减速)效果。
controls.dampingFactor = 0.05 //设置阻尼系数，默认0.05    不是必须设置





//节点
let nodes = [
    new THREE.Vector3(5, 1, 5),
    new THREE.Vector3(-5, 1, 5),
    new THREE.Vector3(-5, 1, -5),
    new THREE.Vector3(5, 1, -5)
]





//在每个节点处，创建立方体
let cubeList = []
for (let i = 0; i < nodes.length; i++) {
    const cube = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1) //宽度，高度，深度
    )
    scene.add(cube)

    cube.name = i
    cube.position.copy(nodes[i])
    cubeList.push(cube)
}





//根据节点生成一条曲线路径
let curve = new THREE.CatmullRomCurve3(nodes)
curve.closed = true //曲线是否闭合

const points = curve.getPoints(50) //将曲线划分为(多少个)分段（从曲线中获取50个点以创建平滑的线条）
const line = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({ color: 0xffffff })
)
scene.add(line)





renderer.domElement.addEventListener('click', (event) => {
    //获取点击位置
    const mouse = new THREE.Vector2()
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1 //这里负号是因为WebGL的y轴是向下的

    //立方体点击检测
    const rayCaster = new THREE.Raycaster()
    rayCaster.setFromCamera(mouse, camera)
    const intersects = rayCaster.intersectObjects(cubeList)

    if (intersects.length) {
        const target = intersects[0].object

        console.log(target)

        //获取3D对象的表面 在Y轴上的最大值（对象的表面 在Y轴方向上的最高点）
        let boxMaxY = new THREE.Box3().setFromObject(target).max.y

        //设定相机新位置
        let newPosition = {
            x: target.position.x,
            y: target.position.y + boxMaxY,
            z: target.position.z + 5
        }

        //使用TWEEN库来平滑地移动相机
        let tween = new TWEEN.Tween(camera.position).to(newPosition, 3000) //相机在3秒内移动到新位置
        let tween1 = new TWEEN.Tween(controls.target).to(target.position, 3000) //轨道控制器所环绕的目标点，在3秒内，变成新目标点

        controls.enabled = false //相机位置在移动过程中，关闭轨道控制器
        tween.onComplete(function () {
            controls.enabled = true //相机位置移动完成后，重启轨道控制器
        })

        //开始动画(开始移动)
        tween.start()
        tween1.start()
    }
}, false)





//实时绘制，相机所看到的画面
function animation() {

    TWEEN.update()



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