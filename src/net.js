import axios from 'axios'
import { store } from './components/store'

const net = {
    url: '',
    key: '',

    setUrl: (url) => (net.url = url),
    setKey: (key) => (net.key = key),
    getInitData: async () =>
        axios.get(`${net.url}data.json?key=${net.key}`).then((data) => {
            store.cityData = data.data.cityData
            store.cardData = data.data.cardData
            store.chessData = data.data.chessData
            store.up = data.data.up
        }),
}

export { net }
