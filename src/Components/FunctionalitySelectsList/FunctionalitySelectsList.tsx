import { useId, useMemo } from 'react'
import { FunctionalitySelect } from '../../Components'
import { TFunctionItem } from '../../types'
import useStore from '../../Store'
import style from './FunctionalitySelectsList.module.sass'

const { wrap, list } = style

const getFunctionalitiesList = (
    functions: TFunctionItem | undefined,
    id: string
): JSX.Element[] => {

    const elList: JSX.Element[] = []

    functions && functions.props.forEach((fn, idx) => {
        elList.push(<FunctionalitySelect
            key={`${id}-${idx}`}
            group={functions.name}
            prop={fn.conf_product_group}
            values={fn.values}
        />)
    })

    return elList
}

const FunctionsSelectsList = () => {
    const id = useId()
    const functions = useStore(state => state.getFunctionsKinds())
    const checkGroup = useStore(state => state.checkSelectedFuncGroup)
    const resetGroup = useStore(state => state.resetSelectedFuncGroup)

    const elements = useMemo(
        () => getFunctionalitiesList(functions, id),
        [functions, id]
    )

    const isSelectedFiled = typeof functions?.name === 'string'
        && checkGroup(functions?.name)

    return (
        elements.length === 0
            ? null
            : <div className={wrap}>
                <div className={list}>
                    { elements }
                </div>
                { isSelectedFiled &&
                    <button
                        onClick={() => resetGroup(functions?.name)}
                        className='button button_block button_dark'>
                        Очистить функции
                    </button>
                }
            </div>
    )
}

export default FunctionsSelectsList