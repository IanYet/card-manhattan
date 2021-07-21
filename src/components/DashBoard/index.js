import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { readyAtom, STEP, stepAtom } from '../../App'
import { net } from '../../net'
import { store } from '../store'
import { Card } from './Card'
import style from './dashBoard.module.css'
import {
    cardDataSelector,
    leftChessDataAtom,
    roundChessDataSelector,
    tempMsgAtom,
} from './data'

function DashBoard() {
    const [cardData, setCardData] = useRecoilState(cardDataSelector)
    const [roundChessData, setRoundChessData] = useRecoilState(
        roundChessDataSelector
    )
    const [leftChessData, setLeftChess] = useRecoilState(leftChessDataAtom)
    const [selectedCard, setSelectedCard] = useState(-2)
    const [hoveredCard, setHoveredCard] = useState(-2)
    const [selectedChess, setSelectedChess] = useState(-2)
    const [tempRoundChess, setTempRoundChess] = useState([])
    const [submitPressed, pressSubmit] = useState(false)
    const [tempMsg, setTempMsg] = useRecoilState(tempMsgAtom)
    const isReady = useRecoilValue(readyAtom)
    const step = useRecoilValue(stepAtom)

    const userNum = Object.keys(store.userList).length === 3 ? 4 : 6

    // useEffect(() => {
    //     console.log(roundChessData, leftChessData)
    // }, [roundChessData, leftChessData])

    useEffect(() => {
        if (isReady) {
            setCardData([...store.cardData])
            setRoundChessData([...store.chessData])
        }
    }, [isReady, setCardData, setRoundChessData])

    const stepMsg = {
        [STEP.pre_round]: '请选择本阶段游戏你所选用的棋子',
        [STEP.your_turn]: '你的回合，请摆放建筑',
        [STEP.other_turn]: '现在是其他人的回合',
        [STEP.round_end]: '本阶段结束，你的分数是：',
    }

    const endReadyStep = () => {
        if (submitPressed) return
        if (tempRoundChess.length < userNum) {
            setTempMsg('请选择' + userNum + '个棋子')
            setTimeout(() => setTempMsg(''), 5000)
            return
        }

        pressSubmit(true)

        net.postRoundChess().finally(() => {
            const chessList = tempRoundChess
                .map((chess) => parseInt(chess))
                .sort()
            setRoundChessData(chessList)

            const chessMap = { 1: 0, 2: 0, 3: 0, 4: 0 }
            chessList.forEach((val) => (chessMap[val] += 1))
            for (let i = 1; i < 5; i++) {
                store.leftChessData[i] = store.leftChessData[i] - chessMap[i]
            }
            setLeftChess(store.leftChessData)
            setTempRoundChess([])
            setTempMsg('正在等待其他玩家')
            console.log(store)
        })
    }

    const submitBtn = {
        [STEP.pre_round]: (
            <div
                className={`${style.submit} ${style[store.color]} ${
                    submitPressed ? style.pressed : ''
                }`}
                onClick={endReadyStep}>
                结束准备
            </div>
        ),
        [STEP.your_turn]: (
            <div
                className={`${style.submit} ${style[store.color]} ${
                    submitPressed ? style.pressed : ''
                }`}
                onClick={(ev) => {
                    if (submitPressed) return
                    pressSubmit(true)
                }}>
                结束回合
            </div>
        ),
        [STEP.other_turn]: '',
        [STEP.round_end]: '',
    }

    const roundChessArea = [0, 1, 2, 3, 4, 5].map((idx) => (
        <div
            key={idx}
            className={`${style.chess} ${style[store.color]} ${
                idx === selectedChess ? style.selected : ''
            }`}
            onClick={(ev) => {
                if (step !== STEP.your_turn) return
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
                    if (step !== STEP.pre_round) return
                    if (tempRoundChess.includes(`${level}-${idx}`)) {
                        setTempRoundChess(
                            tempRoundChess.filter(
                                (r) => r !== `${level}-${idx}`
                            )
                        )
                    } else {
                        if (tempRoundChess.length >= userNum) return
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
                    src={`${net.url}floor${level}.svg`}
                    alt={`floor${level}`}
                />
            </div>
        ))

    const leftChessArea = Object.keys(leftChessData)
        .sort()
        .map((level) => {
            // console.log(level)
            return (
                <div key={level} className={`${style.rowChessArea}`}>
                    {rowChessArea(level)}
                </div>
            )
        })

    return (
        <>
            <div className={`${style.btnBars}`}>
                <div className={`${style.msg}`}>
                    <div>{tempMsg || stepMsg[step]}</div>
                    <div className={`${style.backView} ${style[store.color]}`}>
                        &#xe900;
                    </div>
                </div>
                <div className={`${style.btnArea}`}>{submitBtn[step]}</div>
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
