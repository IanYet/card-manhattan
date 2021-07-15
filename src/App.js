import { useEffect } from 'react'
import './App.css'
import { Chatroom } from './components/Chatroom'
import { DashBoard } from './components/DashBoard'
import { InfoPanel } from './components/InfoPanel'
import { Stage } from './components/Stage'
import { status as gameStatus } from './game'

function App() {
    useEffect(() => {
        gameStatus.setUrl('./')
        gameStatus.setKey('123')
    }, [])

    return (
        <div className='App'>
            <Chatroom />
            <DashBoard />
            <InfoPanel />
            <Stage />
        </div>
    )
}

export default App
