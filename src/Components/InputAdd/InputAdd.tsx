import { useState, useRef, ChangeEvent } from 'react'
import style from './InputAdd.module.sass'

interface Props {
    placeholder: string
    cbf: (value: string) => void
    type: 'project' | 'room'
}

const { add, add_valid, icon, input, button } = style

const InputAdd = ({ placeholder, cbf }: Props) => {

    const [inputVal, setInputVal] = useState('')
    const inputRef = useRef<HTMLInputElement | null>(null)

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
        <div className={inputVal === '' ? add : `${add} ${add_valid}` }>
            <i className={icon}></i>
            <input className={input}
                value={inputVal}
                ref={inputRef}
                type="text"
                // onFocus={handleInputFocus}
                onChange={handleInputChange}
                onKeyDown ={handleEnterPress}
                placeholder={placeholder} />
            <button className={button} type="button"
                onClick={addNewValue}></button>
        </div>
    )
}

export default InputAdd