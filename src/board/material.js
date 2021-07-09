import { MeshStandardMaterial } from 'three'

const girdMatrial = new MeshStandardMaterial({
    color: 0xE7DFD5,
    
})

const chessMatrialMap = {
    red: new MeshStandardMaterial({ color: 0xF5E1DA }),
    yellow: new MeshStandardMaterial({ color: 0xF9D56E }),
    green: new MeshStandardMaterial({ color: 0xA3D2CA }),
    blue: new MeshStandardMaterial({ color: 0xD0E8F2 }),
}

export { girdMatrial, chessMatrialMap }
