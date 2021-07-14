import {
    AxesHelper,
    BoxBufferGeometry,
    Group,
    Mesh,
    PlaneBufferGeometry,
    Scene,
    Vector3,
} from 'three'
import {
    chessMatrialMap,
    girdMatrial,
    girdMatrial0,
    windowMaterial,
} from './material'

import { constant, status } from './status'

/**
 *
 * @param {Scene} scene
 */
const drawCity = (scene) => {
    const cityData = status.cityData
    const up = status.up

    const cityGroup = new Group()
    cityGroup.userData.type = constant.CITY_GROUP
    scene.add(cityGroup)

    //axes
    const axesHelper = new AxesHelper(10000)
    cityGroup.add(axesHelper)
    window.axesHelper = axesHelper

    const areaIds = Object.keys(cityData)

    for (let id of areaIds) {
        const area = cityData[id]
        const areaGroup = new Group()
        areaGroup.userData.id = id
        areaGroup.userData.type = constant.AREA_GROUP

        const idNum = parseInt(id.replace('area', ''))
        areaGroup.position.setX((idNum % 3) * 3600 - 3600)
        areaGroup.position.setY(1800 - parseInt(idNum / 3) * 3600)
        areaGroup.position.setZ(0)

        //up rotate
        areaGroup.rotateZ((up / 360) * Math.PI * 2)

        cityGroup.add(areaGroup)
        status.areas.push(areaGroup)

        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                const building = area[x][y]

                const buildingGroup = new Group()
                buildingGroup.userData.id = `${id}-${x}-${y}`
                buildingGroup.userData.data = []
                buildingGroup.userData.type = constant.BUILDING_GROUP

                areaGroup.add(buildingGroup)
                status.buildings.push(buildingGroup)

                const positionVec = new Vector3(
                    y * 1100 - 1100,
                    1100 - x * 1100,
                    0
                )
                buildingGroup.position.copy(positionVec)

                const gridGroup = new Group()
                gridGroup.userData.type = constant.GRID_GROUP
                buildingGroup.add(gridGroup)
                gridGroup.position.setZ(-550)

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

    const buildingData = [...building]
    const floorData = buildingData.shift()
    const [type, idx] = [floorData.substr(1), parseInt(floorData)]
    const oriHeight =
        buildingGroup.userData.data.reduce(
            (pre, cur) => pre + parseInt(cur),
            0
        ) * 500

    buildingGroup.userData.data.push(floorData)

    return new Promise((res, rej) => {
        const floorGroup = new Group()
        floorGroup.userData.type = constant.FLOOR_GROUP
        floorGroup.userData.data = floorData
        status.floors.push(floorGroup)
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
export { drawCity, drawBuilding }
