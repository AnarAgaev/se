import { useState, FC } from 'react'
import style from './OptionLocation.module.sass'

interface Props {
    caption: string
    name: string
}

const { option, text } = style

const OptionLocation: FC<Props> = ({ caption, name }) => {
    const [isChecked, setChecked] = useState(false)
    const handleChange = () => setChecked(true)

    return (
        <li className='closing'>
            <label className={option}>
                <input
                    className='invisible'
                    type='radio'
                    name={name}
                    checked={isChecked}
                    onChange={handleChange} />
                <span></span>
                <mark className={text}>{caption}</mark>
            </label>
        </li>
    )
}

export default OptionLocation