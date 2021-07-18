import { useEffect } from 'react'
import { useRecoilState } from 'recoil'
import style from './dashBoard.module.css'
import { cardDataSelector } from './data'

function DashBoard() {
    const [cardData, setCardData] = useRecoilState(cardDataSelector)

    useEffect(() => {
        console.log(cardData)
    }, [cardData])

    return (
        <div className={`${style.dash}`}>
            {/* {cardData.map((data) => (
                <div>{data}</div>
            ))} */}
        </div>
    )
}

export { DashBoard }
