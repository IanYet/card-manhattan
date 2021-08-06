import { useEffect, useRef } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { stepAtom } from '../../App'
import { Board, constant, operate, startGame } from '../../game'
import { net } from '../../net'
import { playedDataAtom } from '../Chatroom'
import { userInfoAtom } from '../InfoPanel'
import { store } from '../store'
import style from './stage.module.css'

function Stage() {
    const ref = useRef(null)
    const step = useRecoilValue(stepAtom)
    const setPlayedData = useSetRecoilState(playedDataAtom)
    const setUserInfo = useSetRecoilState(userInfoAtom)

    useEffect(() => {
        startGame(ref.current, store.up, store.cityData)

        const preOnmessage = net.ws.onmessage
        net.ws.onmessage = (ev) => {
            console.log('stage.js 20')
            if (preOnmessage) preOnmessage(ev)
            const { type, payload } = JSON.parse(ev.data)

            if (type === constant.WS_TYPE.step) {
                if (payload.playedData) {
                    setPlayedData(payload.playedData)
                    store.playedData = payload.playedData
                }
                if (payload.play) {
                    const { floor, card, area, up } = payload.play
                    operate.play(floor, card, area, up)
                }
                if (payload.cityData) {
                    store.cityData = payload.cityData
                }
                if (payload.users) {
                    store.userList.forEach((user, idx) => {
                        const newUser = payload.users.find(
                            (pu) => pu.color === user.color
                        )
                        user = { ...user, ...newUser }
                    })

                    setUserInfo(store.userList)
                }
            }
        }
    }, [setPlayedData, setUserInfo])

    useEffect(() => {
        if (step.replace('_turn', '') === store.color) {
            Board.changeMode(constant.OPER_MODE)
        } else {
            Board.changeMode(constant.VIEW_MODE)
        }
    }, [step])
    return <div ref={ref} className={`${style.stage}`}></div>
}

export { Stage }
