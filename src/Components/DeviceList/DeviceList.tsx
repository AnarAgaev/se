import { useId, useMemo, useRef, useState, useEffect } from 'react'
import { TSketchDeviceList, TDirections, TRemoveDevice } from '../../types'
import useStore from '../../Store'
import style from './DeviceList.module.sass'

const { list, item, close, image, rotated } = style

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

const DeviceList = () => {

    // #region Variables
    const [
        deviceList,
        direction,
        scale,
        removeDevice
    ] = useStore(state => [
        state.deviceList,
        state.direction,
        state.scale,
        state.removeDevice
    ])
    // #endregion

    const id = useId()

    const listRef = useRef<HTMLUListElement | null>(null)

    const [gap, setGap] = useState(0)

    useEffect(
        () => {

            let timeoutId: number

            const calc = () => {
                const list = listRef.current

                if (!list) return

                const parentNode = list.parentElement

                if (!parentNode) return

                const parentHeight = parentNode.clientHeight
                const listHeight = list.clientHeight

                setGap((parentHeight - listHeight) / 2)
            }

            timeoutId = setTimeout(calc, 50)

            const onWindowResize = (() => {
                timeoutId = setTimeout(calc, 50)
            })

            window.addEventListener('resize', onWindowResize)

            return () => {
                clearTimeout(timeoutId)
                window.removeEventListener('resize', onWindowResize)
            }
        },

        [deviceList, direction]
    )

    const devicesList = useMemo(
        () => getDevicesList(id, deviceList, direction, scale, removeDevice),
        [id, deviceList, direction, scale, removeDevice]
    )

    return (
        <ul ref={listRef} className={list} style={{gap: `${gap}px`}}>
            {devicesList}
        </ul>
    )
}

export default DeviceList