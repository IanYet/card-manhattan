import { useEffect, useState } from 'react'
import './App.css'
import { Chatroom } from './components/Chatroom'
import { DashBoard } from './components/DashBoard'
import { InfoPanel } from './components/InfoPanel'
import { Stage } from './components/Stage'
import { net } from './net'

function App() {
    const [renderStage, startRenderStage] = useState(false)
    useEffect(() => {
        net.setUrl('./')
        net.setKey('123')
        net.getInitData().then(() => {
            startRenderStage(true)
        })
    }, [])

    return (
        <div className='App'>
            <Chatroom />
            <DashBoard />
            <InfoPanel />
            <Stage render={renderStage} />
        </div>
    )
}

export default App
