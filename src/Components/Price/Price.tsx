import { useMemo } from 'react'
import useStore from '../../Store'
import { TDevice, TBorder } from '../../types'
import style from './Price.module.sass'

const { wrap, price, priceDisabled, counter, counterDisabled,
    val, controller, controller_dec, controller_inc } = style

const Price = () => {

    // #region Variables
    const [
        count,
        setCountOfSets,
        border,
        devices,
        checkDevices
    ] = useStore(state => [
        state.countOfSets,
        state.setCountOfSets,
        state.border,
        state.deviceList,
        state.checkDevices
    ])
    // #endregion

    const totalPrice = useMemo(
        () => {
            let sum: number = 0

            const toNumber = (el: TBorder | TDevice): number => {
                return typeof el.price === 'string'
                    ? parseFloat(el.price)
                    : el.price
            }

            if (border) sum += toNumber(border)

            for (const key in devices) {
                const i = parseInt(key)

                if (i === 1 || i === 2 || i === 3 || i === 4 || i === 5) {
                    if (devices[i] === null) continue

                    const device = devices[i]
                    if (device) sum += toNumber(device)
                }
            }

            return (Math.round(sum * count * 100) / 100)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        },
        [ border, devices, count ])

    const onCalc = (direction: -1 | 1) => {
        setCountOfSets(direction)
    }

    const isDeviceSelected = checkDevices()

    return (
        <div className={wrap}>
            <span className={`${price} ${parseInt(totalPrice) === 0 ? priceDisabled : ''}`}>{totalPrice} ₽</span>

            <div className={`${counter} ${(!border && !isDeviceSelected) ? counterDisabled : ''}`}>
                <button type="button"
                    onClick={() => onCalc(-1)}
                    className={`${controller} ${controller_dec}`}></button>

                <input readOnly type="text" className={val}
                    value={parseInt(totalPrice) === 0 ? 0 : count} />

                <button type="button"
                    onClick={() => onCalc(1)}
                    className={`${controller} ${controller_inc}`}></button>
            </div>
        </div>
    )
}

export default Price
