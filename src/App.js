import { useEffect, useState } from 'react'
import './App.css'
import { Chatroom } from './components/Chatroom'
import { DashBoard } from './components/DashBoard'
import { InfoPanel } from './components/InfoPanel'
import { Stage } from './components/Stage'
import { net } from './net'

function App() {
    const [isRender, startRender] = useState(false)
    useEffect(() => {
        net.setUrl('./')
        net.setKey('123')
        net.getInitData().then(() => {
            startRender(true)
        })
    }, [])

    return (
        <div className='App'>
            {isRender ? (
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

export default App
