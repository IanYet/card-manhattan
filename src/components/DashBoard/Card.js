import { useEffect, useRef } from 'react'
import style from './dashBoard.module.css'

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
    const colorMap = useRef({
        green: ['#aac9ce', '#f3dbcd', '#e5c1cd'],
        blue: ['#c9bbcb', '#aac9ce', '#f3dbcf'],
        red: ['#e5c1cd', '#f3dbcf', '#c9bbcb'],
        yellow: ['#f3dbcf', '#c9bbcb', '#aac9ce'],
    })

    useEffect(() => {
        const ctx = ref.current.getContext('2d')

        const gra = ctx.createLinearGradient(0, 0, 192, 192)
        gra.addColorStop(0, colorMap.current[color][0])
        gra.addColorStop(1, colorMap.current[color][1])
        ctx.fillStyle = gra
        ctx.fillRect(0, 0, 192, 192)
    }, [color])
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
                        : 'rgba(255,255,255,0.8)',
            }}
            onClick={(ev) =>
                idx === selectedCard
                    ? setSelectedCard(-2)
                    : setSelectedCard(idx)
            }
            onPointerEnter={(ev) => setHoveredCard(idx)}
            onPointerLeave={(ev) => setHoveredCard(-2)}
            ref={ref}></canvas>
    )
}

export { Card }
