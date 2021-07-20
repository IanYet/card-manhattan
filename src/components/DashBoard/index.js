import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { readyAtom } from '../../App'
import { net } from '../../net'
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
    const [selectedChess, setSelectedChess] = useState(-2)
    const [tempRoundChess, setTempRoundChess] = useState([])
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

    const roundChessArea = [0, 1, 2, 3, 4, 5].map((idx) => (
        <div
            key={idx}
            className={`${style.chess} ${style[store.color]} ${
                idx === selectedChess ? style.selected : ''
            }`}
            onClick={(ev) => {
                if (roundChessData[idx]) setSelectedChess(idx)
                else setSelectedChess(-2)
            }}>
            {roundChessData[idx] ? (
                <img
                    src={`${net.url}floor${roundChessData[idx]}.svg`}
                    alt={`floor${roundChessData[idx]}`}
                />
            ) : (
                <div className={`${style.chessHolder}`}></div>
            )}
        </div>
    ))

    const rowChessArea = (level) =>
        new Array(leftChessData[level]).fill().map((val, idx) => (
            <div
                className={`${style.chess}  ${style[store.color]} ${
                    tempRoundChess.includes(`${level}-${idx}`)
                        ? style.selected
                        : ''
                }`}
                key={idx}
                onClick={(ev) => {
                    if (tempRoundChess.includes(`${level}-${idx}`)) {
                        setTempRoundChess(
                            tempRoundChess.filter(
                                (r) => r !== `${level}-${idx}`
                            )
                        )
                    } else {
                        if (tempRoundChess.length >= 6) return
                        setTempRoundChess([
                            ...tempRoundChess,
                            `${level}-${idx}`,
                        ])
                    }
                }}
                style={{
                    marginLeft: idx % 6 === 0 ? '' : '.4rem',
                    marginBottom: '.4rem',
                }}>
                <img
                    src={`${net.url}floor${roundChessData[level]}.svg`}
                    alt={`floor${roundChessData[level]}`}
                />
            </div>
        ))

    const leftChessArea = Object.keys(leftChessData)
        .sort()
        .map((level) => (
            <div key={level} className={`${style.rowChessArea}`}>
                {rowChessArea(level)}
            </div>
        ))

    return (
        <>
            <div className={`${style.btnBars}`}>
                <div></div>
                <div></div>
                <div></div>
            </div>
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
                        {roundChessArea}
                    </div>
                    <div className={`${style.leftChessArea}`}>
                        {leftChessArea}
                    </div>
                </div>
            </div>
        </>
    )
}

export { DashBoard }
