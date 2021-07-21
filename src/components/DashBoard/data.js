import { atom, selector } from 'recoil'
import { store } from '../store'

const _cardData = atom({
    key: '_card-data',
    default: [...store.cardData],
})
const cardDataSelector = selector({
    key: 'card-data',
    get: ({ get }) => get(_cardData),
    set: ({ set }, newValue = [...store.cardData]) => {
        store.cardData = newValue
        set(_cardData, newValue)
    },
})

const _roundChessData = atom({
    key: '_round-chess-data',
    default: [...store.chessData],
})

const roundChessDataSelector = selector({
    key: 'round-chess-data',
    get: ({ get }) => get(_roundChessData),
    set: ({ set, get }, newValue = [...store.chessData]) => {
        store.chessData = newValue
        set(_roundChessData, newValue)
    },
})

const leftChessDataAtom = atom({
    default: store.leftChessData,
    key: '_left-chess-data',
})

const tempMsgAtom = atom({
    default: '',
    key: 'temp-msg-atom',
})

export {
    cardDataSelector,
    roundChessDataSelector,
    leftChessDataAtom,
    tempMsgAtom,
}
