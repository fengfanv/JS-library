<template>
    <div id="container">
        <div class="btns">
            <button @click="play_disassemble">拆解动画</button>
            <button @click="play_restore">还原动画</button>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js' //引入轨道控制器
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js' //.gltf或.glb模型加载器
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js' //CSS2D渲染器（CSS2DRenderer）





let width = window.innerWidth
let height = window.innerHeight





//创建场景(创建一个三维空间，创建一个三维世界)
const scene = new THREE.Scene()
//修改“场景”的背景色（默认，黑色）
scene.background = new THREE.Color(0x666666) //将“场景”的背景色，从“黑色”设置成“灰色”





//创建一个“环境光”
const light = new THREE.AmbientLight(0xffffff, 1) //0xffffff是光的颜色   1是光的强度
scene.add(light)





//创建一个“平行光”
const directionalLight = new THREE.DirectionalLight(0xffffff, 5)
directionalLight.position.set(3, 3, 3)
directionalLight.castShadow = true //（制造影子）让 灯光支持投射 阴影
scene.add(directionalLight)






let model = null //加载的模型实例

//加载模型
new GLTFLoader().load('threejs_img/scene.gltf', function (glb) {
    // console.log('glb', glb)
    model = glb

    scene.add(glb.scene) //将加载好的“模型”添加到“场景”中

    //遍历所有子模型
    glb.scene.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            child.receiveShadow = true //（制造影子）让 物体能接收 阴影
            child.castShadow = true //（制造影子）让 物体能投射 阴影

            if (/^nut.{0,}/i.test(child.name)) {
                // console.log('螺母', child)
                child.material = new THREE[child.material.type]({
                    color: new THREE.Color(0xffffff)
                })
            } else if (/^bolt.{0,}/i.test(child.name)) {
                // console.log('螺栓', child)
                child.material = new THREE[child.material.type]({
                    color: new THREE.Color(0x505b62)
                })
            }
        }
    })
})






let mixer = null //动画混合器，用于管理多个动画
let action = null //当前播放的动画

//模型拆解动画
function play_disassemble() {
    //移除选中提示框
    removeSelectPromptBox()

    mixer = new THREE.AnimationMixer(model.scene) //创建一个新的动画混合器，并与加载的模型关联
    action = mixer.clipAction(model.animations[0]) //获取模型中的第一个动画，并创建一个AnimationAction

    //设置动画正向播放
    action.timeScale = 1

    //开始播放动画
    action.play()
}

//模型还原动画
function play_restore() {
    //移除选中提示框
    removeSelectPromptBox()

    mixer = new THREE.AnimationMixer(model.scene) //创建一个新的动画混合器，并与加载的模型关联
    action = mixer.clipAction(model.animations[0]) //获取模型中的第一个动画，并创建一个AnimationAction

    //设置动画从动画总时长的一半开始播放
    const halfDuration = action.getClip().duration / 2
    action.startTime = halfDuration
    action.time = halfDuration //确保当前时间也设置为起始时间

    //设置动画反向播放
    action.timeScale = -1

    //开始播放动画
    action.play()
}






//初始化css2d（初始化css2d渲染器）
const css2dRenderer = new CSS2DRenderer()
css2dRenderer.domElement.style.position = 'absolute'
css2dRenderer.domElement.style.top = '0px'
css2dRenderer.domElement.style.pointerEvents = 'none'
css2dRenderer.setSize(width, height)
onMounted(() => {
    document.getElementById('container').appendChild(css2dRenderer.domElement)
})

//创建css2D提示框
function createCss2DPromptBox(info, center) {
    //创建一个div元素
    const divDom = document.createElement('div')
    divDom.className = 'prompt-box'
    divDom.innerHTML = `<div class="part-name">
        <p>模块名字：${info.name}</p>
    </div>`
    const css2DPromptBox = new CSS2DObject(divDom)

    css2DPromptBox.position.copy(center)

    scene.add(css2DPromptBox)

    return { css2DPromptBox }
}






//获取3D对象的信息
function getMeshInfo(mesh) {
    const box3 = new THREE.Box3()
    box3.setFromObject(mesh)

    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box3.getCenter(center) //获取3D对象的中心点位置
    box3.getSize(size) //获取3D对象的(宽度，高度，深度)

    const worldQuaternion = new THREE.Quaternion()
    const worldPosition = new THREE.Vector3()
    const worldDirection = new THREE.Vector3()
    mesh.getWorldQuaternion(worldQuaternion) //该物体在世界空间中旋转的四元数
    mesh.getWorldPosition(worldPosition) //该物体在世界空间中位置的矢量
    mesh.getWorldDirection(worldDirection) //该物体在世界空间中Z轴正方向的矢量

    return { size, center, worldQuaternion, worldPosition, worldDirection }
}

//创建一个透明立方体
function createTransparentCube(width, height, depth, x, y, z) {
    //创建材质
    var material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        transparent: true,
        opacity: 0.5 //设置透明度
    })
    //创建立方体几何体
    var geometry = new THREE.BoxGeometry(width, height, depth)
    //创建网格对象并应用材质
    var cube = new THREE.Mesh(geometry, material)
    //将立方体添加到场景中
    scene.add(cube)
    cube.position.set(x, y, z)


    //创建线框材质
    var wireframeMaterial = new THREE.LineBasicMaterial({
        color: 0x000000
    })
    //创建边框
    var edges = new THREE.EdgesGeometry(geometry)
    var lineSegments = new THREE.LineSegments(edges, wireframeMaterial)
    //将边框添加到场景中
    scene.add(lineSegments)
    lineSegments.position.set(x, y, z)

    return { cube, lineSegments }
}

//移除3D对象
function removeMesh(resource) {
    if (resource instanceof THREE.Object3D) {
        if (resource.parent) {
            resource.parent.remove(resource)
        }
    }
    if (resource && resource.dispose) {
        resource.dispose()
    }
}






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
camera.position.z = 150 //这里为啥调整z轴位置，请看图片“three里xyz轴.png”
camera.position.y = 20 //为了 能看出 立方体 是立体的，这里稍微抬高了一下相机的位置





//创建一个渲染器
const renderer = new THREE.WebGLRenderer({
    antialias: true //抗锯齿
})
onMounted(() => {
    document.getElementById('container').appendChild(renderer.domElement) //将渲染器添加到html页面上
})
//设置渲染器窗口大小(设置canvas大小)
renderer.setSize(width, height)
//设置渲染器的像素比。避免绘图模糊
renderer.setPixelRatio(window.devicePixelRatio)
renderer.shadowMap.enabled = true //（制造影子）设置 渲染器 让渲染器支持渲染阴影
//通过“渲染器”  将  场景(三维空间)里  被相机所观察到的 画面，  画出来
renderer.render(scene, camera)






//创建轨道控制器，通过“轨道控制器”控制相机围绕目标进行轨道运动
//添加“轨道控制器”后，鼠标在页面上进行移动滑动操作，能让相机 围绕目标，根据鼠标操作，来动态切换相机视角
const controls = new OrbitControls(camera, renderer.domElement)
//给“轨道控制器”添加效果1
controls.enableDamping = false //为“轨道控制器”开启，惯性阻尼(减速)效果。当鼠标 移动完 松开鼠标后，“轨道控制器”控制的相机视角，会有一个惯性阻尼(减速)效果。
controls.dampingFactor = 0.05 //设置阻尼系数，默认0.05    不是必须设置





//解决，轨道控制器环绕模型旋转时，误触模型 的问题。（通过轨道控制器环绕“模型”旋转后，如果鼠标松开的位置“在模型上”则会误触模型）
let controlsStartPos = new THREE.Vector3()
let controlsMoveFlag = false
controls.addEventListener('start', () => {
    controlsStartPos.copy(camera.position)
})
controls.addEventListener('end', () => {
    controlsMoveFlag = controlsStartPos.distanceToSquared(camera.position) == 0
})





let select_prompt_box = [] //选中提示框
//新增选中提示框
function addSelectPromptBox(size, center, target) {
    const { cube, lineSegments } = createTransparentCube(size.x, size.y, size.z, center.x, center.y, center.z) //创建3d选中提示框

    const { css2DPromptBox } = createCss2DPromptBox(target, center) //创建css2d选中提示框

    select_prompt_box = [cube, lineSegments, css2DPromptBox]
}
//移除选中提示框
function removeSelectPromptBox() {
    const [cube, lineSegments, css2DPromptBox] = select_prompt_box

    removeMesh(cube)

    removeMesh(lineSegments)

    removeMesh(css2DPromptBox)
}






//模型交互使用threejs提供的（光线投射Raycaster）来实现。其原理是 从相机位置到鼠标点击的屏幕位置投射一条射线，并检测这条射线是否与场景中的物体相交。
renderer.domElement.addEventListener('click', (event) => {
    //获取点击屏幕位置
    const mouse = new THREE.Vector2()
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    //点击检测(射线相交检测)
    const rayCaster = new THREE.Raycaster()
    rayCaster.setFromCamera(mouse, camera)
    const intersects = rayCaster.intersectObjects(model.scene.children, true) //第二个参数true，意思是，是否检测当前目标的子目标，如果只检测当前目标，则设置false或不写

    if (controlsMoveFlag) {
        if (intersects.length) {
            //移除上一次的选中提示框
            removeSelectPromptBox()

            const target = intersects[0].object

            console.log(target)

            const { size, center, worldQuaternion, worldPosition, worldDirection } = getMeshInfo(target)

            addSelectPromptBox(size, center, target) //新增选中提示框
        }
    }
}, false)




let lastTime = 0




//实时绘制，相机所看到的画面
function animation() {

    const now = Date.now() //获取当前时间
    const delta = (now - lastTime) / 1000 //计算从上一次渲染到现在的时间差
    lastTime = now //更新当前时间

    if (mixer) {
        mixer.update(delta) //更新动画混合器

        //模型拆解动画（play_disassemble）。当动画播放到一半时，暂停。并保持播放在一半的状态
        if (action.timeScale == 1 && action.time >= action.getClip().duration / 2) {
            action.paused = true
        }

        //模型还原动画（play_restore） 注意，动画是从动画的一半开始 反向播放的
        const clipDuration = action.getClip().duration //动画的总时长
        const halfDuration = clipDuration / 2 //动画总时长的一半
        const isAnimationFinished = action.time >= clipDuration - halfDuration //当action.time大于或等于clipDuration - halfDuration时，说明动画已经反向播放完毕
        if (action.timeScale == -1 && isAnimationFinished) {
            action.reset() //防止反向播放完毕后，动画重复播放
        }
    }






    //实时捕获场景和相机信息，然后根据 信息 将 css2d内容 绘制到正确位置
    css2dRenderer.render(scene, camera)






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

<style scoped>
.btns {
    position: fixed;
    right: 0;
    top: 0;
}

::v-deep .prompt-box {
    background-color: red;
    border: 4px solid burlywood;
    top: 10%;
}
</style>