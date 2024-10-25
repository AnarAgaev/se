import { useId, useMemo, FC } from 'react'
import { FunctionalityOption } from '../../Components'
import { TSetFunctionProp } from '../../types'
import useStore from '../../Store'
import style from './FunctionalitySelect.module.sass'

type TValues = (string | number)[]
interface Props {
    group: string
    prop: string,
    values: TValues
}

const { wrap, caption, list } = style

const getFunctionalityOptionList = (
    id: string,
    group: string,
    prop: string,
    values: TValues,
    setFunctionProp: TSetFunctionProp,
): JSX.Element[] => {

    const elList: JSX.Element[] = []

    values.forEach((option, idx) => {
        elList.push(
            <FunctionalityOption
                key={`${id}-${idx}`}
                group={group}
                prop={prop}
                value={option}
                eventHandler={() => setFunctionProp(group, prop, option)}
            />
        )
    })

    return elList
}

const FunctionalitySelect: FC<Props> = ({ group, prop, values }) => {
    const id = useId()
    const dict = useStore(state => state.dictionary.ru)
    const setFunctionProp = useStore(state => state.setFunctionProp)

    const functionalityOptionList = useMemo(
        () => getFunctionalityOptionList(id, group, prop, values, setFunctionProp),
        [ id, group, prop, values, setFunctionProp ]
    )

    const selectCaption = dict[prop]

    if (!selectCaption) {
        console.log('\x1b[31m%s\x1b[0m', 'В словаре не указан перевод свойства!', prop)
    }

    return (
        <div className={wrap}>
            <h3 className={caption} style={selectCaption ? {} : {color: 'red'}}>
                {selectCaption ? selectCaption : prop}
            </h3>
            <ul className={list}>
                { functionalityOptionList }
            </ul>
        </div>
    )
}

export default FunctionalitySelect