import { FC } from 'react'
import style from './OptionCollection.module.sass'

interface Props {
    caption: string
    name: string
}

const { option, text } = style

const OptionCollection: FC<Props> = ({ caption, name }) => {
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

export default OptionCollection