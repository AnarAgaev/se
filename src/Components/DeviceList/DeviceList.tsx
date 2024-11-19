import { useId, useMemo, useRef, useState, useEffect } from "react"
import { TSketchDeviceList, TDirections } from '../../types'
import useStore from '../../Store'
import style from './DeviceList.module.sass'

const { list, item, image, rotated } = style

const getDeviceContainerList = (
    id: string,
    deviceList: TSketchDeviceList,
    direction: TDirections
): JSX.Element[] => {

    const elList: JSX.Element[] = []

    for (const key in deviceList) {
        const i = parseInt(key)

        if (i === 1 || i === 2 || i === 3 || i === 4 || i === 5) {
            elList.push(
                <li key={`${id}-${i}`}
                    className={direction === 'vertical' ? `${item} ${rotated}` : item} >
                    {
                        !deviceList[i]
                            ? null
                            : <img className={image}
                                src={deviceList[i]?.image}
                                alt={deviceList[i]?.name}
                                title={deviceList[i]?.name} />
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
        direction
    ] = useStore(state => [
        state.deviceList,
        state.direction
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

            timeoutId = setTimeout(calc, 30)

            const onWindowResize = (() => {
                timeoutId = setTimeout(calc, 30)
            })

            window.addEventListener('resize', onWindowResize)

            return () => {
                clearTimeout(timeoutId)
                window.removeEventListener('resize', onWindowResize)
            }
        },

        [deviceList, direction]
    )

    const deviceContainerList = useMemo(
        () => getDeviceContainerList(id, deviceList, direction),
        [id, deviceList, direction]
    )

    return (
        <ul ref={listRef} className={list} style={{gap: `${gap}px`}}>
            {deviceContainerList}
        </ul>
    )
}

export default DeviceList