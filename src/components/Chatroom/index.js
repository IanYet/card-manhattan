import { useState, useRef, useEffect } from 'react/cjs/react.development'
import { useRecoilState, atom } from 'recoil'
import { constant } from '../../game'
import { net } from '../../net'
import { store } from '../store'
import style from './chatroom.module.css'

const msgListAtom = atom({
    key: 'msgListStom',
    default: [],
})

function Chatroom() {
    const [isSpread, toggleSpread] = useState(false)
    const [inputMsg, setInputMsg] = useState('')
    const [msgList, setMsgList] = useRecoilState(msgListAtom)
    const [isChatChannel, toggleChannel] = useState(true)
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
    }, [setMsgList])

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
                <div
                    className={`${style.inputContainer}   ${
                        isSpread ? '' : style.collapse
                    }`}>
                    <div className={`${style.channelTitle}`}>
                        {isChatChannel ? '聊天' : '记录'}
                    </div>
                    <input
                        className={`${style.input}`}
                        onChange={(ev) => {
                            if (!isChatChannel) return
                            setInputMsg(ev.target.value)
                        }}
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
                            } else if (ev.key === 'Tab') {
                                ev.preventDefault()
                                toggleChannel(!isChatChannel)
                            }
                        }}
                        value={inputMsg}
                        placeholder={'按tab切换频道'}
                    />
                </div>
            </div>
        </div>
    )
}

export { Chatroom, msgListAtom }
