import {
    BackSide,
    CanvasTexture,
    Color,
    DoubleSide,
    MeshBasicMaterial,
    MeshLambertMaterial,
    MeshStandardMaterial,
    Texture,
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
    red: new MeshStandardMaterial({ color: 0xe29587 }),
    yellow: new MeshStandardMaterial({ color: 0xf9d56e }),
    green: new MeshStandardMaterial({ color: 0xa3d2ca }),
    blue: new MeshStandardMaterial({ color: 0xd0e8f2 }),
}

const windowMaterial = new MeshStandardMaterial({
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
    windowMaterial,
    skyMaterial,
}
