import { useState } from 'react'
import style from './Price.module.sass'

const { wrap, sum, counter, val, controller, controller_dec, controller_inc } = style

const handleCounter = (
    value: number,
    direction: number,
    func: Function
) => {
    let newValue = value + direction
    if (newValue < 0) newValue = 0
    func(newValue)
}

const Price = () => {
    const [value, setValue] = useState<number>(0)

    return (
        <div className={wrap}>
            <span className={sum}>1 000 000 ₽</span>

            <div className={counter}>
                <button type="button"
                    onClick={() => handleCounter(value, -1, setValue)}
                    className={`${controller} ${controller_dec}`}></button>

                <input type="text" className={val} value={value} readOnly />

                <button type="button"
                    onClick={() => handleCounter(value, 1, setValue)}
                    className={`${controller} ${controller_inc}`}></button>
            </div>
        </div>
    )
}

export default Price