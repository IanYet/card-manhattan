import {
    BackSide,
    CanvasTexture,
    Color,
    DoubleSide,
    MeshBasicMaterial,
    MeshLambertMaterial,
    TextureLoader,
} from 'three'

const girdMatrial = new MeshLambertMaterial({
    color: new Color('rgb(255,255,255)'),
})

const girdMatrial0 = new MeshLambertMaterial({
    alphaMap: new TextureLoader().load('./alpha.png'),
    transparent: true,
    depthWrite: false,
})

const chessMatrialMap = {
    red: new MeshLambertMaterial({ color: 0xf5e1da }),
    yellow: new MeshLambertMaterial({ color: 0xffe194 }),
    green: new MeshLambertMaterial({ color: 0xc9e4c5 }),
    blue: new MeshLambertMaterial({ color: 0xd0e8f2 }),
}

const tempChessMaterialMap = {
    red: new MeshLambertMaterial({
        color: 0xf5e1da,
        transparent: true,
        opacity: 0.5,
    }),
    yellow: new MeshLambertMaterial({
        color: 0xffe194,
        transparent: true,
        opacity: 0.5,
    }),
    green: new MeshLambertMaterial({
        color: 0xc9e4c5,
        transparent: true,
        opacity: 0.5,
    }),
    blue: new MeshLambertMaterial({
        color: 0xd0e8f2,
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
