import TWEEN, { Tween } from '@tweenjs/tween.js'
import { Board } from './Board'
import { checkBuildable } from './calc'
import { addFloor, generateFloor, removeFloor } from './draw'
import { constant, status } from './status'
import { utils } from './utils'

const findGroup = (object, groupType) => {
    if (!object.parent) return null

    if (object.type === 'Group' && object.userData.type === groupType) {
        return object
    } else {
        return findGroup(object.parent, groupType)
    }
}

const operate = {
    raycaster: null,
    intersectObject: null,
    tempFloor: null,
    pointerDownTime: 0,

    choose(objs, type) {
        const subMesh = operate.raycaster.intersectObjects(objs, true)[0]
            ?.object

        if (!subMesh) return null

        return findGroup(subMesh, type)
    },

    handleViewModeMove(ev) {
        if (status.mode === constant.OPER_MODE) return

        const floor = operate.choose(status.floors, constant.FLOOR_GROUP)

        if (operate.intersectObject === floor) return

        if (operate.intersectObject) {
            const tweenShrink = new Tween(operate.intersectObject.scale)
                .easing(TWEEN.Easing.Circular.In)
                .to({ x: 1, y: 1, z: 1 }, 150)
            tweenShrink.start()
        }

        if (floor) {
            const tweenSpread = new Tween(floor.scale)
                .easing(TWEEN.Easing.Circular.Out)
                .to({ x: 1.1, y: 1.1, z: 1.1 }, 150)
            tweenSpread.start()
        }
        operate.intersectObject = floor
    },

    handleOperModeMove(ev) {
        if (status.mode === constant.VIEW_MODE) return

        const area = operate.choose(status.areas, constant.AREA_GROUP)

        if (operate.intersectObject === area) return

        const [x, y] = status.playedCard

        if (operate.intersectObject) {
            const preBuilding = operate.intersectObject.children.find(
                (b) =>
                    b.userData.id ===
                    `${operate.intersectObject.userData.id}-${x}-${y}`
            )
            removeFloor(preBuilding, operate.tempFloor)
        }

        if (area) {
            const building = area.children.find(
                (b) => b.userData.id === `${area.userData.id}-${x}-${y}`
            )
            if (
                checkBuildable(
                    building.userData.data,
                    operate.tempFloor.userData.data
                )
            )
                addFloor(building, operate.tempFloor)
        }
        operate.intersectObject = area
    },

    handlePointerUp(ev) {
        const time = ev.timeStamp - operate.pointerDownTime
        if (time >= 120) return

        if (ev.button === 0) {
            if (status.mode === constant.VIEW_MODE) return
            Board.changeMode(constant.VIEW_MODE)
        } else if (ev.button === 2) {
            Board.changeMode(constant.OPER_MODE)
        }
    },
    handlePointerDown(ev) {
        operate.pointerDownTime = ev.timeStamp
    },

    createTempFloor() {
        if (!status.playedCard.length && !status.playedChess) return

        if (operate.tempFloor) {
            operate.tempFloor = null
            utils.disposeAll(operate.tempFloor)
        }

        const floorData = status.playedChess
        const floor = generateFloor(floorData, constant.TEMP_FLOOR)
        this.tempFloor = floor
    },

    disposeTempFloor() {
        if (operate.tempFloor) utils.disposeAll(operate.tempFloor)
    },

    /**
     *
     * @param {HTMLElement} el
     * @param {Raycaster} raycaster
     */
    start(el, raycaster) {
        operate.raycaster = raycaster
        el.addEventListener('pointermove', operate.handleViewModeMove)
        el.addEventListener('pointermove', operate.handleOperModeMove)
        el.addEventListener('pointerdown', this.handlePointerDown)
        el.addEventListener('pointerup', this.handlePointerUp)
    },

    reset() {
        operate.pointerDownTime = 0
        operate.intersectObject = null
    },
}

export { operate }
