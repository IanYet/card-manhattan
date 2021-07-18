import { useEffect, useState } from 'react'
import { RecoilRoot } from 'recoil'
import './App.css'
import { Chatroom } from './components/Chatroom'
import { DashBoard } from './components/DashBoard'
import { InfoPanel } from './components/InfoPanel'
import { Stage } from './components/Stage'
import { store } from './components/store'
import { net } from './net'

function App() {
    const [isRender, startRender] = useState(false)
    useEffect(() => {
        net.setUrl('./')
        net.setKey('123')
        net.getInitData().then(() => {
            console.log(store)
            startRender(true)
        })
    }, [])

    return (
        <div className='App'>
            {isRender ? (
                <RecoilRoot>
                    <Chatroom />
                    <DashBoard />
                    <InfoPanel />
                    <Stage />
                </RecoilRoot>
            ) : null}
        </div>
    )
}

export default App
