import { useId, useMemo } from 'react'
import useStore from '../../Store'
import style from './ItemsList.module.sass'
import { TBorder, TDevice, TElementList, TItemsType,
    TSetFirstBorder, TGetCountOfPosts, TSetDevice,
    TSketchDeviceList, TSetSingleFilter, TFilters,
    TSketchStore, TAppStore } from '../../types'

const { wrap, list, item, pic, preview, content, name, price } = style

interface Props {
    itemList: TElementList
    type: TItemsType
}

const hasNull = (obj: TSketchDeviceList): boolean => {
    const keysToCheck = [1, 2, 3, 4, 5]

    for (const i of keysToCheck) {
        if ((i === 1 || i === 2 || i === 3 || i === 4 || i === 5)
                && (i in obj)
                && (obj[i] === null)) return true
    }

    return false
}

const getElementsList = (
    id: string,
    itemList: TElementList,
    type: TItemsType,
    setFirstBorder: TSetFirstBorder,
    getCountOfPosts: TGetCountOfPosts,
    setDevice: TSetDevice,
    deviceList: TSketchDeviceList,
    setSingleBordersFilter: TSetSingleFilter,
    setSingleDevicesFilter: TSetSingleFilter,
    selectedBrand: TFilters['brand'],
    selectedCollection: TFilters['collection'],
    border: TSketchStore['border'],
    modalMessageSet: TAppStore['modalMessageSet'],
    postsCount: TSketchStore['postsCount'],
    selectedPost: TSketchStore['selectedPost']
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

        if (type === 'devices' && isDevice(item)) {

            if (border === null) {
                modalMessageSet(true, 'Вначале необходимо выбрать рамку')
                return
            }

            if (!hasNull(deviceList)) {
                modalMessageSet(true, `Все посты заполнены. ${!selectedPost[postsCount - 1] ? 'Выберите рамку с большим количеством постов или' : ''} ${!selectedPost[postsCount - 1] ? 'у' : 'У'}далите устройства.`)
                return
            }

            setDevice(item)
        }

        /*
        * For both the frame and the device,
        * when choosing, we immediately set
        * the Brand and Collection filters
        */
        if (!selectedBrand && !selectedCollection) {
            setSingleBordersFilter('brand', item.vendor)
            setSingleBordersFilter('collection', item.collection)

            setSingleDevicesFilter('brand', item.vendor)
            setSingleDevicesFilter('collection', item.collection)

            return
        }

        if (selectedBrand && !selectedCollection) {
            setSingleBordersFilter('collection', item.collection)
            setSingleDevicesFilter('collection', item.collection)

            return
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

    // #region Variables
    const [
        border,
        setFirstBorder,
        getCountOfPosts,
        setDevice,
        deviceList,
        setSingleBordersFilter,
        setSingleDevicesFilter,
        selectedBrand,
        selectedCollection,
        modalMessageSet,
        postsCount,
        selectedPost
    ] = useStore(state => [
        state.border,
        state.setFirstBorder,
        state.getCountOfPosts,
        state.setDevice,
        state.deviceList,
        state.setSingleBordersFilter,
        state.setSingleDevicesFilter,
        state.filtersBorders.brand,
        state.filtersBorders.collection,
        state.modalMessageSet,
        state.postsCount,
        state.selectedPost
    ])
    // #endregion

    const ElementsList = useMemo(
        () => getElementsList(
            id, itemList, type, setFirstBorder,
            getCountOfPosts, setDevice, deviceList,
            setSingleBordersFilter,
            setSingleDevicesFilter,
            selectedBrand,
            selectedCollection,
            border,
            modalMessageSet,
            postsCount,
            selectedPost
        ),
        [
            id, itemList, type, setFirstBorder,
            getCountOfPosts, setDevice, deviceList,
            setSingleBordersFilter,
            setSingleDevicesFilter,
            selectedBrand,
            selectedCollection,
            border,
            modalMessageSet,
            postsCount,
            selectedPost
        ]
    )

    return (
        <div className={wrap}>
            <ul className={list}>
                { ElementsList }
            </ul>
        </div>
    )
}

export default ItemsList