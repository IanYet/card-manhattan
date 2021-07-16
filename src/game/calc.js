const checkBuildable = (buildingData, floorData) => {
    const parseFloorData = (data) => [data.substr(1), parseInt(data)]

    const colorMap = {
        red: 0,
        yellow: 0,
        blue: 0,
        green: 0,
        max: 0,
    }

    for (let data of buildingData) {
        const [color, height] = parseFloorData(data)
        colorMap[color] += height

        if (colorMap[color] >= colorMap.max) {
            colorMap.max = colorMap[color]
        }
    }

    const [newColor, newHeight] = parseFloorData(floorData)

    if (colorMap[newColor] + newHeight >= colorMap.max) return true
    else return false
}

export { checkBuildable }
