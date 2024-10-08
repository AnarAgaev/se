import { useId, useMemo } from 'react'
import { z } from 'zod'
import { BorderType } from '../../Store/zod-data-contracts'
import style from './ItemsList.module.sass'

const { wrap, list, item, pic, content, name, price } = style

type Border = z.infer<typeof BorderType>

interface Props {
    itemList: Array<Border>
}

const getElList = (
    id: string,
    itemList: Array<Border>
): JSX.Element[] => {

    const resultList: JSX.Element[] = []

    itemList.forEach(border => {
        resultList.push(
            <li key={`${id}-${border.id}`} className={item}>
                <span className={pic}>
                    <img src={border.preview} alt="" loading="lazy" />
                </span>
                <p className={content}>
                    <span className={name}>{border.name}</span>
                    <span className={price}>{border.price} р.</span>
                </p>
            </li>
        )
    })

    return resultList
}

const ItemsList: React.FC<Props> = ({itemList}) => {
    const id = useId()

    const bordersList = useMemo(
        () => getElList(id, itemList),
        [id, itemList]
    )

    return (
        <div className={wrap}>
            <ul className={list}>
                {bordersList}
            </ul>
        </div>
    )
}

export default ItemsList