import { atom } from 'recoil'
import { store } from '../store'

const userInfoAtom = atom({
    default: store.userList,
    key: 'user-info-atom',
})

export { userInfoAtom }
