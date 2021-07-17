import { useEffect, useRef } from 'react'
import { startGame } from '../../game'
import { store } from '../store'
import style from './stage.module.css'

function Stage() {
    const ref = useRef(null)

    useEffect(() => {
        startGame(ref.current, store.up, store.cityData)
    }, [])

    return <div ref={ref} className={`${style.stage}`}></div>
}

export { Stage }
