import {
    BackSide,
    CanvasTexture,
    Color,
    DoubleSide,
    MeshBasicMaterial,
    MeshLambertMaterial,
    TextureLoader,
} from 'three'
import { constant } from './status'

const girdMatrial = new MeshLambertMaterial({
    color: new Color('rgb(255,255,255)'),
})

const girdMatrial0 = new MeshLambertMaterial({
    alphaMap: new TextureLoader().load('./alpha.png'),
    transparent: true,
    depthWrite: false,
})

const chessMatrialMap = {
    red: new MeshLambertMaterial({ color: constant.COLOR_MAP.red }),
    yellow: new MeshLambertMaterial({ color: constant.COLOR_MAP.yellow }),
    green: new MeshLambertMaterial({ color: constant.COLOR_MAP.green }),
    blue: new MeshLambertMaterial({ color: constant.COLOR_MAP.blue }),
}

const tempChessMaterialMap = {
    red: new MeshLambertMaterial({
        color: constant.COLOR_MAP.red,
        transparent: true,
        opacity: 0.5,
    }),
    yellow: new MeshLambertMaterial({
        color: constant.COLOR_MAP.yellow,
        transparent: true,
        opacity: 0.5,
    }),
    green: new MeshLambertMaterial({
        color: constant.COLOR_MAP.green,
        transparent: true,
        opacity: 0.5,
    }),
    blue: new MeshLambertMaterial({
        color: constant.COLOR_MAP.blue,
        transparent: true,
        opacity: 0.5,
    }),
}

const windowMaterial = new MeshLambertMaterial({
    color: 0xffffff,
    opacity: 0.8,
    transparent: true,
    emissive: 0xffffff,
    emissiveIntensity: 1,
    side: DoubleSide,
})

const skyMaterial = new MeshBasicMaterial({
    map: generateTexture('#9cacd0', '#e3c3cb', 512, 256),
    side: BackSide,
})

function generateTexture(color1, color2, width, height) {
    const cav = document.createElement('canvas')
    cav.height = height
    cav.width = width
    const ctx = cav.getContext('2d')
    const gra = ctx.createLinearGradient(0, 0, 0, height)
    gra.addColorStop(0, color2)
    gra.addColorStop(0.9, color1)

    ctx.fillStyle = gra
    ctx.fillRect(0, 0, width, height)

    return new CanvasTexture(cav)
}
export {
    girdMatrial,
    girdMatrial0,
    chessMatrialMap,
    tempChessMaterialMap,
    windowMaterial,
    skyMaterial,
}
