import { useState, useRef, useEffect, useCallback } from 'react'
import style from './PriceChangeTooltip.module.sass'

const { text, tooltip, show} = style

const PriceChangeTooltip = ({ price }: { price: string }) => {

    const ref = useRef<HTMLSpanElement | null>(null)
    const [visible, setVisible] = useState(false)

    const handler = () => {
        if (window.innerWidth <= 1200) {
            setVisible(!visible)
        }
    }

    const onDocumentClick = useCallback((e: MouseEvent) => {
        if (!ref.current) return

        const clickedElement = e.target as HTMLElement
        const isClickInside = ref.current.contains(clickedElement)

        if (!isClickInside) {
            setVisible(false)
        }

    }, [])

    const onWindowScroll = useCallback(() => setVisible(false), [])

    useEffect(() => {
        window.addEventListener('scrollend', onWindowScroll)
        document.addEventListener('click', onDocumentClick)

        return () => {
            window.removeEventListener('scrollend', onWindowScroll)
            document.removeEventListener('click', onDocumentClick)
        }
    }, [onWindowScroll, onDocumentClick])

    return (
        <span ref={ref} className={text} onClick={handler}>
            {price} р.
            <mark className={`${tooltip} ${visible ? show : ''}`}>
                Цена товара изменилась
            </mark>
        </span>
    )
}

export default PriceChangeTooltip