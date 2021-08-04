const STEP = {
    waiting: 'waiting',
    pre_round: 'pre_round',
    red_turn: 'red_turn',
    yellow_turn: 'yellow_turn',
    blue_turn: 'blue_turn',
    green_turn: 'green_turn',
    round_end: 'round_end',
    end: 'game_end',
}

const store = {
    up: 0,
    userId: '',
    color: '',
    step: STEP.pre_round,
    cityData: {},
    cardData: [],
    chessData: [],
    userList: [],

    leftChessData: {
        1: 11,
        2: 6,
        3: 4,
        4: 3,
    },
    playedData: {},
}

export { store, STEP }
