import { useState, useEffect, useRef } from 'react'
import style from './Select.module.sass'

interface Props {
    title: string
}

const { select, select_dropped, body, caption, arrow } = style

// Select Component
const Select: React.FC<Props> = ({title}) => {
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
        }

        document.addEventListener('click', selectClickHandler)

        return () => document.removeEventListener(
            'click', selectClickHandler)
    }, [])


    return (
        <div ref={selectRef} className={clazz}>
            <p className={body} onClick={() => toggleDropped(!dropped)}>
                <span className={caption}>{title}</span>
                <i className={arrow}></i>
            </p>
        </div>
    )
}

export default Select