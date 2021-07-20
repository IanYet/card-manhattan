import { useState, useRef, useEffect } from 'react/cjs/react.development'
import { store } from '../store'
import style from './chatroom.module.css'

function Chatroom() {
    const [isSpread, toggleSpread] = useState(false)
    const [inputMsg, setInputMsg] = useState('')
    const [msgList, setMsgList] = useState([
        { color: 'blue', value: '我是bulu' },
        { color: 'yellow', value: '我是yel' },
        { color: 'green', value: '我是gewen' },
    ])
    const listRef = useRef(null)

    useEffect(() => {
        listRef.current.scrollTop = listRef.current.scrollHeight
    }, [msgList, listRef])

    return (
        <div className={`${style.chatroom} ${style[store.color]}`}>
            <div
                className={`${style.symbol} ${isSpread ? style.spread : ''}`}
                onClick={(ev) => toggleSpread(!isSpread)}>
                &#xe900;
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
                            setMsgList([
                                ...msgList,
                                { color: store.color, value: inputMsg },
                            ])
                            setInputMsg('')
                        }
                    }}
                    value={inputMsg}
                />
            </div>
        </div>
    )
}

export { Chatroom }
