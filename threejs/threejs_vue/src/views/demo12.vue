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




//创建一个太阳
const sun = new THREE.Mesh(
    new THREE.SphereGeometry(0.5), //创建一个球体，0.5是圆半径
    new THREE.MeshBasicMaterial({
        color: 0xfff100
    })
)
scene.add(sun)

//创建一个地球
const earth = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),//立方体
    new THREE.MeshBasicMaterial({
        color: 0x00456b
    })
)

//创建一个月球
const moon = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),//立方体
    new THREE.MeshBasicMaterial({
        color: 0x837d7d
    })
)
moon.position.x = 1

const moonPivot = new THREE.Object3D()
moonPivot.position.set(0, 0, 0)
moonPivot.add(moon)



const emGroup = new THREE.Group()
emGroup.add(earth)
emGroup.add(moonPivot)
emGroup.position.x = 2


const emGroupPivot = new THREE.Object3D()
emGroupPivot.position.set(0, 0, 0)
emGroupPivot.add(emGroup)
scene.add(emGroupPivot)





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

    moonPivot.rotation.y += 0.01 //让月球环绕地球转

    // emGroup.rotation.y += 0.01

    emGroupPivot.rotation.y += 0.01 //让地球环绕太阳转

    //将相机所观察到的 画面，画到canvas上
    renderer.render(scene, camera)
}
animation()
</script>