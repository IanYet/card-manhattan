import axios from 'axios'

const constant = {
    VIEW_MODE: 0,
    OPER_MODE: 1,

    CITY_GROUP: 'city',
    AREA_GROUP: 'area',
    BUILDING_GROUP: 'building',
    GRID_GROUP: 'grid',
    FLOOR_GROUP: 'floor',
}

const status = {
    url: '',
    key: '',
    up: 0,
    cityData: {},
    areas: [],
    buildings: [],
    floors:[],
    oriViewState: {
        camera: {},
        controls: {},
    },

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

export { status, constant }
