import { FC } from 'react'
import style from './OptionFunction.module.sass'

interface Props {
    caption: string
    name: string
}

const { option, text } = style

const OptionFunction: FC<Props> = ({ caption, name }) => {
    return (
        <li className='closing'>
            <label className={option}>
                <input
                    className='invisible'
                    type='radio'
                    name={name} />
                <span></span>
                <mark className={text}>{caption}</mark>
            </label>
        </li>
    )
}

export default OptionFunction