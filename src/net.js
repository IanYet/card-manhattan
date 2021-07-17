import axios from 'axios'
import { store } from './components/store'

const net = {
    url: '',
    key: '',
    id: '',

    setUrl: (url) => (net.url = url),
    setKey: (key) => (net.key = key),
    setId: (id) => (net.id = id),
    getInitData: async () =>
        axios.get(`${net.url}data.json?key=${net.key}`).then((data) => {
            store.cityData = data.data.cityData
            store.cardData = data.data.cardData
            store.chessData = data.data.chessData
            store.up = data.data.up
            store.color = data.data.color
        }),
}

export { net }
