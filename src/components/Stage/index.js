import { useEffect, useRef } from 'react'
import { useRecoilValue } from 'recoil'
import { stepAtom } from '../../App'
import { Board, constant, startGame } from '../../game'
import { store } from '../store'
import style from './stage.module.css'

function Stage() {
    const ref = useRef(null)
    const step = useRecoilValue(stepAtom)

    useEffect(() => {
        startGame(ref.current, store.up, store.cityData)
    }, [])

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
