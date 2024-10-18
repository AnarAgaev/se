import { FC } from 'react'
import style from './FunctionalityOption.module.sass'

interface Props {
    value: string | number
}

const { option } = style

const FunctionalityOption: FC<Props> = ({ value }) => {
    return (
        <li>
            <label className={option}>
                <input
                    className='invisible'
                    type='checkbox' />
                <span>{value}</span>
            </label>
        </li>
    )
}

export default FunctionalityOption