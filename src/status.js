import axios from 'axios'

const status = {
    url: '',
    key: '',
    up: '',
    cityData: '',
    areas: [],
    buildings: [],
    setUrl: (url) => (status.url = url),
    setKey: (key) => (status.key = key),
    getCity: async () =>
        axios.get(`${status.url}board.json?key=${status.key}`).then((data) => {
            status.cityData = data.data.city
            return status.cityData
        }),
    getUp: async () =>
        axios.get(`${status.url}up.json?key=${status.key}`).then((data) => {
            status.up = data.data.up
            return status.up
        }),
}

export { status }
