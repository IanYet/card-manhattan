import { useEffect, useRef } from 'react'
import { startGame } from '../../game'
import { store } from '../store'
import style from './stage.module.css'

function Stage(props) {
    const ref = useRef(null)

    useEffect(() => {
        if (props.render) {
            startGame(ref.current, store.up, store.cityData)
        }
    }, [props])

    return <div ref={ref} className={`${style.stage}`}></div>
}

export { Stage }
