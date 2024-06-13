import { useState, useEffect, useRef, ReactNode, FC } from 'react'
import { InputAdd } from '../../Components'
import style from './InputSelect.module.sass'

interface Props {
    title: string
    placeholder: string
    children: ReactNode
    cbf: (value: string) => void
}

const { select, select_dropped, value, caption,
    arrow, body, collapse, add, inner } = style

const InputSelect: FC<Props> = ({ title, placeholder, children, cbf }) => {
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
            <p className={value} onClick={() => toggleDropped(!dropped)}>
                <span className={caption}>{title}</span>
                <i className={arrow}></i>
            </p>
            <div className={body}>
                <div className={collapse}>
                    <div className={add}>
                        <InputAdd placeholder={placeholder} cbf={cbf} />
                    </div>
                    <ul className={inner}>
                        { children }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default InputSelect