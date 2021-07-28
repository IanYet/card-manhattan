import { useState, useRef, useEffect } from 'react/cjs/react.development'
import { constant } from '../../game'
import { net } from '../../net'
import { store } from '../store'
import style from './chatroom.module.css'

function Chatroom() {
    const [isSpread, toggleSpread] = useState(false)
    const [inputMsg, setInputMsg] = useState('')
    const [msgList, setMsgList] = useState([])
    const listRef = useRef(null)

    useEffect(() => {
        const preOnMessage = net.ws.onmessage
        net.ws.onmessage = (ev) => {
            preOnMessage(ev)
            const { type, payload } = JSON.parse(ev.data)
            if (type === constant.WS_TYPE.chat) {
                setMsgList((msgList) => [
                    ...msgList,
                    { color: payload.color, value: payload.message },
                ])
                setInputMsg('')
            }
        }
    }, [])

    useEffect(() => {
        listRef.current.scrollTop = listRef.current.scrollHeight
    }, [msgList, listRef])

    return (
        <div className={`${style.chatroom} ${style[store.color]}`}>
            <div
                className={`${style.symbol} ${isSpread ? style.spread : ''}`}
                onClick={(ev) => toggleSpread(!isSpread)}>
                &#xe901;
            </div>
            <div>
                <div className={`${style.popList}`} ref={listRef}>
                    {msgList.map((msg, idx) => (
                        <div
                            key={msg.value + idx}
                            className={`${style.pop} ${style[msg.color]} ${
                                msg.color === store.color ? style.self : ''
                            } ${isSpread ? '' : style.collapse}`}>
                            {msg.value}
                        </div>
                    ))}
                </div>
                <input
                    className={`${style.input}  ${
                        isSpread ? '' : style.collapse
                    }`}
                    onChange={(ev) => setInputMsg(ev.target.value)}
                    onKeyDown={(ev) => {
                        if (ev.key === 'Enter') {
                            net.ws.send(
                                JSON.stringify({
                                    type: constant.WS_TYPE.chat,
                                    roomKey: net.key,
                                    payload: {
                                        userId: store.userId,
                                        message: inputMsg,
                                    },
                                })
                            )
                            // setMsgList([
                            //     ...msgList,
                            //     { color: store.color, value: inputMsg },
                            // ])
                            // setInputMsg('')
                        }
                    }}
                    value={inputMsg}
                />
            </div>
        </div>
    )
}

export { Chatroom }
