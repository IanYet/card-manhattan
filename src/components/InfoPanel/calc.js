const calcScore = (cityData) => {
    console.log(cityData)
    const result = {
        red: 0,
        blue: 0,
        green: 0,
        yellow: 0,
    }

    //calc building score
    const highest = {
        height: 0,
        color: '',
    }

    Object.keys(cityData).forEach((areaId) => {
        const area = cityData[areaId]

        const areaRes = {
            red: 0,
            blue: 0,
            green: 0,
            yellow: 0,
        }

        for (let x = 0; x < 3; ++x) {
            for (let y = 0; y < 3; ++y) {
                let topColor = '',
                    height = 0

                area[x][y].forEach((floor, idx) => {
                    const [floorHeight, floorColor] = [
                        parseInt(floor),
                        floor.substr(1),
                    ]

                    height = height + floorHeight
                    if (idx === area[x][y].length - 1) topColor = floorColor
                })
                if (!topColor) continue

                if (height > highest.height) {
                    highest.height = height
                    highest.color = topColor
                } else if (height === highest.height) {
                    highest.color = ''
                }

                areaRes[topColor] += 1
                result[topColor] += 1
            }
        }

        const mostColor = {
            color: '',
            num: 0,
        }

        for (let a in areaRes) {
            if (areaRes[a] > mostColor.num) {
                mostColor.color = a
                mostColor.num = areaRes[a]
            } else if (areaRes[a] === mostColor.num) {
                mostColor.color = ''
            }
        }

        if (mostColor.color) {
            result[mostColor.color] += 3
        }
    })

    if (highest.color) {
        result[highest.color] += 5
    }

    return result
}

export { calcScore }
