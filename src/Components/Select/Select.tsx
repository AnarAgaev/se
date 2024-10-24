import { useState, useEffect, useRef, ReactNode, FC } from 'react'
import style from './Select.module.sass'

interface Props {
    title: string
    children: ReactNode
    selectedValue?: string
}

const { select, select_dropped, value, caption,
    arrow, body, collapse, inner, text, match } = style

const Select: FC<Props> = ({ title, children, selectedValue }) => {
    const [dropped, toggleDropped] = useState(false)

    const selectRef = useRef<HTMLDivElement | null>(null)

    const clazz = dropped
        ? `${select} ${select_dropped}`
        : `${select}`

    useEffect(() => {
        const selectClickHandler = (evt: MouseEvent) => {
            const target = evt.target as HTMLElement

            const isChild = selectRef.current
                && selectRef.current.contains(target)
            if (!isChild) toggleDropped(false)

            const close = !!target.closest('.closing')
            if (close) toggleDropped(false)
        }

        document.addEventListener('click', selectClickHandler)

        return () => document.removeEventListener(
            'click', selectClickHandler)
    }, [])

    return (
        <div ref={selectRef} className={clazz}>
            <div className={value} onClick={() => toggleDropped(!dropped)}>
                <p className={caption}>
                    <span className={text}>{title}</span>
                    <span className={match}>{selectedValue}</span>
                </p>
                <i className={arrow}></i>
            </div>
            <div className={body}>
                <div className={collapse}>
                    <ul className={inner}>
                        { children }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Select