import useStore from '../../Store'
import { TDevice, TBorder } from '../../types'
import style from './Price.module.sass'

const { wrap, sum, counter, val, controller,
    controller_dec, controller_inc } = style

const Price = () => {

    // #region Variables
    const [
        count,
        handler,
        border,
        devices
    ] = useStore(state => [
        state.countOfSets,
        state.setCountOfSets,
        state.border,
        state.deviceList
    ])
    // #endregion

    const price = () => {
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

        return (sum * count).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
    }

    return (
        <div className={wrap}>
            <span className={sum}>{price()} ₽</span>

            <div className={counter}>
                <button type="button"
                    onClick={() => handler(-1)}
                    className={`${controller} ${controller_dec}`}></button>

                <input type="text" className={val} value={count} readOnly />

                <button type="button"
                    onClick={() => handler(1)}
                    className={`${controller} ${controller_inc}`}></button>
            </div>
        </div>
    )
}

export default Price