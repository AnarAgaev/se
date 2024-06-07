import { useId, useMemo } from 'react'
import useStore from '../../Store'
import { FunctionalitySelect } from '../../Components'
import style from './FunctionalitySelectsList.module.sass'

const { list } = style

const getFunctionalitiesList = (
    functions: Record<string, string>,
    id: string
): JSX.Element[] => {

    const elList: JSX.Element[] = []

    for (const key in functions) {
        elList.push(<FunctionalitySelect key={`${id}-${key}`}
            name={key} val={functions[key]} />)
    }

    return elList
}

const FunctionsSelectsList = () => {
    const id = useId()
    const functions = useStore(state => state.getAppFunctionsKinds())

    const elements = useMemo(
        () => getFunctionalitiesList(functions, id),
        [functions, id]
    )

    return (
        <div className={list}>
            { elements }
        </div>
    )
}

export default FunctionsSelectsList