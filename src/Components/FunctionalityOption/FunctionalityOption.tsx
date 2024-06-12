import { FC } from 'react'
import style from './FunctionalityOption.module.sass'

interface Props {
    name: string
    val: string
}

const { option } = style

const FunctionalityOption: FC<Props> = ({ name, val }) => {
    return (
        <li>
            <label className={option}>
                <input
                    className='invisible'
                    type='radio'
                    name={name} />
                <span>{val}</span>
            </label>
        </li>
    )
}

export default FunctionalityOption