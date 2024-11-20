import { useId, useMemo, useState, useRef } from 'react'
import { TSketchStore, TAppStore, TSketchDeviceList } from '../../types'
import useStore from '../../Store'
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

const getSetList = (
    id: string,
    devices: TSketchStore['deviceList'],
    countOfSets: TAppStore['countOfSets']
): JSX.Element[] => {

    const elList: JSX.Element[] = []


    for (const key in devices as TSketchDeviceList) {
        const i = parseInt(key)

        if (i === 1 || i === 2 || i === 3 || i === 4 || i === 5) {
            if (devices[i] === null) continue

            elList.push(
                <li key={`${id}-border`} className={item} title={devices[i]?.name}>
                    <div className={pic}>
                        <img src={devices[i]?.preview} alt="" />
                    </div>
                    <div className={content}>
                        <div className={head}>
                            <span className={caption}>{devices[i]?.name}</span>
                            <button type="button" className={close}></button>
                        </div>
                        <div className={body}>
                            <div className={data}>
                                <span className={price}>{devices[i]?.price} ₽</span>
                                <span className={count}>{countOfSets} шт.</span>
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
    }

    return elList
}

const getBorder = (
    id: string,
    border: TSketchStore['border'],
    countOfSets: TAppStore['countOfSets']
): JSX.Element => (
    <li key={`${id}-border`} className={item} title={border?.name}>
        <div className={pic}>
            <img src={border?.preview} alt="" />
        </div>
        <div className={content}>
            <div className={head}>
                <span className={caption}>{border?.name}</span>
                <button type="button" className={close}></button>
            </div>
            <div className={body}>
                <div className={data}>
                    <span className={price}>{border?.price} ₽</span>
                    <span className={count}>{countOfSets} шт.</span>
                </div>
                <button type="button" className={`button button_small button_dark button_cart ${add}`}>
                    В корзину
                    <i className='icon icon_cart'></i>
                </button>
            </div>
        </div>
    </li>
)

const Set = () => {

    // #region Variables
    const [
        border,
        countOfSets,
        deviceList
    ] = useStore(state => [
        state.border,
        state.countOfSets,
        state.deviceList
    ])
    // #endregion

    const id = useId()
    const [offset, setOffset] = useState(0)
    const [showNext, setShowNext] = useState(true)
    const setRef = useRef<HTMLDivElement>(null)
    const listRef = useRef<HTMLUListElement>(null)

    // #region Slider
    // Gets this value from styles ./Set.module.sass
    // 360 is a block width and 20 is offset between blocks
    const ITEM_WIDTH = 360 + 20

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
    // #endregion

    // #region Getting JSX Elements
    const selectedBorder = useMemo(
        () => getBorder(id, border, countOfSets),
        [id, border, countOfSets]
    )

    const setList = useMemo(
        () => getSetList(id, deviceList, countOfSets),
        [id, deviceList, countOfSets]
    )
    // #endregion

    // #region Style classes
    const prevButtonClazz = offset >= 0
    ? `${nav} ${nav_prev} ${nav_inactive}`
    : `${nav} ${nav_prev}`

    const nextButtonClazz = showNext
    ? `${nav} ${nav_next}`
    : `${nav} ${nav_next} ${nav_inactive}`

    const listTransformOffset = {
        transform: `translateX(${offset}px)`
    }
    // #endregion

    return (
        <div ref={setRef} className={set}>
            <ul ref={listRef} className={list} style={listTransformOffset}>
                { border && selectedBorder }
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