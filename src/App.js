import { useEffect } from 'react'
import { atom, useRecoilState, useSetRecoilState } from 'recoil'
import './App.css'
import { Chatroom } from './components/Chatroom'
import { DashBoard } from './components/DashBoard'
import { InfoPanel } from './components/InfoPanel'
import { Stage } from './components/Stage'
import { net } from './net'

const readyAtom = atom({
    default: false,
    key: 'ready-atom',
})

const STEP = {
    pre_round: 'pre_round',
    your_turn: 'your_ turn',
    other_turn: 'other_turn',
    round_end: 'round_end',
    game_end: 'game_end',
}

const stepAtom = atom({
    key: 'step-atom',
    default: STEP.pre_round,
})

function App() {
    const [isReady, readyGo] = useRecoilState(readyAtom)
    const setStep = useSetRecoilState(stepAtom)

    useEffect(() => {
        net.setUrl('./')
        net.setKey('123')
        net.getInitData()
            .then(() => {
                readyGo(true)
                return net.getStep()
            })
            .then((data) => {
                setStep(data.data.step)
            })
    }, [readyGo, setStep])

    return (
        <div className='App'>
            {isReady ? (
                <>
                    <Chatroom />
                    <DashBoard />
                    <InfoPanel />
                    <Stage />
                </>
            ) : null}
        </div>
    )
}

export { readyAtom, stepAtom, STEP }
export default App
