import { FC } from 'react'
import style from './OptionCollection.module.sass'

interface Props {
    value: string
    isChecked: boolean
    brand: string
    selectable: boolean
    selectedBrand: boolean
    eventHandler: () => void
}

const { option, inactive, match, text, name, comment } = style

const OptionCollection: FC<Props> = ({ value, isChecked, brand, selectable, selectedBrand, eventHandler }) => {

    const clazz = selectable ? option : `${option} ${inactive}`

    return (
        <li className={selectedBrand && selectable ? `closing ${match}` : 'closing'}>
            <label className={clazz}>
                <input
                    className='invisible'
                    type='checkbox'
                    checked={isChecked}
                    onChange={eventHandler}
                />
                <mark className={text}>
                    <span className={name}>{value}</span>
                    <span className={comment}>{brand}</span>
                </mark>
            </label>
        </li>
    )
}

export default OptionCollection