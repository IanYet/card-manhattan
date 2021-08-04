import { useEffect } from 'react/cjs/react.development'
import { useRecoilValue } from 'recoil'
import { userInfoAtom } from './data'
import style from './infoPanel.module.css'

function InfoPanel() {
    const userInfo = useRecoilValue(userInfoAtom)

    useEffect(() => {
        console.log(userInfo)
    }, [userInfo])

    return (
        <div className={`${style.info}`}>
            {userInfo.map((user) => (
                <div
                    key={user.color}
                    className={`${style[user.color]} ${style.userboard}`}>
                    <div className={`${style.pin}`}>
                        <div className={`${style.avatar}`}></div>
                        <div className={`${style.infoRow}`}></div>
                    </div>
                    <div></div>
                    <div></div>
                </div>
            ))}
        </div>
    )
}

export { InfoPanel, userInfoAtom }
