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
    waiting: 'waiting',
    pre_round: 'pre_round',
    your_turn: 'your_ turn',
    other_turn: 'other_turn',
    round_end: 'round_end',
    end: 'game_end',
}

const stepAtom = atom({
    key: 'step-atom',
    default: STEP.pre_round,
})

function App() {
    const [isReady, readyGo] = useRecoilState(readyAtom)
    const setStep = useSetRecoilState(stepAtom)

    useEffect(() => {
        const roomKey = window.location.pathname.split('/')[1]
        const userId = window.location.search.split('=')[1]

        net.setUrl('http://localhost:9000/')
        net.setKey(roomKey)
        net.setId(userId)
        net.getInitData()
            .then(() => {
                readyGo(true)
                net.setWs('ws://localhost:9000/')
            })
            .then((data) => {
                // setStep(data.data.step)
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
