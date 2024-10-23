import { FC } from 'react'
import { TSetPluralFilter, TRemovePluralFilter, TCheckPluralFilter } from '../../types'
import style from './OptionMaterial.module.sass'

const { option, text } = style

interface Props {
    material: string
    setFilter: TSetPluralFilter
    removeFilter: TRemovePluralFilter
    checkFilter: TCheckPluralFilter
}

const OptionMaterial: FC<Props> = ({ material, setFilter, removeFilter, checkFilter }) => {
    function handler(e: React.ChangeEvent<HTMLInputElement>, material: string) {
        if (e.target.checked) {
            setFilter('materials', material)
            return
        }

        removeFilter('materials', material)
    }

    const isChecked = checkFilter('materials', material)

    return (
        <li>
            <label className={option}>
                <input
                    type='checkbox'
                    className='invisible'
                    checked={isChecked}
                    onChange={e => handler(e, material)}
                />
                <span></span>
                <mark className={text}>{material}</mark>
            </label>
        </li>
    )
}

export default OptionMaterial