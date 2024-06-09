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



//创建灯光
//没有光源的光。一般指环境光。环境光，你不知道光是从哪里发出的，你的前面，后面，左面，右面，上面，下面，一样亮。被环境光照到的物体，没有影子，因为环境光没有方向，周围一样亮。环境光会均匀的照亮场景中的所有物体。环境光，来自各个方向的光照。不需要设置光源位置
//有光源的光。你知道光是从哪里发出的，被其 照到 的物体 有影子。其照射的光有方向。（平行光，点光源，聚光灯等等）需要在场景中给光源设置一个位置
//创建一个“环境光”
const light = new THREE.AmbientLight(0xffffff, 1) //0xffffff是光的颜色   1是光的强度
scene.add(light)
//创建一个“点光源”
const pointLight = new THREE.PointLight(0xffffff, 100, 200) //0xffffff是光的颜色   100是光的强度   200是光的最远照射距离
pointLight.position.set(5, 3, 5) //设置光源在“场景”中的位置
pointLight.castShadow = true //1、让 灯光支持投射 阴影
scene.add(pointLight)



//创建一个立方体
const wuTi = new THREE.BoxGeometry()
//为立方体创建一个材质(外观)(为立方体创建一个皮肤)
//MeshPhongMaterial(光反射材质，需要“场景”内有“灯光”。否则你看不到“你为立方体所设置的颜色”，没有灯光照到立方体时，立方体是黑的)
//MeshBasicMaterial(基础材质，不需要场景内有灯光，你就能直接看到立方体的颜色)
const material = new THREE.MeshPhongMaterial({
    color: 0x00ff00, //立方体颜色（0x开头代表16进制）00ff00 == rgb(0,255,0) == 绿色
    shininess: 1000 //光 照到 立方体表面时，立方体表面反光的强度，默认30
})
//创建网格（想把“立方体”放进“场景”里，需要通过“网格”来操作）（可以通过“网格”，控制“立方体”在“场景”中的相对位置）
//利用网格，将 几何体 和 材质 拼接在一起，然后添加到场景中
const cube = new THREE.Mesh(wuTi, material)
cube.position.set(0, 0.5, 0) //x,y,z  “物体”以y轴，向上移动0.5个身位
//光 照在 物体上，为了让“物体”能在“地面上”投射出 物体的影子，需要进行如下操作：
//1、让 灯光支持投射 阴影(pointLight.castShadow = true)
//2、让 物体能投射 阴影(cube.castShadow = true)
//3、让 地面 接收 阴影(meshFloor.receiveShadow = true)
//4、设置 渲染器 让渲染器支持渲染阴影(renderer.shadowMap.enabled = true)
cube.castShadow = true //2、让 物体能投射 阴影
scene.add(cube) //将“物体”添加到“场景”里




//利用“平面几何体”，创建一个地面
const meshFloor = new THREE.Mesh(
    //创建一个10*10的平面
    new THREE.PlaneGeometry(10, 10),
    //为平面添加一个材质/皮肤（这里添加的是 光反射材质）
    new THREE.MeshPhongMaterial({
        color: 0xc2926c, //地面颜色
    })
)
meshFloor.rotation.x = -90 * (Math.PI / 180); //让“平面”以x轴为基准，旋转-90deg。默认平面是竖着放的，所以这里才这样操作。
meshFloor.receiveShadow = true //3、让 地面 接收 阴影
scene.add(meshFloor)




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
renderer.shadowMap.enabled = true //4、设置 渲染器 让渲染器支持渲染阴影



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