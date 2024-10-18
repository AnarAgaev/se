import { useId, useMemo } from 'react'
import { FunctionalitySelect } from '../../Components'
import { TFunction } from '../../types'
import useStore from '../../Store'
import style from './FunctionalitySelectsList.module.sass'

const { list } = style

const getFunctionalitiesList = (
    functions: TFunction[],
    id: string
): JSX.Element[] => {

    const elList: JSX.Element[] = []

    functions.forEach((fn, idx) => {
        elList.push(<FunctionalitySelect
            key={`${id}-${idx}`}
            name={fn.conf_product_group}
            values={fn.values}
        />)
    })

    return elList
}

const FunctionsSelectsList = () => {
    const id = useId()
    const functions = useStore(state => state.getFunctionsKinds())

    const elements = useMemo(
        () => getFunctionalitiesList(functions, id),
        [functions, id]
    )

    return (
        elements.length === 0
        ? null
        : <div className={list}>
            { elements }
        </div>
    )
}

export default FunctionsSelectsList