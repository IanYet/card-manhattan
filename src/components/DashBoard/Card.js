import { useEffect, useRef } from 'react'
import { useRecoilValue } from 'recoil'
import { STEP, stepAtom } from '../../App'
import { constant } from '../../game'
import style from './dashBoard.module.css'

function drawRoundRect(ctx, x, y, width, height, radius, isFill) {
    ctx.beginPath()
    ctx.moveTo(x, y + radius)
    ctx.lineTo(x, y + height - radius)
    ctx.arc(x + radius, y - radius + height, radius, Math.PI, Math.PI / 2, true)
    ctx.lineTo(x + width - radius, y + height)
    ctx.arc(
        x - radius + width,
        y - radius + height,
        radius,
        Math.PI / 2,
        0,
        true
    )
    ctx.lineTo(x + width, y + radius)
    ctx.arc(x - radius + width, y + radius, radius, 0, -Math.PI / 2, true)
    ctx.lineTo(x + radius, y)
    ctx.arc(x + radius, y + radius, radius, -Math.PI / 2, -Math.PI, true)
    ctx.stroke()

    if (isFill) {
        ctx.fillStyle = 'rgba(255,255,255,1)'
        ctx.fill()
    }
}

function Card({
    idx,
    color,
    data,
    selectedCard,
    setSelectedCard,
    hoveredCard,
    setHoveredCard,
}) {
    const ref = useRef(null)
    const step = useRecoilValue(stepAtom)
    const colorMap = useRef({
        green: ['#aac9ce', '#f3dbcd', constant.COLOR_MAP.green],
        blue: ['#c9bbcb', '#aac9ce', constant.COLOR_MAP.blue],
        red: ['#e5c1cd', '#f3dbcf', constant.COLOR_MAP.red],
        yellow: ['#f3dbcf', '#c9bbcb', constant.COLOR_MAP.yellow],
    })

    useEffect(() => {
        const ctx = ref.current.getContext('2d')

        const gra = ctx.createLinearGradient(0, 0, 192, 192)
        gra.addColorStop(0, colorMap.current[color][0])
        gra.addColorStop(1, colorMap.current[color][1])
        ctx.fillStyle = gra
        ctx.fillRect(0, 0, 192, 192)

        ctx.lineWidth = 4
        ctx.strokeStyle = 'rgba(255,255,255,1)'

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let isFill = false
                if (data[0] === i && data[1] === j) isFill = true
                drawRoundRect(
                    ctx,
                    44 * j + 15 * (j + 1),
                    44 * i + 15 * (i + 1),
                    44,
                    44,
                    8,
                    isFill
                )
            }
        }
    }, [color, data])
    return (
        <canvas
            className={`${style.card} ${
                idx === selectedCard ? style.selected : ''
            } ${idx === selectedCard + 1 ? style.selectedNext : ''} ${
                idx === hoveredCard ? style.hovered : ''
            } ${idx === hoveredCard + 1 ? style.hoveredNext : ''}`}
            width={192}
            height={192}
            style={{
                left: idx * 100 + 'px',
                borderColor:
                    idx === selectedCard
                        ? colorMap.current[color][2]
                        : 'rgba(255,255,255,1)',
            }}
            onClick={(ev) => {
                if (step === STEP.your_turn) {
                    idx === selectedCard
                        ? setSelectedCard(-2)
                        : setSelectedCard(idx)
                }
            }}
            onPointerEnter={(ev) => setHoveredCard(idx)}
            onPointerLeave={(ev) => setHoveredCard(-2)}
            ref={ref}></canvas>
    )
}

export { Card }
