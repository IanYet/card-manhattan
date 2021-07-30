const constant = {
    VIEW_MODE: 0,
    OPER_MODE: 1,

    TEMP_FLOOR: 0,
    REAL_FLOOR: 1,

    CITY_GROUP: 'city',
    AREA_GROUP: 'area',
    BUILDING_GROUP: 'building',
    GRID_GROUP: 'grid',
    FLOOR_GROUP: 'floor',

    COLOR_MAP: {
        red: '#f5e1da',
        yellow: '#ffe194',
        green: '#c9e4c5',
        blue: '#d0e8f2',
    },
    WS_TYPE: {
        setColor: 'setColor',
        chat: 'chat',
        step: 'step',
        error: 'error',
    },
}

const status = {
    areas: [],
    buildings: [],
    floors: [],
    oriViewState: {
        camera: {},
        controls: {},
    },
    mode: constant.VIEW_MODE,
    playedChess: '',
    playedCard: [],
}

export { status, constant }
