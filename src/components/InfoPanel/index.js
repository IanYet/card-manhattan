import { useEffect } from 'react/cjs/react.development'
import { useRecoilValue } from 'recoil'
import { userInfoAtom } from './data'
import style from './infoPanel.module.css'

function InfoPanel() {
    const userInfo = useRecoilValue(userInfoAtom)

    useEffect(() => {
        console.log(userInfo)
    }, [userInfo])
    return <div className={`${style.info}`}>info panel</div>
}

export { InfoPanel, userInfoAtom }
