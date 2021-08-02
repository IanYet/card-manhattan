const utils = {
    disposeAll(obj) {
        // console.log(obj)
        if (!obj) return

        while (obj.children.length > 0) {
            utils.disposeAll(obj.children[0])
            obj.remove(obj.children[0])
        }
        if (obj.geometry) obj.geometry.dispose()

        if (obj.material) {
            //in case of map, bumpMap, normalMap, envMap ...
            Object.keys(obj.material).forEach((prop) => {
                if (!obj.material[prop]) return
                if (
                    obj.material[prop] !== null &&
                    typeof obj.material[prop].dispose === 'function'
                )
                    obj.material[prop].dispose()
            })
            obj.material.dispose()
        }
    },

    rotateUp(pos, up) {
        const [x, y] = pos
        const corner = [
            [0, 0],
            [0, 2],
            [2, 2],
            [2, 0],
        ]
        const middle = [
            [0, 1],
            [1, 2],
            [2, 1],
            [1, 0],
        ]

        const cornerIdx = corner.findIndex(([a, b]) => a === x && b === y)
        const middleIdx = middle.findIndex(([a, b]) => a === x && b === y)

        if (middleIdx !== -1) {
            return middle[(middleIdx + Number(up)) % 4]
        } else if (cornerIdx !== -1) {
            return corner[(cornerIdx + Number(up)) % 4]
        } else {
            return pos
        }
    },
}

export { utils }
