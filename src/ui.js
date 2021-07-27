import axios from 'axios'

const store = {
    colorMap: {
        red: '#f5e1da',
        yellow: '#ffe194',
        green: '#c9e4c5',
        blue: '#d0e8f2',
    },
    roomkey: '',
    isHost: false,
    self: {},
    user: [],
    queryIntervalId: '',
    roomStatus: '',
}

function ui() {
    const control = {
        createRoom: () => {
            if (store.self.userId) return
            store.isHost = true

            const board = document.querySelector('#board')
            const keyInput = document.querySelector('#keyInput')
            const inputMsg = document.querySelector('#inputMsg')

            axios
                .get('http://localhost:9000/createRoom')
                .then((data) => {
                    const { roomKey, color, userId } = data.data
                    store.self = { color, userId }
                    store.roomkey = roomKey

                    keyInput.value = roomKey
                    keyInput.disabled = true
                    board.style.bottom = '0'
                    inputMsg.innerText = '请把房间码分享给好友吧'

                    const seat0 = document.querySelector('#seat0')
                    seat0.style.backgroundColor = store.colorMap[color]

                    document.querySelector('#startGame').style.display = 'block'
                    document.querySelector('#joinGame').style.display = 'none'
                    store.queryIntervalId = control.queryStatus()
                })
                .catch(() => {
                    alert('网络问题，请重试')
                })
        },
        joinRoom: () => {
            if (store.self.userId) return
            store.isHost = false
            const board = document.querySelector('#board')

            board.style.bottom = '0'
            document.querySelector('#startGame').style.display = 'none'
            document.querySelector('#joinGame').style.display = 'block'
        },
        joinGame: () => {
            if (store.self.userId) return

            const keyInput = document.querySelector('#keyInput')
            const inputMsg = document.querySelector('#inputMsg')

            const roomKey = keyInput.value
            if (roomKey.length < 4 || isNaN(roomKey))
                return (inputMsg.innerText = '房间码格式不正确')

            axios
                .get(`http://localhost:9000/${roomKey}/join`)
                .then((data) => {
                    if (data.data.userId) {
                        const { color, userId, user } = data.data
                        store.self = { color, userId }
                        store.roomkey = roomKey

                        keyInput.disabled = true
                        inputMsg.innerText = '正在等待其他玩家'

                        const seat0 = document.querySelector('#seat0')
                        seat0.style.backgroundColor = store.colorMap[color]

                        user.filter((oc) => oc !== store.self.color).forEach(
                            (oc, idx) => {
                                document.querySelector(
                                    `#seat${idx + 1}`
                                ).style.backgroundColor = store.colorMap[oc]
                            }
                        )

                        store.queryIntervalId = control.queryStatus()
                    } else {
                        inputMsg.innerText = data.data
                    }
                })
                .catch(() => {
                    inputMsg.innerText = '网络问题，请重试'
                })
        },
        startGame: (ev) => {
            const inputMsg = document.querySelector('#inputMsg')

            if (store.user.length < 3) {
                return (inputMsg.innerText = '人数不足，再等等吧')
            }

            axios
                .get(`http://localhost:9000/${store.roomkey}/start`)
                .then((data) => {
                    if (data.data === 'ok') {
                        clearInterval(store.queryIntervalId)
                        //翻页
                    } else {
                        inputMsg.innerText = data.data
                    }
                })
                .catch(() => {
                    inputMsg.innerText = '网络问题，请重试'
                })
        },
        queryStatus: () => {
            const inputMsg = document.querySelector('#inputMsg')

            return setInterval(() => {
                axios
                    .get(`http://localhost:9000/${store.roomkey}/status`)
                    .then((data) => {
                        const { roomStatus, user } = data.data
                        if (!roomStatus) {
                            return Promise.reject({
                                code: 10086,
                                err: data.data,
                            })
                        }
                        store.roomStatus = roomStatus
                        store.user = user

                        user.filter(
                            (color) => color !== store.self.color
                        ).forEach((color, idx) => {
                            document.querySelector(
                                `#seat${idx + 1}`
                            ).style.backgroundColor = store.colorMap[color]
                        })
                    })
                    .then(() => {
                        if (store.user.length >= 3) {
                            inputMsg.innerText = store.isHost
                                ? '人数已达最低人数，快点开始游戏吧'
                                : '人数已达最低人数，快点提醒房主开始游戏吧'
                        }
                    })
                    .catch((err) => {
                        clearInterval(store.queryIntervalId)
                        setTimeout(() => {
                            control.reset()
                        }, 3000)
                        if (err.code === 10086) {
                            inputMsg.innerText = err.err
                        } else {
                            inputMsg.innerText = '网络已丢失，请重新加入房间'
                        }
                    })
            }, 5000)
        },
        reset: () => {
            store.roomkey = ''
            store.self = {}
            store.user = []
            store.isHost = false
            store.queryIntervalId = ''
            store.roomStatus = ''

            const board = document.querySelector('#board')
            const keyInput = document.querySelector('#keyInput')
            const inputMsg = document.querySelector('#inputMsg')

            inputMsg.innerText = ''
            keyInput.disabled = false
            keyInput.value = ''

            board.style.bottom = '-21rem'

            for (let i = 0; i < 4; i++) {
                document.querySelector(`#seat${i}`).style.backgroundColor =
                    '#fff'
            }
        },
    }
    board(control)
    title()
    btns(control)
}

function title() {
    const titleContainer = document.createElement('div')
    const title = document.createElement('div')
    const subTitle = document.createElement('div')
    titleContainer.append(title, subTitle)

    title.innerText = 'Manhattan'
    subTitle.innerText = 'build you dream city'
    document.body.append(titleContainer)

    titleContainer.style.color = '#ffffff'
    titleContainer.style.zIndex = 100
    titleContainer.style.position = 'fixed'
    titleContainer.style.top = '10vh'
    titleContainer.style.width = '100vw'
    titleContainer.style.textAlign = 'center'
    titleContainer.style.userSelect = 'none'

    title.style.fontSize = '3rem'
    title.style.marginBottom = '1rem'
    subTitle.style.fontSize = '1rem'
    subTitle.style.fontWeight = 'bold'
}

function btns(control) {
    const footer = document.createElement('div')
    footer.className = 'footer'
    const btnContainer = document.createElement('div')
    btnContainer.className = 'btnContainer'
    footer.append(btnContainer)

    const createBtn = document.createElement('div')
    createBtn.className = 'btn createBtn'
    createBtn.innerText = '创建房间'
    createBtn.onclick = control.createRoom

    const joinBtn = document.createElement('div')
    joinBtn.className = 'btn joinBtn'
    joinBtn.innerText = '加入房间'
    joinBtn.onclick = control.joinRoom
    btnContainer.append(createBtn, joinBtn)

    const knowLink = document.createElement('div')
    knowLink.className = 'link'
    knowLink.innerText = '了解规则'
    footer.append(knowLink)

    document.body.append(footer)
}

function board(control) {
    const board = document.createElement('div')
    board.className = 'board'
    board.id = 'board'
    document.body.append(board)

    /*-------------------------------*/
    const top = document.createElement('div')
    top.className = 'top'
    board.append(top)

    const knowLink = document.createElement('div')

    const collapse = document.createElement('div')
    collapse.className = 'collapse'
    collapse.innerText = '收起'

    const show = document.createElement('div')
    show.className = 'collapse'
    show.innerText = '展开'
    show.style.display = 'none'
    top.append(knowLink, collapse, show)

    collapse.onclick = () => {
        board.style.bottom = '-17rem'
        show.style.display = 'block'
        collapse.style.display = 'none'
    }
    show.onclick = () => {
        board.style.bottom = '0rem'
        collapse.style.display = 'block'
        show.style.display = 'none'
    }

    /*-------------------------------*/
    const inputArea = document.createElement('div')
    inputArea.className = 'inputArea'
    board.append(inputArea)

    const keyInput = document.createElement('input')
    keyInput.className = 'key'
    keyInput.id = 'keyInput'
    keyInput.placeholder = '输入房间码'
    keyInput.onkeydown = (ev) => {
        ev.preventDefault()

        const ipt = ev.currentTarget
        if (ev.key === 'Backspace' || ev.key === 'Escape') {
            ipt.value = ''
        } else if (!isNaN(ev.key) && ipt.value.length < 4) {
            ipt.value = ipt.value + ev.key
        }
    }

    const inputMsg = document.createElement('div')
    inputMsg.className = 'inputMsg'
    inputMsg.id = 'inputMsg'
    inputMsg.innerText = ' '

    inputArea.append(keyInput, inputMsg)

    /*-------------------------------*/
    const seatArea = document.createElement('div')
    seatArea.className = 'seatArea'
    board.append(seatArea)

    for (let i = 0; i < 4; i++) {
        const seat = document.createElement('div')
        seat.id = `seat${i}`
        seatArea.append(seat)
        seat.className = 'seat'
    }

    /*-------------------------------*/
    const startGame = document.createElement('div')
    startGame.className = 'btn start'
    startGame.innerText = '开始游戏'
    startGame.id = 'startGame'
    startGame.onclick = control.startGame
    board.append(startGame)

    const joinGame = document.createElement('div')
    joinGame.className = 'btn start'
    joinGame.innerText = '加入房间'
    joinGame.id = 'joinGame'
    joinGame.onclick = control.joinGame
    board.append(joinGame)

    return board
}

export { ui }
