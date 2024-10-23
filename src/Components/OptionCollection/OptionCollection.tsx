import { FC } from 'react'
import style from './OptionCollection.module.sass'

interface Props {
    value: string
    isChecked: boolean
    eventHandler: () => void
}

const { option, text } = style

const OptionCollection: FC<Props> = ({ value, isChecked, eventHandler }) => {
    return (
        <li className='closing'>
            <label className={option}>
                <input
                    className='invisible'
                    type='checkbox'
                    checked={isChecked}
                    onChange={eventHandler}
                />
                <span></span>
                <mark className={text}>{value}</mark>
            </label>
        </li>
    )
}

export default OptionCollection