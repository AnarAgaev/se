import { useId, useMemo } from 'react'
import { TBorder, TDevice, TElementList, TItemsType, TSetFirstBorder, TGetCountOfPosts, TSetDevice, TSketchDeviceList } from '../../types'
import useStore from '../../Store'
import style from './ItemsList.module.sass'

const { wrap, list, item, pic, preview, content, name, price } = style

interface Props {
    itemList: TElementList
    type: TItemsType
}

function hasNull(obj: TSketchDeviceList): boolean {
    let isDefined = false

    for (const key in obj) {
        const i = parseInt(key)

        if (i === 1 || i === 2 || i === 3 || i === 4 || i === 5) {
            if (obj[i] === null) isDefined = true
        }
    }

    return isDefined
}

const getElementsList = (
    id: string,
    itemList: TElementList,
    type: TItemsType,
    setFirstBorder: TSetFirstBorder,
    getCountOfPosts: TGetCountOfPosts,
    setDevice: TSetDevice,
    deviceList: TSketchDeviceList
): JSX.Element[] => {

    const resultList: JSX.Element[] = []

    function isDevice(i: TDevice | TBorder): i is TDevice {
        return (i as TDevice).conf_product_group !== undefined
    }

    const addItemHandler: (type: TItemsType, item: TDevice | TBorder) => void = (type, item) => {
        if (type === 'borders') {
            const countOfPosts = getCountOfPosts(item)
            setFirstBorder(item, countOfPosts)
        }

        if (type === 'devices' && isDevice(item) && hasNull(deviceList)) {
            setDevice(item)
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
        getCountOfPosts,
        setDevice,
        deviceList
    ] = useStore(state => [
        state.setFirstBorder,
        state.getCountOfPosts,
        state.setDevice,
        state.deviceList
    ])

    const ElementsList = useMemo(
        () => getElementsList(id, itemList, type, setFirstBorder, getCountOfPosts, setDevice, deviceList),
        [id, itemList, type, setFirstBorder, getCountOfPosts, setDevice, deviceList]
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