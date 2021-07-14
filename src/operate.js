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
    intersectObject: null,

    choose(objs, type) {
        const subMesh = operate.raycaster.intersectObjects(objs, true)[0]
            ?.object

        if (!subMesh) return

        return findGroup(subMesh, type)
    },
    handleViewModeMove(ev) {
        if (status.mode === constant.OPER_MODE) return

        const floor = operate.choose(status.floors, constant.FLOOR_GROUP)

        if (operate.intersectObject !== floor) {
            operate.intersectObject?.scale.set(1, 1, 1)
        }

        operate.intersectObject = floor
        operate.intersectObject?.scale.set(1.1, 1.1, 1.1)
    },
    handleOperModeMove(ev) {
        if (status.mode === constant.VIEW_MODE) return
        
        const area = operate.choose(status.areas, constant.AREA_GROUP)
        // const building = area.children.find(b => b.userData)
    },
    /**
     *
     * @param {HTMLElement} el
     * @param {Raycaster} raycaster
     */
    start(el, raycaster) {
        operate.raycaster = raycaster
        el.onpointermove = operate.handleViewModeMove
        // el.onclick = operate.choose(constant.FLOOR_GROUP, status.floors)
    },
}

export { operate }
