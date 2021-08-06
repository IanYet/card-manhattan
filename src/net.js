import axios from 'axios'
import { store } from './components/store'
import { constant, operate } from './game'

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
            store.userList = data.data.users.sort((a, b) => a.up - b.up)

            operate.up = store.up
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
        const preOnmessage = ws.onmessage
        ws.onmessage = (ev) => {
            console.log('net.js 44')
            if (preOnmessage) preOnmessage(ev)
            console.log(JSON.parse(ev.data))
        }
    },
    postRoundChess: async (postData) =>
        axios.post(`${net.url}${net.key}/postRoundChess`, postData),
    play: async (playData) => axios.post(`${net.url}${net.key}/play`, playData),
    postScore: async (scoreData) =>
        axios.post(`${net.url}${net.key}/score`, scoreData),
}

export { net }
