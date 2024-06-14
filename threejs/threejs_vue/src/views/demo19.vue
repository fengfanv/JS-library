<template>
    <div id="container"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js' //引入轨道控制器
import { createMap, initCss2dRenderer } from '@/hooks/map.js'



let width = window.innerWidth
let height = window.innerHeight




//创建场景(创建一个三维空间，创建一个三维世界)
const scene = new THREE.Scene()
//修改“场景”的背景色（默认，黑色）
scene.background = new THREE.Color(0x666666) //将“场景”的背景色，从“黑色”设置成“灰色”






//初始化css2d（初始化css2d渲染器）
const labelRenderer = initCss2dRenderer(width, height)
onMounted(() => {
    document.getElementById('container').appendChild(labelRenderer.domElement)
})






//加载地图json数据（https://datav.aliyun.com/portal/school/atlas/area_selector）（https://jsontool.cn）
const url = 'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json'
fetch(url).then((res) => {
    return res.json()
}).then((data) => {
    console.log(data)
    /*
    data：{
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "adcode": 370102,
                    "name": "汉东省",
                    "center": [
                        117.03862,
                        36.664169
                    ],
                    "centroid": [
                        117.097814,
                        36.655081
                    ],
                    "childrenNum": 0,
                    "level": "district",
                    "parent": {
                        "adcode": 370100
                    },
                    "subFeatureIndex": 0,
                    "acroutes": [
                        100000,
                        370000,
                        370100
                    ]
                },
                "geometry": {
                    "type": "MultiPolygon",     //------------------------------------------注意这里（MultiPolygon 多面。多条线，多个闭合。有海上小岛或飞地。由多个部分组成）
                    "coordinates": [
                        [
                            [
                                [
                                    117.015971,
                                    36.664073
                                ],
                                //...
                                //...
                                //...
                            ]
                        ],
                        [
                            [
                                [
                                    117.015971,
                                    36.664073
                                ],
                                //...
                                //...
                                //...
                            ]
                        ],
                        //...
                        //...
                        //...
                    ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    "adcode": 150000,
                    "name": "内蒙古自治区",
                    "center": [
                        111.670801,
                        40.818311
                    ],
                    "centroid": [
                        114.077429,
                        44.331087
                    ],
                    "childrenNum": 12,
                    "level": "province",
                    "parent": {
                        "adcode": 100000
                    },
                    "subFeatureIndex": 4,
                    "acroutes": [
                        100000
                    ]
                },
                "geometry": {
                    "type": "Polygon",     //------------------------------------------注意这里（Polygon 单面。一条线，一个闭合。没有海上小岛或飞地。仅由一个部分组成）
                    "coordinates": [
                        [
                            [
                                97.172903,
                                42.795257
                            ],
                            //...
                            //...
                            //...
                        ]
                    ]
                }
            },
            //...
            //...
            //...
        ]
    }
    */


    const map = createMap(data)
    scene.add(map)


    //图形与鼠标交互， THREE.Raycaster可以从指定的原点（起点）沿着指定的方向（射线）发射一条射线。这条射线可以与场景中的对象进行相交检测，以确定射线是否与对象相交，从而获取与射线相交的对象或交点信息，常用于用户交互、拾取物体、碰撞检测等场景。
    let intersect = null
    window.addEventListener("pointerdown", (event) => {
        const mouse = new THREE.Vector2()
        //将鼠标位置 归一化 为 设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
        mouse.x = (event.clientX / width) * 2 - 1
        mouse.y = -(event.clientY / height) * 2 + 1

        const raycaster = new THREE.Raycaster()
        //通过相机和鼠标位置更新射线
        raycaster.setFromCamera(mouse, camera)

        //计算物体和射线的焦点（intersects里是 被鼠标 触发(捕获到) 的对象）
        let intersects = raycaster.intersectObjects(map.children)

        //触发了（捕获了）很多的对象，但是大部分type都是Line，也就是之前绘制的描边，这些线段会干扰到正常的点击，所以我们将它们过滤掉
        intersects = intersects.filter((item) => item.object.type !== "Line")

        if (intersects.length > 0) {

            if (intersects[0].object.type == "Mesh") {
                if (intersect) {
                    isAplha(intersect, 1)
                }
                intersect = intersects[0].object.parent //获取 被触发对象 的的父级对象
                isAplha(intersect, 0.4)
            }

        } else {

            if (intersect) {
                isAplha(intersect, 1)
            }

        }

        function isAplha(intersect, opacity) {
            intersect.children.forEach((item) => {
                if (item.type === "Mesh") {
                    item.material.opacity = opacity
                }
            })
        }
    })

})






//创建相机(通过相机，观察(看)上边三维空间里的某个物体)
//PerspectiveCamera透视相机
let fov = 30 //相机垂直视角角度
let aspect = width / height //相机视锥体的长宽比，通常是使用 画布的宽/画布的高
let near = 1 //相机可视范围最小值
let far = 30000 //相机可视范围最大值(相机最远能看多远)
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
//改变相机位置
camera.position.z = 300 //这里为啥调整z轴位置，请看图片“three里xyz轴.png”
camera.position.y = 100 //为了 能看出 立方体 是立体的，这里稍微抬高了一下相机的位置





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




    //实时捕获场景和相机信息，然后根据 信息 将 css2d内容 绘制到正确位置
    labelRenderer.render(scene, camera)




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