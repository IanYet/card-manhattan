import {
    AxesHelper,
    BoxBufferGeometry,
    Group,
    Mesh,
    MeshBasicMaterial,
    PlaneBufferGeometry,
    Scene,
    Vector3,
    Color,
} from 'three'
import { STLLoader } from 'threeJSM/loaders/STLLoader.js'
import { net } from '../net'
import {
    chessMatrialMap,
    girdMatrial,
    girdMatrial0,
    windowMaterial,
} from './material'

// const drawSky = (scene)

/**
 *
 * @param {{}} data
 * @param {Scene} scene
 */
const drawCity = (data, scene) => {
    const cityData = data.city
    const up = data.up

    const cityGroup = new Group()
    cityGroup.userData.type = 'city'
    cityGroup.userData.up = up
    scene.add(cityGroup)

    //axes
    // const axesHelper = new AxesHelper(10000)
    // cityGroup.add(axesHelper)
    // window.axesHelper = axesHelper

    const areaIds = Object.keys(cityData)

    for (let id of areaIds) {
        const area = cityData[id]
        const areaGroup = new Group()
        areaGroup.userData.id = id

        const idNum = parseInt(id.replace('area', ''))
        areaGroup.position.setX((idNum % 3) * 3600 - 3600)
        areaGroup.position.setY(1800 - parseInt(idNum / 3) * 3600)
        areaGroup.position.setZ(0)
        cityGroup.add(areaGroup)

        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                const building = area[y][x]

                const buildingGroup = new Group()
                buildingGroup.userData.id = `city-${id}-${x}-${y}`
                buildingGroup.userData.data = []
                areaGroup.add(buildingGroup)

                const positionVec = new Vector3(
                    x * 1100 - 1100,
                    1100 - y * 1100,
                    0
                )
                buildingGroup.position.copy(positionVec)

                const gridGroup = new Group()
                buildingGroup.add(gridGroup)
                gridGroup.position.setZ(-550)

                // const baseGeo = new BoxBufferGeometry(1000, 1000, 1000)
                // const base = new Mesh(baseGeo, girdMatrial)
                // gridGroup.add(base)
                // base.position.setZ(-50)
                const top = new Mesh(
                    new PlaneBufferGeometry(1000, 1000),
                    girdMatrial
                )
                top.position.setZ(450)
                gridGroup.add(top)

                const front = new Mesh(
                    new PlaneBufferGeometry(1000, 1000),
                    girdMatrial0
                )
                front.position.set(0, -500, -50)
                front.rotateZ(Math.PI)
                front.rotateX(-Math.PI / 2)
                gridGroup.add(front)

                const back = front.clone()
                back.position.setY(500)
                back.rotateY(Math.PI)
                gridGroup.add(back)

                const left = front.clone()
                left.position.setY(0)
                left.position.setX(-500)
                left.rotateY(Math.PI / 2)
                gridGroup.add(left)

                const right = left.clone()
                right.position.setX(500)
                right.rotateY(Math.PI)
                gridGroup.add(right)

                const gridGeo = new BoxBufferGeometry(900, 900, 100)
                const grid = new Mesh(gridGeo, girdMatrial)
                gridGroup.add(grid)
                grid.position.setZ(500)

                drawBuilding(buildingGroup, building)
            }
        }
    }
}

/**
 *
 * @param {Group} buildingGroup building group
 * @param {[]} building
 */
const drawBuilding = (buildingGroup, building) => {
    if (!building.length) return

    const buildingData = [building].flat()
    const floor = buildingData.shift()
    const [type, idx] = [floor.substr(1), parseInt(floor)]
    const oriHeight =
        buildingGroup.userData.data.reduce(
            (pre, cur) => pre + parseInt(cur),
            0
        ) * 500

    buildingGroup.userData.data.push(floor)

    return new Promise((res, rej) => {
        const floorGroup = new Group()
        buildingGroup.add(floorGroup)

        const geo = new BoxBufferGeometry(900, 900, 500 * idx)
        const mat = chessMatrialMap[type]
        const mesh = new Mesh(geo, mat)
        floorGroup.add(mesh)

        for (let i = 0; i < 4; i++) {
            for (let f = 0; f < idx; f++) {
                const plane = new PlaneBufferGeometry(200, 200)
                const planeMat = windowMaterial
                const win = new Mesh(plane, planeMat)
                floorGroup.add(win)

                win.rotateX(Math.PI / 2)
                win.rotateY(((i % 2) * Math.PI) / 2)

                win.position.setZ(f * 500 - idx * 250 + 250)

                switch (i) {
                    case 0:
                        win.position.setX((f % 2) * 450 - 225)
                        win.position.setY(-451)
                        break
                    case 1:
                        win.position.setX(451)
                        win.position.setY((f % 2) * 450 - 225)
                        break
                    case 2:
                        win.position.setX(((f + 1) % 2) * 450 - 225)
                        win.position.setY(451)
                        break
                    case 3:
                        win.position.setX(-451)
                        win.position.setY(((f + 1) % 2) * 450 - 225)
                    default:
                }
            }
        }
        floorGroup.position.setZ(oriHeight + (500 * idx) / 2)
        floorGroup.rotateX(((oriHeight / 500) % 2) * Math.PI)
        res()
    }).then(() => drawBuilding(buildingGroup, buildingData))
}
export { drawCity }
