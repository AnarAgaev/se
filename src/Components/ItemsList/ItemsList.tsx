import { useId, useMemo } from 'react'
import { TBorder, TDevice, TElementList, TItemsType, TSetFirstBorder, TGetCountOfPosts } from '../../types'
import useStore from '../../Store'
import style from './ItemsList.module.sass'

const { wrap, list, item, pic, preview, content, name, price } = style

interface Props {
    itemList: TElementList
    type: TItemsType
}

const getElementsList = (
    id: string,
    itemList: TElementList,
    type: TItemsType,
    setFirstBorder: TSetFirstBorder,
    getCountOfPosts: TGetCountOfPosts
): JSX.Element[] => {

    const resultList: JSX.Element[] = []

    const addItemHandler: (type: TItemsType, item: TDevice | TBorder) => void = (type, item) => {
        if (type === 'borders') {
            const countOfPosts = getCountOfPosts(item)
            setFirstBorder(item, countOfPosts)
        }
    }

    itemList.forEach(el => {
        // const jsonString = JSON.stringify(el, null, 2);
        // const escapedString = jsonString.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        resultList.push(
            <li key={`${id}-${el.id}`}
                onClick={() => {
                    addItemHandler(type, el)

                    // console.table(el) // Временно печатаем в консоль Item. Удалить перед деплоем!
                }}


                // title={escapedString} // Временно при ховере показываем Item. Удалить перед деплоем!


                className={item}
                data-type={type === 'borders' ? 'Добавить рамку' : 'Добавить механизм'}
            >
                <span className={pic}>
                    <img src={el.preview} alt="" className={preview} loading="lazy" />
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

const ItemsList: React.FC<Props> = ({itemList, type}) => {
    const id = useId()

    const [
        setFirstBorder,
        getCountOfPosts
    ] = useStore(state => [
        state.setFirstBorder,
        state.getCountOfPosts
    ])

    const ElementsList = useMemo(
        () => getElementsList(id, itemList, type, setFirstBorder, getCountOfPosts),
        [id, itemList, type, setFirstBorder, getCountOfPosts]
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