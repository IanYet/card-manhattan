import axios from 'axios'
import { store } from './components/store'
import { constant } from './game'

const net = {
    url: '',
    key: '',
    id: '',
    ws: null,

    setUrl: (url) => (net.url = url),
    setKey: (key) => (net.key = key),
    setId: (id) => (net.id = id),
    getInitData: async () =>
        axios.get(`${net.url}${net.key}/data?userId=${net.id}`).then((data) => {
            store.cityData = data.data.cityData
            store.cardData = data.data.cardData
            store.chessData = data.data.chessData
            store.up = data.data.up
            store.color = data.data.color
            store.userId = data.data.userId
            store.leftChessData = data.data.leftChessData
            store.playedData = data.data.playedData
            store.userList = data.data.userList
        }),
    setWs: (url) => {
        const ws = new WebSocket(url)
        net.ws = ws
        ws.onopen = () => {
            ws.send(
                JSON.stringify({
                    type: constant.WS_TYPE.setColor,
                    roomKey: net.key,
                    payload: {
                        userId: store.userId,
                    },
                })
            )
        }
        ws.onmessage = (ev) => {
            console.log(JSON.parse(ev.data))
        }
    },
    postRoundChess: async (postData) =>
        axios.post(`${net.url}${net.key}/postRoundChess`, postData),
    //mock websocket data
}

export { net }
