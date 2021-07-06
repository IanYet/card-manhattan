import {
    BoxBufferGeometry,
    Group,
    Mesh,
    MeshBasicMaterial,
    Scene,
    Vector3,
} from 'three'
import { STLLoader } from 'threeJSM/loaders/STLLoader.js'
import { net } from '../net'
/**
 *
 * @param {{}} data
 * @param {Scene} scene
 */
const drawCity = (data, scene) => {
    const cityGroup = new Group()
    cityGroup.userData.type = 'city'
    scene.add(cityGroup)

    const geo = new BoxBufferGeometry(1, 1)
    const mat = new MeshBasicMaterial({ color: 0xffff00 })
    const mesh = new Mesh(geo, mat)
    cityGroup.add(mesh)

    const areaIds = Object.keys(data)

    for (let id of areaIds) {
        const area = data[id]
        const areaGroup = new Group()
        areaGroup.userData.id = id

        const idNum = parseInt(id.replace('area', ''))
        areaGroup.position.setX((idNum % 3) * 3.5 + 1.5)
        areaGroup.position.setY(parseInt(idNum / 3) * 3.5 + 1.5)
        areaGroup.position.setZ(0)
        cityGroup.add(areaGroup)

        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                const building = area[x][y]

                const buildingGroup = new Group()
                buildingGroup.userData.id = `city-${id}-${x}-${y}`
                areaGroup.add(buildingGroup)

                const loader = new STLLoader()
                loader.load(`${net.url}grid.stl`, (geo) => {
                    const mat = new MeshBasicMaterial({ color: 0xff0000 })
                    const mesh = new Mesh(geo, mat)
                    buildingGroup.add(mesh)

                    mesh.position.copy(new Vector3(x + 0.5, y + 0.5, 0))
                    mesh.scale.copy(new Vector3(0.0009,0.0009,0.0009))
                })
            }
        }
    }
}

export { drawCity }
