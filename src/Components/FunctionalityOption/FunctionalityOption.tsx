import { useState, FC } from 'react'
import style from './FunctionalityOption.module.sass'

interface Props {
    name: string
    val: string
}

const { option } = style

const FunctionalityOption: FC<Props> = ({ name, val }) => {
    const [isChecked, setChecked] = useState(false)
    const handleChange = () => setChecked(true)

    return (
        <li>
            <label className={option}>
                <input
                    className='invisible'
                    type='radio'
                    name={name}
                    checked={isChecked}
                    onChange={handleChange} />
                <span>{val}</span>
            </label>
        </li>
    )
}

export default FunctionalityOption