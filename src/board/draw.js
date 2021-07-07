import {
    AxesHelper,
    BoxBufferGeometry,
    Group,
    Mesh,
    MeshBasicMaterial,
    Scene,
    Vector3,
} from 'three'
import { STLLoader } from 'threeJSM/loaders/STLLoader.js'
import { net } from '../net'
import { chessMatrialMap, girdMatrial } from './material'

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
    const axesHelper = new AxesHelper(10000)
    cityGroup.add(axesHelper)
    window.axesHelper = axesHelper

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

                const loader = new STLLoader()
                loader.load(`${net.url}grid.STL`, (geo) => {
                    geo.translate(-500, -500, -50)
                    const mesh = new Mesh(geo, girdMatrial)
                    buildingGroup.add(mesh)

                    const positionVec = new Vector3(
                        x * 1100 - 1100,
                        1100 - y * 1100,
                        0
                    )
                    buildingGroup.position.copy(positionVec)
                    mesh.position.setZ(-50)

                    drawBuilding(buildingGroup, building)
                })
            }
        }
    }
}

/**
 *
 * @param {Group} buildingGroup building group
 * @param {[]} building
 */
const drawBuilding = async (buildingGroup, building) => {
    if (!building.length) return

    const buildingData = [building].flat()
    const floor = buildingData.shift()
    console.log(floor)
    const [type, idx] = [floor.substr(1), parseInt(floor)]
    const oriHeight =
        buildingGroup.userData.data.reduce(
            (pre, cur) => pre + parseInt(cur),
            0
        ) * 500

    buildingGroup.userData.data.push(floor)

    return new Promise((res, rej) => {
        const loader = new STLLoader()
        loader.load(`${net.url}chessman${idx}.STL`, (geo) => {
            geo.translate(-500, -500, 0 - (500 * idx) / 2)
            const mat = chessMatrialMap[type]
            const mesh = new Mesh(geo, mat)
            buildingGroup.add(mesh)

            mesh.position.setZ(oriHeight + (500 * idx) / 2)
            res()
        })
    }).then(() => drawBuilding(buildingGroup, buildingData))
}
export { drawCity }
