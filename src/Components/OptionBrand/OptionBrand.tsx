import { useState, FC } from 'react'
import style from './OptionBrand.module.sass'

interface Props {
    img: string
    caption: string
    name: string
}

const { option, picture, text } = style

const OptionBrand: FC<Props> = ({ img, caption, name}) => {
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
                <em className={picture}>
                    <img src={img} alt={caption} />
                </em>
                <mark className={text}>{caption}</mark>
            </label>
        </li>
    )
}

export default OptionBrand
