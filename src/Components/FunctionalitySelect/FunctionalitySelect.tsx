import { useId, useMemo, FC } from 'react'
import { FunctionalityOption } from '../../Components'
import useStore from '../../Store'
import style from './FunctionalitySelect.module.sass'

type TValues = (string | number)[]
interface Props {
    name: string,
    values: TValues
}

const { wrap, caption, list } = style

const getFunctionalityOptionList = (
    values: TValues,
    id: string
): JSX.Element[] => {

    const elList: JSX.Element[] = []

    values.forEach((option, idx) => elList.push(
        <FunctionalityOption
            key={`${id}-${idx}`}
            value={option} /> ))

    return elList
}

const FunctionalitySelect: FC<Props> = ({ name, values }) => {
    const id = useId()
    const dict = useStore(state => state.dictionary.ru)

    const functionalityOptionList = useMemo(
        () => getFunctionalityOptionList(values, id),
        [values, id]
    )

    const selectCaption = dict[name]

    if (!selectCaption) {
        console.log('\x1b[31m%s\x1b[0m', 'В словаре не указан перевод свойства!', name)
    }

    return (
        <div className={wrap}>
            <h3 className={caption} style={selectCaption ? {} : {color: 'red'}}>
                {selectCaption ? selectCaption : name}
            </h3>
            <ul className={list}>
                { functionalityOptionList }
            </ul>
        </div>
    )
}

export default FunctionalitySelect