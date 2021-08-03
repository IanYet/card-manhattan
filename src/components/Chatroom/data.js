import { atom } from 'recoil'
import { store } from '../store'

const msgListAtom = atom({
    key: 'msgListStom',
    default: [],
})

const playedDataAtom = atom({
    key: 'played-data-atom',
    default: store.playedData,
})

export { msgListAtom, playedDataAtom }
