import { useState, useEffect, useRef, ReactNode, FC } from 'react'
import useStore from '../../Store'
import style from './Select.module.sass'

interface Props {
    title: string
    children: ReactNode
    selectedValue?: string
    critical?: boolean
}

const { select, select_dropped, value, caption,
    arrow, body, collapse, inner, text, match } = style

const Select: FC<Props> = ({ title, children, selectedValue, critical }) => {

    // #region Variables
    const [
        modalWarningSet,
        modalWarningEnabled,
        selectedBorder,
    ] = useStore(state => [
        state.modalWarningSet,
        state.modalWarningEnabled,
        state.border,
    ])
    // #endregion

    const [dropped, toggleDropped] = useState(false)

    const selectRef = useRef<HTMLDivElement | null>(null)

    const clazz = dropped
        ? `${select} ${select_dropped}`
        : `${select}`

    useEffect(() => {
        const selectClickHandler = (evt: MouseEvent) => {
            const target = evt.target as HTMLElement

            const isOnWarning = !!target.closest('.modal-warning')
            if (isOnWarning) return

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

    const handler = () => {
        toggleDropped(!dropped)

        const msg = "При изменении бренда или коллекции, будут сброшены выбранные рамка и устройства"

        if (!dropped && modalWarningEnabled && selectedBorder && critical) {
            modalWarningSet(true, msg)
        }
    }

    return (
        <div ref={selectRef} className={clazz}>
            <div className={value} onClick={handler}>
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