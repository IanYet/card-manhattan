import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { readyAtom, stepAtom } from '../../App'
import { Board, constant, operate, status } from '../../game'
import { net } from '../../net'
import { STEP, store } from '../store'
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

    useEffect(() => {
        if (!roundChessData.length || step === STEP.pre_round) return
        if (store.color !== step.replace('_turn', '')) return

        status.playedChess = roundChessData[selectedChess] + store.color
        operate.createTempFloor()
        Board.changeMode(constant.OPER_MODE)
    }, [selectedChess, roundChessData, step])

    useEffect(() => {
        if (!cardData.length || step === STEP.pre_round) return
        if (store.color !== step.replace('_turn', '')) return

        status.playedCard = cardData[selectedCard]
        operate.createTempFloor()
        Board.changeMode(constant.OPER_MODE)
    }, [selectedCard, cardData, step])

    useEffect(() => {
        const stepMsg = {
            pre: '请选择本阶段游戏你所选用的棋子',
            your: '你的回合，请摆放建筑',
            other: '现在是其他人的回合',
            end: '本阶段结束，你的分数是：',
        }

        console.log(step)

        if (step === STEP.pre_round) {
            setTempMsg(stepMsg.pre)
        } else if (step.includes('turn')) {
            if (store.color === step.replace('_turn', '')) {
                setTimeout(() => {
                    setSelectedCard(0)
                    setSelectedChess(0)
                    setTempMsg(stepMsg.your)
                    pressSubmit(false)
                }, 100)
            } else {
                setTimeout(() => {
                    setTempMsg(stepMsg.other)
                }, 100)
            }
        } else if (step === STEP.round_end) {
            setTempMsg(stepMsg.end)
        }
    }, [step, setTempMsg])

    const endReadyStep = () => {
        if (submitPressed) return
        if (tempRoundChess.length < userNum) {
            setTempMsg('请选择' + userNum + '个棋子')
            return
        }

        pressSubmit(true)

        const chessList = tempRoundChess.map((chess) => parseInt(chess)).sort()
        const chessMap = { 1: 0, 2: 0, 3: 0, 4: 0 }
        const leftChessData = { ...store.leftChessData }

        chessList.forEach((val) => (chessMap[val] += 1))
        for (let i = 1; i < 5; i++) {
            leftChessData[i] = leftChessData[i] - chessMap[i]
        }

        const postData = {
            userId: store.userId,
            roundChess: chessList,
            leftChess: leftChessData,
        }

        net.postRoundChess(postData)
            .then(() => {
                setRoundChessData(chessList)
                store.leftChessData = { ...leftChessData }
                setLeftChess(store.leftChessData)
                setTempRoundChess([])
                setTempMsg('正在等待其他玩家')
                console.log(store)
            })
            .catch(() => {
                setTempMsg('网络问题，请重试')
                setTimeout(() => {
                    setTempMsg('')
                }, 3000)
                pressSubmit(false)
            })
    }

    const play = () => {
        const floor = roundChessData[selectedChess] + store.color
        const card = cardData[selectedCard]
        const area = status.playedArea

        if (area === '') {
            const preMsg = tempMsg
            setTempMsg('请选择城区')
            setTimeout(() => {
                setTempMsg(preMsg)
            }, 3000)

            return
        }

        const [x, y] = status.truePos
        const cityData = JSON.parse(JSON.stringify(store.cityData))
        cityData[area][x][y].push(floor)

        const leftCard = store.cardData.filter(
            (val, idx) => idx !== selectedCard
        )
        const roundChess = store.chessData.filter(
            (val, idx) => idx !== selectedChess
        )

        const body = {
            userId: store.userId,
            floor,
            card,
            area,
            leftCard,
            roundChess,
            cityData,
        }

        net.play(body).then((data) => {
            const newCard = data.data
            // status.playedChess = floor
            // status.playedCard = card
            operate.disposeTempFloor()
            // operate.play(floor, card, area, store.up)
            setCardData(newCard)
            setRoundChessData(roundChess)
            setSelectedCard(-2)
            setSelectedChess(-2)
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
        your: (
            <div
                className={`${style.submit} ${style[store.color]} ${
                    submitPressed ? style.pressed : ''
                }`}
                onClick={(ev) => {
                    if (submitPressed) return
                    // pressSubmit(true)
                    play()
                }}>
                结束回合
            </div>
        ),
        other: '',
    }

    const roundChessArea = [0, 1, 2, 3, 4, 5].map((idx) => (
        <div
            key={idx}
            className={`${style.chess} ${style[store.color]} ${
                idx === selectedChess ? style.selected : ''
            }`}
            onClick={(ev) => {
                if (step.replace('_turn', '') !== store.color) return
                if (roundChessData[idx]) setSelectedChess(idx)
            }}>
            {roundChessData[idx] ? (
                <img
                    src={`./floor${roundChessData[idx]}.svg`}
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
                    if (step !== STEP.pre_round || submitPressed) return
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
                <img src={`./floor${level}.svg`} alt={`floor${level}`} />
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
                    <div>{tempMsg}</div>
                    <div className={`${style.backView} ${style[store.color]}`}>
                        &#xe900;
                    </div>
                </div>
                <div className={`${style.btnArea}`}>
                    {submitBtn[step] ||
                        (step.replace('_turn', '') === store.color
                            ? submitBtn.your
                            : submitBtn.other)}
                </div>
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
