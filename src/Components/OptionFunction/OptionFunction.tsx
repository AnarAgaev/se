import { useState } from 'react'
import style from './OptionFunction.module.sass'

const { option, text } = style

const OptionFunction = (props: {caption: string}) => {
    const [isChecked, setChecked] = useState(false)
    const handleChange = () => setChecked(isChecked ? false : true)

    return (
        <li>
            <label className={option}>
                <input
                    className='invisible'
                    type='checkbox'
                    checked={isChecked}
                    onChange={handleChange} />
                <span></span>
                <mark className={text}>{props.caption}</mark>
            </label>
        </li>
    )
}

export default OptionFunction