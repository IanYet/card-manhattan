import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { readyAtom } from '../../App'
import { store } from '../store'
import { Card } from './Card'
import style from './dashBoard.module.css'
import {
    cardDataSelector,
    leftChessDataAtom,
    roundChessDataSelector,
} from './data'

function DashBoard() {
    const [cardData, setCardData] = useRecoilState(cardDataSelector)
    const [roundChessData, setRoundChessData] = useRecoilState(
        roundChessDataSelector
    )
    const leftChessData = useRecoilValue(leftChessDataAtom)
    const [selectedCard, setSelectedCard] = useState(-2)
    const [hoveredCard, setHoveredCard] = useState(-2)
    const isReady = useRecoilValue(readyAtom)

    useEffect(() => {
        console.log(roundChessData, leftChessData)
    }, [roundChessData, leftChessData])
    
    useEffect(() => {
        if (isReady) {
            setCardData([...store.cardData])
            setRoundChessData([...store.chessData])
        }
    }, [isReady, setCardData, setRoundChessData])

    return (
        <div className={`${style.dash}`}>
            <div className={`${style.cardArea}`}>
                {cardData.map((data, idx) => (
                    <Card
                        idx={idx}
                        data={data}
                        color={store.color}
                        selectedCard={selectedCard}
                        hoveredCard={hoveredCard}
                        setSelectedCard={setSelectedCard}
                        setHoveredCard={setHoveredCard}
                        key={`${idx}-${data}`}
                    />
                ))}
            </div>
            <div className={`${style.chessArea}`}>
                <div className={`${style.roundChessArea}`}>
                    {/* {roundChessData} */}
                </div>
                <div className={`${style.leftChessData}`}>
                    {/* {leftChessData} */}
                </div>
            </div>
        </div>
    )
}

export { DashBoard }
