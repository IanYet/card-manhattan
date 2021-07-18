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

export { cardDataSelector }
