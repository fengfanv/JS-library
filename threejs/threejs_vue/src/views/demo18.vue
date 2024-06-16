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






// //创建一个圆形平面（圆形缓冲几何体）
// let radius = 1 //半径
// let segments = 64 //分段(三角面)的数量(由多个三角形构成一个圆形)(多少个三角形)（最小值为3，默认值为32）
// let thetaStart = 0 //第一个分段的起始角度（默认为0°）
// let thetaLength = 170 * (Math.PI / 180) //圆形扇区的中心角（0-360）（弧度）
// const geometry = new THREE.CircleGeometry(radius, segments, thetaStart, thetaLength)
// const material = new THREE.MeshBasicMaterial({
//     color: 0xffffff,
//     side: THREE.DoubleSide,
//     wireframe: true
// })
// const circle = new THREE.Mesh(geometry, material)
// circle.position.set(0, 0, 0)
// scene.add(circle)






// //创建一个圆环平面（圆环缓冲几何体）（圆环，空心圆平面）
// let innerRadius = 0.5 //内部半径，默认值为0.5
// let outerRadius = 1 //外部半径，默认值为1

// let thetaSegments = 32 //这个值越大，圆环就越圆。最小值为3，默认值为32。（有多少个 从圆心到圆边的线(半径线)(竖线) ）
// let phiSegments = 10 //最小值为1，默认值为1。（有多少个 环绕圆心一周的线(圆周线) ）

// let thetaStart = 0 //起始角度，默认值为0
// let thetaLength = 170 * (Math.PI / 180) //圆心角,（0-360）（弧度）
// const ring_geometry = new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength)
// const ring_material = new THREE.MeshBasicMaterial({
//     color: 0xffff00,
//     side: THREE.DoubleSide,
//     wireframe: true
// })
// const mesh = new THREE.Mesh(ring_geometry, ring_material)
// scene.add(mesh)






// let degArr = [0, 5, 10, 45, 90, 95, 100, 180, 185, 190, 270, 315]
// for (let i = 0; i < degArr.length; i++) {

//     const r = 3
//     const rad = degArr[i] * (Math.PI / 180) //弧度 （角度转弧度）
//     const x = Math.cos(rad) * r //cosθ=邻/斜    邻=cosθ*斜    斜=邻/cosθ    斜=r    cosθ=Math.cos(rad)     邻=x=？
//     const y = Math.sin(rad) * r //sinθ=对/斜    对=sinθ*斜    斜=对/sinθ    斜=r    sinθ=Math.sin(rad)     对=y=？

//     const geometry = new THREE.PlaneGeometry(0.1, 0.3)
//     const material = new THREE.MeshBasicMaterial({
//         color: 0xffff00,
//         side: THREE.DoubleSide
//     })
//     const line = new THREE.Mesh(geometry, material)

//     line.position.set(x, y, 0)
//     line.rotation.z = rad

//     scene.add(line)
// }






// let lineNum = 10
// for (let i = 0; i < lineNum; i++) {

//     const r = 3
//     const rad = ((360 * Math.PI / 180) / lineNum) * i //弧度 （角度转弧度）
//     const x = Math.cos(rad) * r //cosθ=邻/斜    邻=cosθ*斜    斜=邻/cosθ    斜=r    cosθ=Math.cos(rad)     邻=x=？
//     const y = Math.sin(rad) * r //sinθ=对/斜    对=sinθ*斜    斜=对/sinθ    斜=r    sinθ=Math.sin(rad)     对=y=？

//     const geometry = new THREE.PlaneGeometry(0.1, 0.3)
//     const material = new THREE.MeshBasicMaterial({
//         color: 0xffff00,
//         side: THREE.DoubleSide
//     })
//     const line = new THREE.Mesh(geometry, material)

//     line.position.set(x, y, 0)
//     line.rotation.z = rad

//     scene.add(line)
// }

// //画一条圆线
// const ring_geometry = new THREE.RingGeometry(3, 3.01)
// const ring_material = new THREE.MeshBasicMaterial({
//     side: THREE.DoubleSide
// })
// const mesh = new THREE.Mesh(ring_geometry, ring_material)
// scene.add(mesh)






import { FontLoader } from 'three/addons/loaders/FontLoader.js' //引入json字体加载器
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js' //文本缓冲几何体。需要单独引入
const fontPath = new URL('../assets/Alimama_DaoLiTi_Regular.json', import.meta.url).href //json字体文件路径
//加载json字体
new FontLoader().load(fontPath, (font) => {

    let textArr = '绿水青山就是金山银山'.split('') || []
    for (let i = 0; i < textArr.length; i++) {

        const r = 3
        const rad = ((360 * Math.PI / 180) / textArr.length) * i //弧度 （角度转弧度）
        const x = Math.cos(rad) * r //cosθ=邻/斜    邻=cosθ*斜    斜=邻/cosθ    斜=r    cosθ=Math.cos(rad)     邻=x=？
        const y = Math.sin(rad) * r //sinθ=对/斜    对=sinθ*斜    斜=对/sinθ    斜=r    sinθ=Math.sin(rad)     对=y=？

        const textGeometry = new TextGeometry(textArr[i], {
            font: font,
            size: 0.8,
            depth: 0.5
        })
        textGeometry.center() //让文字居中
        const text = new THREE.Mesh(textGeometry)

        text.position.set(x, y, 0)
        text.rotation.z = rad - (90 * Math.PI / 180)

        scene.add(text) //将文字添加到场景里
    }

})







// const video = document.createElement('video')
// video.src = new URL('../assets/mov_bbb.mp4', import.meta.url).href
// video.crossOrigin = 'anonymous'
// video.muted = true //开启静音。解决报“play() failed because the user didn't interact with the document first.”的问题。这样 就可以 一上来 就自动播放视频。
// video.loop = true
// video.play()

// const texture = new THREE.VideoTexture(video)
// const material = new THREE.MeshBasicMaterial({
//     color: 0xffffff,
//     side: THREE.DoubleSide,
//     map: texture,
// })
// const liFangTi = new THREE.BoxGeometry()
// const cube = new THREE.Mesh(liFangTi, material)
// scene.add(cube)







//创建相机(通过相机，观察(看)上边三维空间里的某个物体)
//PerspectiveCamera透视相机
let fov = 30 //相机垂直视角角度
let aspect = width / height //相机视锥体的长宽比，通常是使用 画布的宽/画布的高
let near = 1 //相机可视范围最小值
let far = 30000 //相机可视范围最大值(相机最远能看多远)
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
//改变相机位置
camera.position.z = 10 //这里为啥调整z轴位置，请看图片“three里xyz轴.png”
camera.position.y = 3 //为了 能看出 立方体 是立体的，这里稍微抬高了一下相机的位置





//创建一个“xyz坐标轴参考辅助线”（默认情况下，红线代表X轴，绿线代表Y轴，蓝线代表Z轴）
const axesHelper = new THREE.AxesHelper()
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