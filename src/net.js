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
            console.log(data.data)
            store.cityData = data.data.cityData
            store.cardData = data.data.cardData
            store.chessData = data.data.chessData
            store.up = data.data.up
            store.color = data.data.color
            store.userId = data.data.userId
            net.setId(store.userId)
            store.leftChessData = data.data.leftChessData
            store.playedData = data.data.playedData
        }),
    getStep: async () => axios.get(`${net.url}step.json?key=${net.key}`),
    postRoundChess: async () =>
        axios.get(`${net.url}mock.json?key=${net.key}&id=${net.id}`),
    //mock websocket data
     
}

export { net }
