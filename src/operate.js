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

    choose: (type, objs) => (ev) => {
        const subMesh = operate.raycaster.intersectObjects(objs, true)[0]
            ?.object

        if (!subMesh) return

        const group = findGroup(subMesh, type)
    },
    /**
     *
     * @param {HTMLElement} el
     * @param {Raycaster} raycaster
     */
    start(el, raycaster) {
        operate.raycaster = raycaster
        el.onclick = operate.choose(constant.FLOOR_GROUP, status.floors)
    },
}

export { operate }
