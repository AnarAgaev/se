import { FC } from 'react'
import useStore from '../../Store'
import style from './FunctionalityOption.module.sass'

interface Props {
    group: string,
    prop: string,
    value: string | number
    eventHandler: () => void
}

const { option } = style

const FunctionalityOption: FC<Props> = ({ group, prop, value, eventHandler }) => {
    const checkSelectedFunction = useStore(state => state.checkSelectedFunction)
    const isChecked = checkSelectedFunction(group, prop, value)

    useStore(state => state.filtersDevices) // fore force update

    return (
        <li>
            <label className={option}>
                <input
                    className='invisible'
                    type='checkbox'
                    checked={isChecked}
                    onChange={eventHandler}
                />
                <span>{value}</span>
            </label>
        </li>
    )
}

export default FunctionalityOption