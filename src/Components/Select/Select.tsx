import { useState, useEffect, useRef, ReactNode, FC } from 'react'
import { TSketchDeviceList } from '../../types'
import useStore from '../../Store'
import style from './Select.module.sass'

interface Props {
    title: string
    children: ReactNode
    selectedValue?: string
}

const { select, select_dropped, value, caption,
    arrow, body, collapse, inner, text, match } = style

function checkDeviceList(obj: TSketchDeviceList) {

    for (const key in obj as TSketchDeviceList) {
        const i = parseInt(key)
        if (i === 1 || i === 2 || i === 3 || i === 4 || i === 5) {
            if (obj[i] !== null) {
                return true
            }
        }
    }
    return false
}

const Select: FC<Props> = ({ title, children, selectedValue }) => {

    const [
        modalWarningSet,
        modalWarningEnabled,
        border,
        deviceList
    ] = useStore(state => [
        state.modalWarningSet,
        state.modalWarningEnabled,
        state.border,
        state.deviceList
    ])

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

        const devices = checkDeviceList(deviceList)
        const msg = `При изменении Бренда или Коллекции, ${border && !devices ? 'будет сброшена' : 'будут сброшены'}${border ? ' рамка': ''}${border && devices ? ' и': ''}${devices ? ' устройства' : ''}`

        if (!dropped && modalWarningEnabled && (border || devices)) {
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