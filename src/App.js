import { useEffect } from 'react'
import { atom, useRecoilState, useSetRecoilState } from 'recoil'
import './App.css'
import { Chatroom } from './components/Chatroom'
import { DashBoard } from './components/DashBoard'
import { tempMsgAtom } from './components/DashBoard/data'
import { InfoPanel } from './components/InfoPanel'
import { Stage } from './components/Stage'
import { store } from './components/store'
import { constant } from './game'
import { net } from './net'

const readyAtom = atom({
    default: false,
    key: 'ready-atom',
})

const stepAtom = atom({
    key: 'step-atom',
    default: store.step,
})

function App() {
    const [isReady, readyGo] = useRecoilState(readyAtom)
    const setStep = useSetRecoilState(stepAtom)
    const setTempMsg = useSetRecoilState(tempMsgAtom)

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
                const preOnmessage = net.ws.onmessage
                net.ws.onmessage = (ev) => {
                    preOnmessage(ev)
                    const { type, payload } = JSON.parse(ev.data)

                    if (type === constant.WS_TYPE.step) {
                        setStep(payload.step)
                        store.step = payload.step
                    }
                }
                // setStep(data.data.step)
            })
    }, [readyGo, setStep, setTempMsg])

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

export { readyAtom, stepAtom }
export default App
