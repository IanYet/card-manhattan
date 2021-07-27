import axios from 'axios'

const net = {
    url: '',
    key: '',
    setUrl: (url) => (net.url = url),
    setKey: (key) => (net.key = key),
    getCity: async () => axios.get(`${net.url}board.json`),
}

export { net }
