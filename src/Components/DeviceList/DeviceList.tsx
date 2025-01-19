import { useId, useMemo } from 'react'
import { TSketchDeviceList, TDirections, TRemoveDevice } from '../../types'
import useStore from '../../Store'
import style from './DeviceList.module.sass'

const { list, item, close, image, rotated,
    post_1, post_2, post_3, post_4, post_5 } = style

type TProps = {
    listRef: React.MutableRefObject<HTMLUListElement | null>
}

const getDevicesList = (
    id: string,
    deviceList: TSketchDeviceList,
    direction: TDirections,
    scale: number,
    removeDevice: TRemoveDevice
): JSX.Element[] => {

    const elList: JSX.Element[] = []

    for (const key in deviceList) {
        const i = parseInt(key)

        if (i === 1 || i === 2 || i === 3 || i === 4 || i === 5) {
            elList.push(
                <li key={`${id}-${i}`} onClick={() => deviceList[i] && removeDevice(i)}
                    className={direction === 'vertical' ? `${item} ${rotated}` : item} >
                    {
                        !deviceList[i]
                            ? null
                            : <img className={image}
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
        selectedPost
    ] = useStore(state => [
        state.deviceList,
        state.direction,
        state.scale,
        state.removeDevice,
        state.selectedPost
    ])
    // #endregion

    const id = useId()

    const devicesList = useMemo(
        () => getDevicesList(id, deviceList, direction, scale, removeDevice),
        [id, deviceList, direction, scale, removeDevice]
    )

    const listClassMap: {
        [key: number]: string
    } = {
        0: '',
        1: post_1,
        2: post_2,
        3: post_3,
        4: post_4,
        5: post_5,
    }
    const countOfPost: number = selectedPost.findIndex(Boolean) + 1
    const listClass = `${list}${countOfPost === 0 ? ` ${post_1}` : ` ${listClassMap[countOfPost]}`}`

    return (
        <ul ref={listRef} className={listClass}>
            { devicesList }
        </ul>
    )
}

export default DeviceList