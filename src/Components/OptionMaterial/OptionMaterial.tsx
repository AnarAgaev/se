import { useState } from 'react'
import style from './OptionMaterial.module.sass'

const { option, checker, text} = style

const OptionMaterial = (props: {caption: string}) => {

    const [isChecked, setChecked] = useState(false)
    const handleChange = () => setChecked(isChecked ? false : true)

    return (
        <li>
            <label className={option}>

                <input
                    type="checkbox"
                    name="material"
                    className='invisible'
                    value={props.caption}
                    checked={isChecked}
                    onChange={handleChange} />

                <span className={checker}></span>
                <mark className={text}>{props.caption}</mark>
            </label>
        </li>
    )
}

export default OptionMaterial