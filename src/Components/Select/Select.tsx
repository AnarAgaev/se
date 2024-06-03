import { useState, useEffect, useRef, ReactNode } from 'react'
import style from './Select.module.sass'

interface Props {
    title: string
    children: ReactNode
}

const { select, select_dropped, value, caption, arrow, body, collapse, inner } = style

const Select: React.FC<Props> = ({title, children}) => {
    const [dropped, toggleDropped] = useState(false)

    const selectRef = useRef<HTMLDivElement | null>(null)

    const clazz = dropped
        ? `${select} ${select_dropped}`
        : `${select}`

    useEffect(() => {
        const selectClickHandler = (evt: MouseEvent) => {
            const target = evt.target as Node

            const isChild = selectRef.current
                && selectRef.current.contains(target)
            if (!isChild) toggleDropped(false)

            const isOption = target.nodeName === 'LI'
            if (isOption) toggleDropped(false)
        }

        document.addEventListener('click', selectClickHandler)

        return () => document.removeEventListener(
            'click', selectClickHandler)
    }, [])

    return (
        <div ref={selectRef} className={clazz}>
            <p className={value} onClick={() => toggleDropped(!dropped)}>
                <span className={caption}>{title}</span>
                <i className={arrow}></i>
            </p>
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