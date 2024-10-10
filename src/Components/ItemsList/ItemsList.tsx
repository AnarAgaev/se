import { useId, useMemo } from 'react'
import { TElementList } from '../../types'
import style from './ItemsList.module.sass'

const { wrap, list, item, pic, content, name, price } = style

interface Props {
    itemList: TElementList
}

const getElementsList = (
    id: string,
    itemList: TElementList
): JSX.Element[] => {

    const resultList: JSX.Element[] = []

    itemList.forEach(el => {
        resultList.push(
            <li key={`${id}-${el.id}`} className={item}>
                <span className={pic}>
                    <img src={el.preview} alt="" loading="lazy" />
                </span>
                <p className={content}>
                    <span className={name}>{el.name}</span>
                    <span className={price}>{el.price} р.</span>
                </p>
            </li>
        )
    })

    return resultList
}

const ItemsList: React.FC<Props> = ({itemList}) => {
    const id = useId()

    const ElementsList = useMemo(
        () => getElementsList(id, itemList),
        [id, itemList]
    )

    return (
        <div className={wrap}>
            <ul className={list}>
                {ElementsList}
            </ul>
        </div>
    )
}

export default ItemsList