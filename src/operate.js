import { Raycaster } from 'three'
import { constant, status } from './status'

const findGroup = (object, groupType) => {
    if (!parent || !object.parent) return null

    if (object.type === 'Group' && object.userData.type === groupType) {
        return object
    } else {
        return findGroup(object.parent, groupType)
    }
}

const operate = {
    raycaster: null,

    chooseBuilding(ev) {
        const buildingSubMesh = operate.raycaster.intersectObjects(
            status.buildings,
            true
        )[0]?.object

        if (!buildingSubMesh) return

        const building = findGroup(buildingSubMesh, constant.BUILDING_GROUP)
        console.log(building)
    },
    /**
     *
     * @param {HTMLElement} el
     * @param {Raycaster} raycaster
     */
    start(el, raycaster) {
        operate.raycaster = raycaster
        el.onclick = operate.chooseBuilding
    },
}

export { operate }
