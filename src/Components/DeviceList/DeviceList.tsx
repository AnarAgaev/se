import { useId, useMemo } from 'react'
import { TSketchDeviceList, TDirections, TRemoveDevice, TBorder } from '../../types'
import useStore from '../../Store'
import style from './DeviceList.module.sass'

const { list, listVertical, item, itemVertical,
    close, image, rotated, withRotate,
    post_1, post_2, post_3, post_4, post_5,
    img_1, img_2, img_3, img_4, img_5,
} = style

type TProps = {
    listRef: React.MutableRefObject<HTMLUListElement | null>
}

const getDevicesList = (
    id: string,
    deviceList: TSketchDeviceList,
    direction: TDirections,
    scale: number,
    removeDevice: TRemoveDevice,
    selectedBorder: TBorder
): JSX.Element[] => {

    const elList: JSX.Element[] = []

    const itemClass = direction === 'horizontal'
        ? item
        : `${item} ${selectedBorder?.conf_orientation === 'universal'
            ? `${rotated}`
            : `${itemVertical}`}`

    const imgClass = direction === 'vertical' && selectedBorder?.conf_orientation === 'universal' && selectedBorder?.collection.toLocaleUpperCase() === 'GLOSSA'
        ? `${image} ${withRotate}`
        : image

    for (const key in deviceList) {
        const i = parseInt(key)

        if (i === 1 || i === 2 || i === 3 || i === 4 || i === 5) {
            elList.push(
                <li key={`${id}-${i}`} onClick={() => deviceList[i] && removeDevice(i)} className={itemClass} >
                    {
                        !deviceList[i]
                            ? null
                            : <img className={imgClass}
                                src={deviceList[i]?.image}
                                alt={deviceList[i]?.name}
                                title={deviceList[i]?.name} />
                    }
                    {
                        !deviceList[i]
                            ? null
                            : <span className={close} style={{transform: `scale(${1 / (scale > 1 ? scale : 1)})`}}></span>
                    }
                </li>
            )
        }
    }

    return elList
}

const DeviceList = ({ listRef } : TProps) => {

    // #region Variables
    const [
        deviceList,
        direction,
        scale,
        removeDevice,
        selectedPost,
        selectedBorder
    ] = useStore(state => [
        state.deviceList,
        state.direction,
        state.scale,
        state.removeDevice,
        state.selectedPost,
        state.border
    ])
    // #endregion

    const id = useId()

    const devicesList = useMemo(
        () => getDevicesList(id, deviceList, direction, scale, removeDevice, selectedBorder as TBorder),
        [id, deviceList, direction, scale, removeDevice, selectedBorder]
    )

    interface IMap {
        [key: number]: string
    }

    const listClassMap: IMap = { 0: '', 1: post_1, 2: post_2, 3: post_3, 4: post_4, 5: post_5 };
    const listImgClassMap: IMap = { 0: '', 1: img_1, 2: img_2, 3: img_3, 4: img_4, 5: img_5 };
    const countOfPost = selectedPost.findIndex(Boolean) + 1;

    let listClass

    if (direction === 'horizontal') {
        listClass = `${list} ${countOfPost === 0 ? `${post_1}` : `${listClassMap[countOfPost]}`}`
    } else {
        if (selectedBorder?.conf_orientation === 'vertical') {
            listClass = `${list} ${listVertical} ${countOfPost === 0 ? `${img_1}` : `${listImgClassMap[countOfPost]}`}`
        } else {
            listClass = `${list} ${countOfPost === 0 ? `${post_1}` : `${listClassMap[countOfPost]}`}`
        }
    }

    return (
        <ul ref={listRef} className={listClass}>
            { devicesList }
        </ul>
    )
}

export default DeviceList