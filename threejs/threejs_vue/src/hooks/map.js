import * as THREE from 'three'
import * as d3 from 'd3' //将经纬度坐标，转化成xy坐标

export const offsetXY = d3.geoMercator()

export function createMap(data) {
    const map = new THREE.Object3D()


    const center = data.features[0].properties.centroid
    offsetXY.center(center).translate([0, 0]) //将 某个经纬度位置 指定为xy坐标系中心点(0,0)。然后根据这个(指定的经纬度位置)，推算(其它经纬度)在xy坐标系中的位置。


    data.features.forEach((feature) => {

        //生成随机颜色
        const color = new THREE.Color(`hsl(
            ${233},
            ${Math.random() * 30 + 55}%,
            ${Math.random() * 30 + 55}%)`).getHex()
        //生成随机(厚度) 或 xyz里的z
        const depth = (Math.random() * 3 + 3) * 5



        const unit = new THREE.Object3D()
        const { coordinates, type } = feature.geometry


        coordinates.forEach((coordinate) => {

            if (type == "MultiPolygon") {
                coordinate.forEach((item) => fn(item))
            }
            if (type == "Polygon") {
                fn(coordinate)
            }

            function fn(coordinate) {
                const mesh = createMesh(coordinate, color, depth)
                const line = createLine(coordinate, depth)
                unit.add(mesh, line)
            }
        })


        const { centroid, center, name } = feature.properties
        const point = centroid || center || [0, 0]
        const label = createLabel(name, point, depth)
        const icon = createIcon(point, depth)

        map.add(unit)
        map.add(label)
        map.add(icon)
    })
    return map
}

export function createMesh(data, color, depth) {
    const shape = new THREE.Shape()
    data.forEach((item, idx) => {
        const [x, y] = offsetXY(item) //根据(指定的中心点位置)，将其它经纬度位置转换成坐标系位置（或推算出其它经纬度在坐标系中的位置）

        if (idx === 0) shape.moveTo(x, -y)
        else shape.lineTo(x, -y)
    })

    // const geometry = new THREE.ShapeGeometry(shape) 平面（2维）
    const geometry = new THREE.ExtrudeGeometry(shape, { //立体（3维）
        depth: depth, //深度(厚度)
        bevelEnabled: false //是否应用斜角，默认值为true。（设置成false后，小岛显示的更细，更真实）
    })
    const shapematerial = new THREE.MeshBasicMaterial({
        // color: 0xffffff,
        color: color,
        side: THREE.DoubleSide,
        transparent: true //材质是否透明
    })

    const mesh = new THREE.Mesh(geometry, shapematerial)
    return mesh
}

//创建边界（线）
export function createLine(data, depth) {
    const points = []
    data.forEach((item) => {
        const [x, y] = offsetXY(item)
        points.push(new THREE.Vector3(x, -y, 0))
    })
    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff })

    const line = new THREE.Line(lineGeometry, lineMaterial)
    line.position.z = depth
    return line
}

//在图形中添加城市名称（通过css2d的方式）
import {
    CSS2DRenderer,
    CSS2DObject,
} from 'three/examples/jsm/renderers/CSS2DRenderer.js'

export function initCss2dRenderer(width, height) {
    const labelRenderer = new CSS2DRenderer()
    labelRenderer.domElement.style.position = 'absolute'
    labelRenderer.domElement.style.top = '0px'
    labelRenderer.domElement.style.pointerEvents = 'none'
    labelRenderer.setSize(width, height)
    return labelRenderer
}

export function createLabel(name, point, depth) {
    const div = document.createElement('div')
    div.style.color = '#ffffff'
    div.style.fontSize = '12px'
    div.textContent = name
    const label = new CSS2DObject(div)
    label.scale.set(2, 2, 2)
    const [x, y] = offsetXY(point)
    label.position.set(x, -y, depth)
    return label
}


//创建图标
export function createIcon(point, depth) {
    //创建一个点
    const geometry = new THREE.BufferGeometry()
    const vertices = [0, 0, 0] //定义 几何体 形状的坐标数据(这里这个坐标数据，是专门用来定义几何体形状的)（注意，不要在这里设置物体在场景中的位置）（当“物体”被添加到“场景”里后，会初始化“物体”在“场景”中位置(position)为(0,0,0)，所以如果要修改“物体”在“场景”中的位置，请使用point.position.set(1, 2, 1)方法）
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    //创建 点材质。给 点 这种特殊物体添加皮肤，需要使用特殊的 点材质
    const material = new THREE.PointsMaterial({
        size: 4, //点 大小
        color: 0xff00ff, //点材质 的颜色
        transparent: true //材质是否透明
    })
    const cude = new THREE.Points(geometry, material)

    const [x, y] = offsetXY(point)
    cude.position.set(x, -y, depth + 0.2) //设置 点物体 在场景中的位置

    return cude
}