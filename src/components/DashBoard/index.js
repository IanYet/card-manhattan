import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { readyAtom } from '../../App'
import { store } from '../store'
import { Card } from './Card'
import style from './dashBoard.module.css'
import { cardDataSelector } from './data'

function DashBoard() {
    const [cardData, setCardData] = useRecoilState(cardDataSelector)
    const [selectedCard, setSelectedCard] = useState(-2)
    const [hoveredCard, setHoveredCard] = useState(-2)
    // const [] = useRecoilState
    const isReady = useRecoilValue(readyAtom)

    useEffect(() => {
        if (isReady) {
            setCardData([...store.cardData])
        }
    }, [isReady, setCardData])

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
                <div></div>
                <div></div>
            </div>
        </div>
    )
}

export { DashBoard }
