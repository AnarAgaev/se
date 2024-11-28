import { useId, useMemo, useState, useEffect } from 'react'
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

const DeviceList = (props: { shouldUpdate: boolean, listRef: React.MutableRefObject<HTMLUListElement | null> }) => {

    // #region Variables
    const [
        deviceList,
        direction,
        scale,
        removeDevice,
        activeViewportTab,
        setVisible
    ] = useStore(state => [
        state.deviceList,
        state.direction,
        state.scale,
        state.removeDevice,
        state.activeViewportTab,
        state.setVisible
    ])
    // #endregion

    const id = useId()

    const [padding, setPadding] = useState(0)

    useEffect(
        () => {

            let timeoutId: number

            const calc = () => {
                const list = props.listRef.current
                const border = list?.parentElement

                if (!border) return

                const borderWidth = border.clientWidth
                const deviceWidth = list.clientHeight
                const countOfPosts = Object.keys(deviceList).length

                setPadding((borderWidth - (deviceWidth * countOfPosts)) / (countOfPosts + 1))
                setVisible(true)
            }

            timeoutId = setTimeout(calc, 300)

            const onWindowResize = (() => {
                timeoutId = setTimeout(calc, 300)
            })

            window.addEventListener('resize', onWindowResize)

            return () => {
                clearTimeout(timeoutId)
                window.removeEventListener('resize', onWindowResize)
            }
        },

        [deviceList, direction, props, activeViewportTab, setVisible]
    )

    const devicesList = useMemo(
        () => getDevicesList(id, deviceList, direction, scale, removeDevice),
        [id, deviceList, direction, scale, removeDevice]
    )

    return (
        <ul ref={props.listRef} className={list} style={{padding: `0 ${padding}px`}}>
            { devicesList }
        </ul>
    )
}

export default DeviceList