import { FC } from 'react'
import style from './OptionBrand.module.sass'

interface Props {
    img: string
    value: string
    isChecked: boolean
    eventHandler: () => void
}

const { option, picture, text } = style

const OptionBrand: FC<Props> = ({ img, value, isChecked, eventHandler}) => {
    return (
        <li className='closing'>
            <label className={option}>
                <input
                    className='invisible'
                    type='checkbox'
                    checked={isChecked}
                    value={value}
                    onChange={() => eventHandler()}/>
                <span></span>
                <em className={picture}>
                    <img src={img} alt={value} />
                </em>
                <mark className={text}>{value}</mark>
            </label>
        </li>
    )
}

export default OptionBrand
