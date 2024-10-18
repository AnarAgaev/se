import { FC } from 'react'
import { TFunctionOption } from '../../types'
import useStore from '../../Store'
import style from './OptionFunction.module.sass'

const { option, text } = style

const OptionFunction: FC<TFunctionOption> = ({ name, active }) => {
    const updateActiveFunction = useStore(state => state.updateActiveFunction)
    return (
        <li className='closing'>
            <label className={option}>
                <input className='invisible' type='checkbox' checked={active}
                    onChange={() => updateActiveFunction(name)} />
                <span></span>
                <mark className={text}>{name}</mark>
            </label>
        </li>
    )
}

export default OptionFunction