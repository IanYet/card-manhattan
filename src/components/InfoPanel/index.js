import { useEffect, useState } from 'react/cjs/react.development'
import { useRecoilValue } from 'recoil'
import { stepAtom } from '../../App'
import { userInfoAtom } from './data'
import style from './infoPanel.module.css'

function InfoPanel() {
    const userInfo = useRecoilValue(userInfoAtom)
    const step = useRecoilValue(stepAtom)
    const [spread, setSpread] = useState({})

    useEffect(() => {
        console.log(userInfo)
    }, [userInfo])

    const spreadClick = (color) => (ev) => {
        const spreadTmp = { ...spread }
        spreadTmp[color] = spreadTmp[color] ? false : true
        setSpread(spreadTmp)
    }

    return (
        <div className={`${style.info}`}>
            {userInfo.map((user) => (
                <div
                    key={user.color}
                    className={`${style[user.color]} ${style.userboard}`}
                    onClick={spreadClick(user.color)}>
                    <div className={`${style.pin}`}>
                        <div className={`${style.avatar}`}>
                            {step.replace('_turn', '') === user.color ? (
                                <>
                                    <div
                                        className={`${style.pointerContainer} ${style.long}`}></div>
                                    <div
                                        className={`${style.pointerContainer}`}></div>
                                </>
                            ) : null}
                        </div>
                        <div className={`${style.infoRow}`}>
                            {`位置：${user.up} 得分：${user.score}`}
                        </div>
                    </div>
                    <div
                        className={`${style.chess} ${
                            spread[user.color] ? '' : style.hide
                        }`}>
                        {user.chessData.map((chess, idx) => (
                            <img
                                key={idx}
                                src={`./floor${chess}.svg`}
                                alt={`floor${chess}`}
                            />
                        ))}
                    </div>
                    <div
                        className={`${style.chess} ${
                            spread[user.color] ? '' : style.hide
                        }`}>
                        {Object.keys(user.leftChessData)
                            .sort()
                            .map((chessType) => (
                                <div
                                    key={chessType}
                                    className={`${style.leftChess}`}>
                                    <img
                                        src={`./floor${chessType}.svg`}
                                        alt={`floor${chessType}`}
                                    />
                                    <div>{user.leftChessData[chessType]}</div>
                                </div>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export { InfoPanel, userInfoAtom }
