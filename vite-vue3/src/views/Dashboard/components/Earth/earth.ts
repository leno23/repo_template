import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  AdditiveBlending,
  BackSide,
  Vector3,
  Vector2,
  ShaderMaterial,
  Color,
  MeshBasicMaterial,
  Mesh,
  SphereGeometry,
  TextureLoader,
  MathUtils,
  Raycaster,
  SpriteMaterial,
  Sprite,
  Spherical,
  Group,
  CircleGeometry,
  DoubleSide,
  MeshStandardMaterial,
  AmbientLight,
  PlaneGeometry,
  Matrix4,
  LineLoop,
  RingGeometry,
  FrontSide
} from 'three'
import earthIMG from '@/assets/map_outline.png'
import lightConeIMG from '@/assets/lightray_yellow.jpg'
import CityPositionMap from './cityPositionMap'

const texture = new TextureLoader()
const earthMapTexture = texture.load(earthIMG)
const lightConeTexture = texture.load(lightConeIMG)

const radius = 100 // 统一半径

const longitudeOffset = -8 // 城市经度与贴图的偏移量
const latitudeOffset = 2 // 城市纬度与贴图的便宜量

const scene = new Scene() // 创建一个三维布景
// scene.background = new Color(0x181818) // 布景底色
scene.background = new Color(0x030409) // 布景底色

const light = new AmbientLight(0x404040) // 环境光源
scene.add(light)

const renderer = new WebGLRenderer({ antialias: true }) // 渲染器

// * ------------------- 地球 -----------------
const EarthMaterial = new MeshBasicMaterial({
  map: earthMapTexture,
  // color: 0x00ff00,
  color: 0x8aaafb

})

const EarthGeometry = new SphereGeometry(radius, 64, 64)
// EarthGeometry.rotateY(3)
// EarthGeometry.rotateX(0.3)
const EatrhMesh = new Mesh(EarthGeometry, EarthMaterial) // 根据几何体和材质创建Mesh网格模型
scene.add(EatrhMesh)

// * ----------------- 光晕 ------------------------
const HaloGeometry = new CircleGeometry(radius, 64)
const HaloMaterial = new MeshBasicMaterial({
  side: BackSide,
  transparent: true,
  opacity: 0.5,
  color: 0x7ce6fc
})

const HaloMesh = new Mesh(HaloGeometry, HaloMaterial)
HaloMesh.scale.set(1.04, 1.04, 1.04)
scene.add(HaloMesh)

// * ------------ 坐标点 -----------------
const CityPointGroup = new Group() // 包含坐标点、坐标描线、坐标光柱的Mesh组
CityPointGroup.name = 'CityPointGroup'

/**
 * @param lng 经度
 * @param lat 纬度
 * @description 经纬度转换为three中的坐标
 */
const getCityPositionForThree = (longitude: number, latitude: number) => {
  const spherical = new Spherical() // 球坐标构造函数
  spherical.radius = radius * 1.01 // point的参考半径要比地球半径大一点点，相当于漂浮在地球贴图之上，否则紧贴容易穿模

  // 极角（phi）位于正 y 轴和负 y 轴上。赤道角(方位角)（theta）从正 z 开始。
  spherical.phi = (90 - latitude) * (Math.PI / 180) // 与 y (up) 轴的极角（以弧度为单位）
  spherical.theta = (longitude + 90) * (Math.PI / 180) // 绕 y (up) 轴的赤道角(方位角)（以弧度为单位)

  const position = new Vector3() // 三维向量类 xyz 表示一个位于三维空间中的点
  position.setFromSpherical(spherical) // 从球坐标s中设置该向量
  return position
}

const PointRadius = 2.8

const createPoint = (cityName: string, position: Vector3) => {
  const baseLookAtPosition = new Vector3(0, 0, 0)

  // * ----------------- 创建点 --------------------
  const PointGeometry = new CircleGeometry(PointRadius, 32)

  const PointMaterial = new MeshBasicMaterial({
    side: BackSide, // 地球非透明可与无需双面可见
    color: 0x8aaafb,
    // color: 0xffff00,
    opacity: 0.9,
    transparent: true
  })
  const PointMesh = new Mesh(PointGeometry, PointMaterial)
  PointMesh.name = `CityPoint-${cityName}`

  PointMesh.position.copy(position)
  PointMesh.lookAt(baseLookAtPosition)

  CityPointGroup.add(PointMesh)

  // * -------------------- 创建点外的包围线 -------------------------
  const LineGeometry = new RingGeometry(PointRadius + 0.6, PointRadius + 0.8, 32)
  const LineMaterial = new MeshBasicMaterial({
    side: BackSide, // 地球非透明可与无需双面可见
    color: 0x8aaafb,
    // color: 0xffff00,
    opacity: 0.9,
    transparent: true
  })
  const LineMesh = new Mesh(LineGeometry, LineMaterial)

  // const CircleLine = new LineLoop(LineGeometry, LineMaterial)

  LineMesh.position.copy(position)
  LineMesh.lookAt(baseLookAtPosition)

  CityPointGroup.add(LineMesh)

  // * --------------------- 创建点上的光柱 --------------------------

  const LightConeHeight = 30
  const LightConeGeometry = new PlaneGeometry(PointRadius * 2, LightConeHeight)
  const LightConeMaterial = new MeshBasicMaterial({
    side: DoubleSide,
    transparent: true,
    blending: AdditiveBlending,
    depthTest: true,
    map: lightConeTexture,
    color: 0x8aaafb
  })

  const matrix1 = new Matrix4()
  const LightConeMesh1 = new Mesh(LightConeGeometry, LightConeMaterial)

  matrix1.makeRotationX(Math.PI / 2)
  matrix1.setPosition(new Vector3(0, 0, LightConeHeight / -2))
  LightConeGeometry.applyMatrix4(matrix1)

  const LightConeMesh2 = LightConeMesh1.clone()
  LightConeMesh2.rotation.z = Math.PI / 1.5
  const LightConeMesh3 = LightConeMesh1.clone()
  LightConeMesh3.rotation.z = Math.PI / 2.5
  // const LightConeMesh4 = LightConeMesh1.clone()
  // LightConeMesh3.rotation.z = Math.PI / 3

  LightConeMesh1.add(LightConeMesh2)
  LightConeMesh1.add(LightConeMesh3)
  // LightConeMesh1.add(LightConeMesh4)
  LightConeMesh1.position.copy(position)
  LightConeMesh1.lookAt(baseLookAtPosition)

  CityPointGroup.add(LightConeMesh1)
}

const createCityPoint = (cityName: string) => {
  const { lng, lat } = CityPositionMap[cityName]
  createPoint(cityName, getCityPositionForThree(lng + longitudeOffset, lat + latitudeOffset))
  scene.add(CityPointGroup)
}

export { renderer, EatrhMesh, scene, HaloMesh, createCityPoint, CityPointGroup }
