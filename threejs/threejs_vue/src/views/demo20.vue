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





let data = [
    {
        name: 'A区',
        center: [-5, 3],
        color: 0x68f300,
        coordinates: [
            [0, 0],
            [-4, 0],
            [-7, 2],
            [-8, 10],
            [-6, 13],
            [-2, 11],
            [0, 9],
            [0, 0]
        ]
    },
    {
        name: 'B区',
        center: [5, 7],
        color: 0xffdf00,
        coordinates: [
            [0, 0],
            [4, 1],
            [8, -2],
            [7, 2],
            [8, 10],
            [-2, 11],
            [0, 9],
            [0, 6],
            [0, 0]
        ]
    },
    {
        name: 'C区',
        center: [0, -5],
        color: 0xffa300,
        coordinates: [
            [0, 0],
            [4, 1],
            [8, -2],
            [9, -10],
            [0, -8],
            [-4, -6],
            [-7, 2],
            [-4, 0],
            [0, 0]
        ]
    }
]


const map = createMap(data)
scene.add(map)


//创建地图
function createMap(data) {

    const map = new THREE.Object3D()
    data.forEach((item, index) => {

        const mesh = createMesh(item.coordinates, item.color)
        const line = createLine(item.coordinates)
        const icon = createIcon(item.center)
        map.add(mesh, line, icon)

    })
    return map
}


function createMesh(data, color) {

    const shape = new THREE.Shape()
    data.forEach((item, index) => {
        const [x, y] = item

        if (index == 0) {
            shape.moveTo(x, y)
        } else {
            shape.lineTo(x, y)
        }
    })

    const geometry = new THREE.ShapeGeometry(shape) //挤压缓冲几何体(ExtrudeGeometry) 或 形状缓冲几何体(ShapeGeometry)
    const shapeMaterial = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide,
        transparent: true
    })
    const mesh = new THREE.Mesh(geometry, shapeMaterial)

    return mesh
}


//解决linewidth不生效问题
import { Line2 } from 'three/examples/jsm/lines/Line2'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial'
function createLine(data) {

    // const points = []
    // data.forEach((item) => {
    //     const [x, y] = item
    //     points.push(new THREE.Vector3(x, y, 0))
    // })

    // const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
    // const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 }) //linewidth不生效
    // const line = new THREE.Line(lineGeometry, lineMaterial)

    //------------------------------------------------------------

    //解决linewidth不生效问题
    var points = [ //点坐标数组，三个一组
        //0,0,0,
        //1,1,1,
        //...
    ]
    data.forEach((item) => {
        const [x, y] = item
        points.push(x, y, 0)
    })

    var geometry = new LineGeometry()
    geometry.setPositions(points)
    var material = new LineMaterial({
        color: 0xffffff,
        linewidth: 2
    })
    material.resolution.set(width, height) //设置材质分辨率
    var line = new Line2(geometry, material)
    line.computeLineDistances() //计算线条长度

    //------------------------------------------------------------

    line.position.z = 0.01
    return line
}


function createIcon(point) {

    const geometry = new THREE.BufferGeometry()
    const vertices = [0, 0, 0]
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    const material = new THREE.PointsMaterial({
        size: 1, //点大小
        color: 0xffffff, //点颜色
        transparent: true
    })
    const cude = new THREE.Points(geometry, material)

    const [x, y] = point
    cude.position.set(x, y, 0.1)

    return cude
}





//创建相机(通过相机，观察(看)上边三维空间里的某个物体)
//PerspectiveCamera透视相机
let fov = 30 //相机垂直视角角度
let aspect = width / height //相机视锥体的长宽比，通常是使用 画布的宽/画布的高
let near = 1 //相机可视范围最小值
let far = 30000 //相机可视范围最大值(相机最远能看多远)
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
//改变相机位置
camera.position.z = 80 //这里为啥调整z轴位置，请看图片“three里xyz轴.png”
camera.position.y = 30 //为了 能看出 立方体 是立体的，这里稍微抬高了一下相机的位置





//创建一个“xyz坐标轴参考辅助线”（默认情况下，红线代表X轴，绿线代表Y轴，蓝线代表Z轴）
const axesHelper = new THREE.AxesHelper(100)
scene.add(axesHelper) //将“xyz坐标轴参考辅助线”添加到“场景”里





//创建一个渲染器
const renderer = new THREE.WebGLRenderer()
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