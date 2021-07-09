import {
    CanvasTexture,
    Color,
    DoubleSide,
    MeshBasicMaterial,
    MeshStandardMaterial,
} from 'three'

const girdMatrial = new MeshStandardMaterial({
    color: new Color('rgb(226,226,218)'),
    // emissive: new Color('rgb(226,226,218)'),
    // emissiveIntensity: 0.3,
    // opacity: 0.9,
    // transparent:true
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

function generateTexture(color1, color2) {
    const cav = document.createElement('canvas')
    cav.height = 512
    cav.width = 512
    const ctx = cav.getContext('2d')
    const gra = ctx.createLinearGradient(0, 0, 512, 0)
    gra.addColorStop(0, 'red')
    gra.addColorStop(1, 'blue')

    ctx.fillStyle = gra
    ctx.fillRect(0, 0, 512, 512)

    return new CanvasTexture(cav)
}

generateTexture()
export { girdMatrial, chessMatrialMap, windowMaterial }
