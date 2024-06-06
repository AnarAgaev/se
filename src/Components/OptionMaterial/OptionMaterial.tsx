import { useState } from 'react'
import style from './OptionMaterial.module.sass'

const { option, text } = style

const OptionMaterial = (props: {caption: string}) => {
    const [isChecked, setChecked] = useState(false)
    const handleChange = () => setChecked(isChecked ? false : true)

    return (
        <li>
            <label className={option}>
                <input
                    type='checkbox'
                    className='invisible'
                    checked={isChecked}
                    onChange={handleChange} />
                <span></span>
                <mark className={text}>{props.caption}</mark>
            </label>
        </li>
    )
}

export default OptionMaterial