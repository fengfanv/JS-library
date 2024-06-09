<template>
    <div id="container">
        <button @click="moveCube()">移动立方体</button>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js' //引入轨道控制器
import dat from 'dat.gui'



//创建场景(创建一个三维空间，创建一个三维世界)
const scene = new THREE.Scene()
//修改“场景”的背景色（默认，黑色）
//scene.background = new THREE.Color(0x666666) //将“场景”的背景色，从“黑色”设置成“灰色”
//scene.background = new THREE.Color(0xffffff) //将“场景”的背景色，从“黑色”设置成“白色”
//为“场景”设置背景图片（setPath('/') 设置 图片 的根路径）（图片顺序，pos-x, neg-x, pos-y, neg-y, pos-z, neg-z）
scene.background = new THREE.CubeTextureLoader().setPath('/').load(['threejs_img/px.png', 'threejs_img/nx.png', 'threejs_img/py.png', 'threejs_img/ny.png', 'threejs_img/pz.png', 'threejs_img/nz.png'])


//为“场景(三维空间)”添加一个“雾”效果
//0xff0000是雾的颜色
//10的意思是(当 相机 与 场景中某物 两者之间距离小于10时，相机 所看到的 某物 的画面 不会被雾所影响)   场景内，相机与某物之间距离小于10时，相机 所看到的 某物 不会被雾所影响
//15的意思是(当 相机 与 场景中某物 两者之间距离大于15时，相机 所看到的 某物 的画面 会被雾所影响)   场景内，相机与某物之间距离大于15时，相机 所看到的 某物 会被雾所影响
scene.fog = new THREE.Fog(0xff0000, 10, 15)



//创建一个立方体
const liFangTi = new THREE.BoxGeometry()
//为立方体创建一个材质(为立方体创建一个皮肤)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }) //0x00ff00    0x开头代表16进制    00ff00 = rgb(0,255,0) = 绿色
//创建网格（想把“立方体”放进“场景”里，需要通过“网格”来操作）（可以通过“网格”，控制“立方体”在“场景”中的相对位置）
const cube = new THREE.Mesh(liFangTi, material)
//通过立方体的网格，重新设置 立方体 在 “场景” 中的位置
cube.position.set(0, 1, 0) //x,y,z   立方体的位置，是以立方体的中心点为基准，而不是以立方体的左上角。如果我们以左上角为基准 则立方体的位置是（x(0-立方体边长/2)，y(0-立方体边长/2)，z(0-立方体边长/2)）
scene.add(cube) //将“立方体”添加到“场景”里
//移动立方体
const moveCube = () => {

    //移动立方体到(x1,y3,z0)
    cube.position.set(1, 3, 0)

    let { x, y, z } = cube.position

    //让相机，始终，对着，立方体（让立方体始终保持在，相机所看到的画面的正中间）（以相机当前位置为基准，然后调整相机角度，看 向 场景内某个坐标点）（相机位置不变，调整相机角度，让相机俯看，仰看，左看，右看）
    //camera.lookAt(x, y, z)
    controls.target = new THREE.Vector3(x, y, z) //如果使用了“相机轨道控制器”，则使用这句话，来改变相机角度。如果没有使用，则使用上面那句话，来改变相机角度(camera.lookAt)
}


//创建相机(通过相机，观察(看)上边三维空间里的某个物体)
//PerspectiveCamera透视相机
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight)
//默认情况下    相机在场景中的位置是（x0,y0,z0）    立方体中心点位置也是（x0,y0,z0）   这样就导致 相机 被包裹在 立方体中 ，导致相机看不到立方体，所以这里为了能够观察到 场景里的立方体，这里调整了 相机位置
//改变相机位置
camera.position.z = 10 //这里为啥调整z轴位置，请看图片“three里xyz轴.png”
camera.position.y = 3 //为了 能看出 立方体 是立体的，这里稍微抬高了一下相机的位置


//创建一个网格地面(此网格，非上边 那个网格。这里这个网格就是单纯的一个 像棋盘 的方格子 地面)
const gridHelper = new THREE.GridHelper(10, 10) //这个 10 是将 方格子地面 平均分成10份（x轴画10个方格子，y轴画10个方格子）
scene.add(gridHelper) //将“方格子地面”添加到“场景”里


//创建一个“xyz坐标轴参考辅助线”（默认情况下，红线代表X轴，绿线代表Y轴，蓝线代表Z轴）
const axesHelper = new THREE.AxesHelper(5)
axesHelper.position.y = 1 //改变“xyz坐标轴参考辅助线”在场景中的位置
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

//给“轨道控制器”添加效果2
controls.autoRotate = true //“轨道控制器”控制相机，自动围绕目标旋转
controls.autoRotateSpeed = 1 //设置 围绕目标自动旋转的速度有多快，默认2    不是必须设置

//监听“轨道控制器”改变相机视角
controls.addEventListener('change', () => {
    //console.log('轨道控制器，改变了，相机视角')
})



//通过“渲染器”  将  场景(三维空间)里  被相机所观察到的 画面，  画出来
renderer.render(scene, camera)



//dat.gui快捷图形调参工具。在开发时，避免因为调参数而反复修改代码。
//创建工具实例
const gui = new dat.GUI()
const f = gui.addFolder('配置')
onMounted(() => {
    f.domElement.id = 'gui'
    document.getElementById('container').appendChild(f.domElement) //将datgui添加到html页面上
})
//控制对象
const controlData = {
    rotationSpeed: 0.01, //立方体旋转速度
    color: '#00ff00', //立方体颜色
    wireframe: false, //立方体是否以 线框 的形式来显示
}
//f.add(controlData, 'rotationSpeed').min(0.01).max(0.1).step(0.01)
f.add(controlData, 'rotationSpeed', 0.01, 0.1, 0.01) //上边这句话 和 这里，两种写法，二选一，都行
f.addColor(controlData, 'color') //颜色选择器
f.add(controlData, 'wireframe') //checkbox








//实时绘制，相机所看到的画面
function animation() {
    requestAnimationFrame(animation)

    controls.update() //当鼠标在页面上移动、滑动操作的时候，实时调用“轨道控制器”的“更新”方法，来刷新(更新)相机视角


    cube.rotation.x += controlData.rotationSpeed //让 立方体，以x轴，旋转

    cube.material.color = new THREE.Color(controlData.color) //通过 datgui 手动改变立方体颜色

    material.wireframe = controlData.wireframe //根据 datgui 手动改变立方体显示方式

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

<style scoped>
::v-deep #gui {
    position: fixed;
    right: 0;
    top: 0;
    width: 300px;
    z-index: 99;
}
</style>