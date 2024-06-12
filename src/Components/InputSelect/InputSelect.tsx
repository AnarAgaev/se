import { useState, useEffect, useRef, ReactNode, FC, ChangeEvent } from 'react'
import style from './InputSelect.module.sass'

interface Props {
    title: string
    placeholder: string
    children: ReactNode
    cbf: (value: string) => void
}

const { select, select_dropped, value, caption,
    arrow, body, collapse, inner, add, add_valid } = style

const Select: FC<Props> = ({ title, placeholder, children, cbf }) => {
    const [dropped, toggleDropped] = useState(false)
    const [inputVal, setInputVal] = useState('')
    const selectRef = useRef<HTMLDivElement | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)

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

    const handleInputChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => setInputVal(event.target.value)

    const handleEnterPress = (
        event: React.KeyboardEvent<HTMLInputElement>
    ) => { if (event.key === 'Enter') addNewValue() }

    const addNewValue = () => {
        if (inputVal) {
            cbf(inputVal)
            setInputVal('')
            inputRef.current?.blur()
        }
    }

    return (
        <div ref={selectRef} className={clazz}>
            <p className={value} onClick={() => toggleDropped(!dropped)}>
                <span className={caption}>{title}</span>
                <i className={arrow}></i>
            </p>
            <div className={body}>
                <div className={collapse}>
                    <div className={inputVal === '' ? add : `${add} ${add_valid}` }>
                        <i></i>
                        <input value={inputVal}
                            ref={inputRef}
                            type="text"
                            onChange={handleInputChange}
                            onKeyDown ={handleEnterPress}
                            placeholder={placeholder} />
                        <button onClick={addNewValue} type="button"></button>
                    </div>
                    <ul className={inner}>
                        { children }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Select