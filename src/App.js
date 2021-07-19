import { useEffect } from 'react'
import { atom, useRecoilState } from 'recoil'
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

function App() {
    const [isReady, readyGo] = useRecoilState(readyAtom)

    useEffect(() => {
        net.setUrl('./')
        net.setKey('123')
        net.getInitData().then(() => {
            readyGo(true)
        })
    }, [readyGo])

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

export { readyAtom }
export default App
