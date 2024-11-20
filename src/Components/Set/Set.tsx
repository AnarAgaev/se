import { useId, useMemo, useState, useRef } from 'react'
import style from './Set.module.sass'

const { set, list, item, pic, content, head, body,
    caption, close, data, price, count, add, nav,
    nav_prev, nav_next, nav_inactive } = style

const getShowNext = (
    set: HTMLDivElement,
    list: HTMLUListElement,
    itemWidth: number
): boolean => {

    const viewportRight = set.getBoundingClientRect().right
    const listWidth = list.getBoundingClientRect().width
    const listLeft = list.getBoundingClientRect().left
    const listRight = listLeft + listWidth + itemWidth

    return !(listRight < viewportRight)
}

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
    const [showNext, setShowNext] = useState(true)
    const setRef = useRef<HTMLDivElement>(null)
    const listRef = useRef<HTMLUListElement>(null)

    // Gets this param from the props data. Props.data.length
    const LIST_LENGTH = 7

    // Gets this value from styles ./Set.module.sass
    // 360 is a block width and 20 is offset between blocks
    const ITEM_WIDTH = 360 + 20

    const setList = useMemo(
        () => getSetList(id, LIST_LENGTH),
        []
    )

    const handlePrevClick = () => {
        const set = setRef.current
        const list = listRef.current
        const newOffset = offset + ITEM_WIDTH

        if (set && list) {
            setShowNext(getShowNext(set, list, ITEM_WIDTH))
            setOffset(newOffset >= 0 ? 0 : newOffset)
        }
    }

    const handleNextClick = () => {
        const set = setRef.current
        const list = listRef.current
        const newOffset = offset - ITEM_WIDTH

        if (set && list) {
            setShowNext(getShowNext(set, list, -ITEM_WIDTH))
            setOffset(newOffset)
        }
    }

    const prevButtonClazz = offset >= 0
        ? `${nav} ${nav_prev} ${nav_inactive}`
        : `${nav} ${nav_prev}`

    const nextButtonClazz = showNext
        ? `${nav} ${nav_next}`
        : `${nav} ${nav_next} ${nav_inactive}`

    const listTransformOffset = {
        transform: `translateX(${offset}px)`
    }

    return (
        <div ref={setRef} className={set}>
            <ul ref={listRef} className={list} style={listTransformOffset}>
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