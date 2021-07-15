import { useEffect, useRef } from 'react'
import { startGame } from '../../game'
import style from './stage.module.css'

function Stage() {
    const ref = useRef(null)

    useEffect(() => {
        startGame(ref.current)
    }, [])

    return <div ref={ref} className={`${style.stage}`}></div>
}

export { Stage }
