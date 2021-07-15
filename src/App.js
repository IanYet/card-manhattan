import { useEffect } from 'react'
import './App.css'
import { Stage } from './components/Stage'
import { status as gameStatus } from './game'

function App() {
    useEffect(() => {
        gameStatus.setUrl('./')
        gameStatus.setKey('123')
    }, [])

    return (
        <div className='App'>
            <Stage />
        </div>
    )
}

export default App
