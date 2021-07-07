import { AxesHelper, Group, Mesh, Scene, Vector3 } from 'three'
import { STLLoader } from 'threeJSM/loaders/STLLoader.js'
import { net } from '../net'
import { girdMatrial } from './material'
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
    scene.add(cityGroup)

    //axes
    const axesHelper = new AxesHelper(10000)
    cityGroup.add(axesHelper)

    const areaIds = Object.keys(cityData)

    for (let id of areaIds) {
        const area = cityData[id]
        const areaGroup = new Group()
        areaGroup.userData.id = id

        const idNum = parseInt(id.replace('area', ''))
        areaGroup.position.setX((idNum % 3) * 3000 - 3000)
        areaGroup.position.setY(1500 - parseInt(idNum / 3) * 3000)
        areaGroup.position.setZ(0)
        areaGroup.scale.multiplyScalar(0.9)
        cityGroup.add(areaGroup)

        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                const building = area[x][y]

                const buildingGroup = new Group()
                buildingGroup.userData.id = `city-${id}-${x}-${y}`
                areaGroup.add(buildingGroup)

                const loader = new STLLoader()
                loader.load(`${net.url}grid.STL`, (geo) => {
                    geo.translate(-500, -500, -50)
                    const mesh = new Mesh(geo, girdMatrial)
                    buildingGroup.add(mesh)

                    const positionVec = new Vector3(
                        x * 1000 - 1000,
                        1000 - y * 1000,
                        -50
                    )
                    mesh.position.copy(positionVec)
                    mesh.scale.multiplyScalar(0.9)
                })

                console.log(building);
            }
        }
    }
}

export { drawCity }
