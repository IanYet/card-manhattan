import axios from 'axios'

const net = {
    url: '',
    key: '',
    setUrl: (url) => (net.url = url),
    setKey: (key) => (net.key = key),
    getBoard: async () => axios.get(`${net.url}board.json?key=${net.key}`),
}

export { net }
