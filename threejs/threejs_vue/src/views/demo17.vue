<template>
    <div id="container"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js' //引入轨道控制器




let width = window.innerWidth
let height = window.innerHeight
let depth = 1400




//创建场景(创建一个三维空间，创建一个三维世界)
const scene = new THREE.Scene()
//添加雾效果
scene.fog = new THREE.Fog(0x000000, 0, 10000)




//创建一个立方体
const liFangTi = new THREE.BoxGeometry(width, height, depth)
//创建一个材质(外观)(为立方体创建一个皮肤)
let liFangTi_image = new URL('../assets/sky.png', import.meta.url).href
const liFangTi_material = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load(liFangTi_image),
    side: THREE.BackSide, //THREE.FrontSide前面渲染 THREE.BackSide背面渲染 THREE.DoubleSide双面渲染
})
//利用网格，将 几何体 和 材质 拼接在一起，然后添加到场景中
const liFangTi_cube = new THREE.Mesh(liFangTi, liFangTi_material)
scene.add(liFangTi_cube) //将“物体”添加到“场景”里






//创建一个球体
let radius = 50 //半径
let widthSegments = 64 //球体有几个经线（竖线是经线，连接南北极的是经线）
let heightSegments = 32 //球体有几个纬线（横线是纬线）横纬竖经
const qiuTi = new THREE.SphereGeometry(radius, widthSegments, heightSegments)
//为 几何体 创建一个材质(外观)(为 几何体 创建一个皮肤)
let qiuTi_image = new URL('../assets/earth_bg.png', import.meta.url).href
//注意，这里球体的皮肤，是高光反射材质。所以，需要灯光，才能看见球体的皮肤
const qiuTi_material = new THREE.MeshPhongMaterial({
    map: new THREE.TextureLoader().load(qiuTi_image), //为球体，添加一个，图片皮肤
    shininess: 400
})
//利用网格，将 几何体 和 材质 拼接在一起
const qiuTi_cube = new THREE.Mesh(qiuTi, qiuTi_material)





//为球体，创建灯光
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4) //环境光 0xffffff是光的颜色 0.4是光的强度
const pointLight = new THREE.PointLight(0xffffff, 10000000) //点光源
pointLight.position.set(1000, 0, 0) //修改 点光源 位置





//创建一个分组，将球体和灯光整合在一起
const group = new THREE.Group()
group.add(qiuTi_cube)
group.add(ambientLight)
group.add(pointLight)
scene.add(group) //将“分组”添加到“场景”里
//根据 “上边立方体的大小” 动态设置组的位置
let group_x = -(width / 2) * (40 / 100)
let group_y = (height / 2) * (40 / 100)
let group_z = -(depth / 2) * (50 / 100)
group.position.set(group_x, group_y, group_z) //修改 分组 在 场景 中的位置






//创建星星
let star_image_1 = new URL('../assets/starflake1.png', import.meta.url).href
let star_image_2 = new URL('../assets/starflake2.png', import.meta.url).href
let size1 = 50
let size2 = 20
let color1 = [0.6, 1, 0.75]
let color2 = [0, 0, 1]
function createStar(image, size, color, x, y, z) {
    //创建一个“点”
    const geometry = new THREE.BufferGeometry()
    const vertices = [0, 0, 0] //定义 几何体 形状的坐标数据(这里这个坐标数据，是专门用来定义几何体形状的)（注意，不要在这里设置物体在场景中的位置）（当“物体”被添加到“场景”里后，会初始化“物体”在“场景”中位置(position)为(0,0,0)，所以如果要修改“物体”在“场景”中的位置，请使用point.position.set(1, 2, 1)方法）
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    //创建“点材质”。给“点”这种特殊物体添加皮肤，需要使用特殊的“点材质”
    const material = new THREE.PointsMaterial({
        size: size, //“点”大小
        map: new THREE.TextureLoader().load(image), //给“点”添加一个图片纹理材质(图片皮肤)
        transparent: true, //材质是否透明
    })
    material.color.setHSL(color[0], color[1], color[2]) //setHSL(色相[0-1],饱和度[0-1],亮度[0-1]) 
    const point = new THREE.Points(geometry, material)
    point.position.set(x, y, z) //设置 点物体 在场景中的位置
    return point
}
//生成随机数
function createRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

let stars = [] //存放星星的数组
//创建1500个星星
for (let i = 0; i < 1500; i++) {
    //生成星星在场景中的位置
    let x = createRandom(-(width / 2), (width / 2))
    let y = createRandom(-(height / 2), (height / 2))
    let z = createRandom(-(depth / 2), (depth / 2))
    let image = null
    let size = null
    let color = null
    if (i % 2) {
        image = star_image_1
        size = size1
        color = color1
    } else {
        image = star_image_2
        size = size2
        color = color2
    }
    //创建星星
    stars.push(createStar(image, size, color, x, y, z))
    scene.add(stars[i]) //将“星星”添加到“场景”里
}





//创建星云
//创建一个平面几何体
const pingMian = new THREE.PlaneGeometry(400, 200)
//为 平面几何体 创建一个材质(外观)(为 平面几何体 创建一个皮肤)
let pingMian_image = new URL('../assets/cloud.png', import.meta.url).href
const material = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load(pingMian_image),
    transparent: true
})
//利用网格，将 几何体 和 材质 拼接在一起，然后添加到场景中
const xingYun = new THREE.Mesh(pingMian, material)
xingYun.position.set(0, 0, 0) //设置 几何体 在场景中的位置
scene.add(xingYun) //将“物体”添加到“场景”里




//让星云曲线运动
let route = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, -depth / 2),
    new THREE.Vector3(-width / 2 / 2, height / 2 / 2, -depth / 2 / 2),
    new THREE.Vector3(0, height / 2 / 2, -depth / 2 / 2 / 2),
    new THREE.Vector3(width / 2 / 2, height / 2 / 2, -depth / 2 / 2 / 2 / 2),
    new THREE.Vector3(0, 0, depth / 2)
])
let currentProcess = 0 //当前走到哪里了 0至1
//将 星云运动路径 画出来
const points = route.getPoints(50) //注意这里是getPoints    结尾有s
const curve_geometry = new THREE.BufferGeometry().setFromPoints(points)
const curve_material = new THREE.LineBasicMaterial({ color: 0xff0000 })
const curve = new THREE.Line(curve_geometry, curve_material)
scene.add(curve) //将“曲线”添加到“场景”里




//创建相机(通过相机，观察(看)上边三维空间里的某个物体)
//PerspectiveCamera透视相机
let fov = 30 //相机垂直视角角度
let aspect = width / height //相机视锥体的长宽比，通常是使用 画布的宽/画布的高
let near = 1 //相机可视范围最小值
let far = 30000 //相机可视范围最大值(相机最远能看多远)
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
camera.lookAt(0, 0, 0) //让相机看向某个"点"
//计算 相机与立方体(立方体中心(0,0,0)) 二者之间的最佳距离
//三角函数 tanθ=对边/邻边    邻边=对边/tanθ    对边=tanθ*邻边    对边=height/2    邻边=z=?    tan15°=Math.tan(15*Math.PI/180)
let bestDistance = (height / 2) / Math.tan((fov / 2) * Math.PI / 180)
camera.position.z = bestDistance - (depth / 2) //这里 减(depth/2) 是因为，所计算的位置 是根据立方体中心(0,0,0)计算的（脑海中的三角函数图形的"对边"是(0,0,0)的y轴那条线）。所以为了获得最佳效果，这里 减了(depth/2)





//创建一个“xyz坐标轴参考辅助线”（默认情况下，红线代表X轴，绿线代表Y轴，蓝线代表Z轴）
const axesHelper = new THREE.AxesHelper(100) //100是size大小
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




//requestAnimationFrame每秒执行120次（运行120次需要1秒钟时间）
//星星颜色发生变化，从蓝到黄，(值范围：0到1)，需要5秒
let chunk_value = 1 / (120 * 5)
let direction = 'add' //add/reduce





//计算fps
let lastTime = 0;
let frameCount = 0;
let secondPassed = 0;

//实时绘制，相机所看到的画面
function animation() {

    //计算fps
    const now = performance.now();
    frameCount++;
    if (now - lastTime >= 1000) { //如果已经过去1秒
        const fps = frameCount / (now - lastTime) * 1000; //计算每秒的帧数
        console.log(`FPS: ${fps.toFixed(2)}`);
        frameCount = 0;
        secondPassed++;

        lastTime = now;
    }



    controls.update() //当鼠标在页面上移动、滑动操作的时候，实时调用“轨道控制器”的“更新”方法，来刷新(更新)相机视角



    qiuTi_cube.rotateY(0.01) //让球体自转。等效qiuTi_cube.rotation.y += 0.01



    for (let i = 0; i < stars.length; i++) {

        //移动小星星
        if (stars[i].position.z > (depth / 2)) {
            stars[i].position.setZ(-(depth / 2))
        } else {
            stars[i].position.z += 3
        }

        //让星星颜色发生变化
        let itemRGB = stars[i].material.color
        if (direction == 'add') {
            stars[i].material.color.setRGB(itemRGB.r, itemRGB.g, itemRGB.b + chunk_value)
            if (itemRGB.b >= 1) {
                direction = 'reduce'
            }
        } else {
            stars[i].material.color.setRGB(itemRGB.r, itemRGB.g, itemRGB.b - chunk_value)
            if (itemRGB.b <= 0) {
                direction = 'add'
            }
        }
    }


    //让星云曲线运动
    if (currentProcess <= 1) {
        currentProcess += 0.001
        const point = route.getPoint(currentProcess) //注意这里是getPoint    结尾没有s
        if (point) {
            xingYun.position.set(point.x, point.y, point.z)
        }
    } else {
        currentProcess = 0
    }



    
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