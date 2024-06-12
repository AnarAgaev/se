import { useState, FC } from 'react'
import style from './OptionMaterial.module.sass'

const { option, text } = style

interface Props {
    caption: string
}

const OptionMaterial: FC<Props> = ({ caption }) => {
    const [isChecked, setChecked] = useState(false)

    return (
        <li>
            <label className={option}>
                <input
                    type='checkbox'
                    className='invisible'
                    checked={isChecked}
                    onChange={() => setChecked(!isChecked)} />
                <span></span>
                <mark className={text}>{caption}</mark>
            </label>
        </li>
    )
}

export default OptionMaterial