const utils = {
    disposeAll(obj) {
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
}

export { utils }
