import { atom, selector } from 'recoil'
import { store } from '../store'

const isRoundStartAtom = atom({
    key: 'is-round-start-atom',
    default: false,
})

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

        if (get(isRoundStartAtom)) {
            const chessMap = { 1: 0, 2: 0, 3: 0, 4: 0 }
            newValue.forEach((val) => (chessMap[val] += 1))
            for (let i = 1; i < 5; i++) {
                store.leftChessData[i] = store.leftChessData[i] - chessMap[i]
            }
            set(leftChessDataAtom, store.leftChessData)
        }
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
    isRoundStartAtom,
    tempMsgAtom,
}
