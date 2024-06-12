import { useId, useMemo, FC } from 'react'
import useStore from '../../Store'
import { FunctionalityOption } from '../../Components'
import style from './FunctionalitySelect.module.sass'

interface Props {
    name: string,
    val: string
}

const { wrap, caption, list } = style

const getFunctionalityOptionList = (
    optionsList: string[],
    name: string,
    id: string
): JSX.Element[] => {

    const elList: JSX.Element[] = []

    optionsList.forEach(option => elList.push(
        <FunctionalityOption
            key={`${id}-${option}`}
            name={name}
            val={option} /> ))

    return elList
}

const FunctionalitySelect: FC<Props> = ({name, val}) => {
    const id = useId()
    const getDevicesFunctionsOptions = useStore(state => state.getDevicesFunctionsOptions)

    const functionalityOptionList = useMemo(
        () => getFunctionalityOptionList(
            getDevicesFunctionsOptions(name), name, id),
        [getDevicesFunctionsOptions, name, id]
    )

    return (
        <div className={wrap}>
            <h3 className={caption}>{val}</h3>
            <ul className={list}>
                { functionalityOptionList }
            </ul>
        </div>
    )
}

export default FunctionalitySelect