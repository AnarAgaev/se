import { useId, useMemo, useState  } from 'react'
import style from './Set.module.sass'

const { set, list, item, pic, content, head, body,
    caption, close, data, price, count, add, nav,
    nav_prev, nav_next, nav_inactive } = style

const getSetList = (id: string, length: number): JSX.Element[] => {
    const elList: JSX.Element[] = []

    for (let i = 1; i <= length; i++) {
        elList.push(
            <li key={`${id}-${i}`} className={item}>
                <div className={pic}>
                    <img src="img/devices/previews/mechanism_black_switcher_sensor_1.png" alt="" />
                </div>
                <div className={content}>
                    <div className={head}>
                        <span className={caption}>ALUMINIUM Хром {`- ${i}`}</span>
                        <button type="button" className={close}></button>
                    </div>
                    <div className={body}>
                        <div className={data}>
                            <span className={price}>222 999 ₽</span>
                            <span className={count}>{1} товар</span>
                        </div>
                        <button type="button" className={`button button_small button_dark button_cart ${add}`}>
                            В корзину
                            <i className='icon icon_cart'></i>
                        </button>
                    </div>
                </div>
            </li>
        )
    }

    return elList
}

const Set = () => {
    const id = useId()
    const [offset, setOffset] = useState(0)

    const LENGTH = 10
    const ITEM_WIDTH = window.innerWidth < 576 ? (300 + 20) : (360 + 20) // gets this value from styles ./Set.module.sass

    const setList = useMemo(
        () => getSetList(id, LENGTH),
        []
    )

    const handleNextClick = () => {
        const newOffset = offset - ITEM_WIDTH
        setOffset(newOffset)
    }

    const handlePrevClick = () => {
        const newOffset = offset + ITEM_WIDTH
        setOffset(newOffset >= 0 ? 0 : newOffset)
    }

    const prevButtonClazz = offset >= 0
        ? `${nav} ${nav_prev} ${nav_inactive}`
        : `${nav} ${nav_prev}`

    const nextButtonClazz = `${nav} ${nav_next}`

    const listTransformOffset = {
        transform: `translateX(${offset}px)`
    }

    return (
        <div className={set}>
            <ul className={list} style={listTransformOffset}>
                {setList}
            </ul>
            <button type="button" className={prevButtonClazz}
                onClick={handlePrevClick}></button>
            <button type="button" className={nextButtonClazz}
                onClick={handleNextClick}></button>
        </div>
    )
}

export default Set