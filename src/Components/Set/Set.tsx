import { useId, useMemo } from 'react'
import { TSketchStore, TAppStore, TSketchDeviceList } from '../../types'
import useEmblaCarousel from 'embla-carousel-react'
import usePrevNextButtons from './CarouselArrowButtons'
import useStore from '../../Store'
import style from './Set.module.sass'

const { wrapper, set, list, item, pic, content, head, body,
    caption, close, data, price, count, add, nav, navButton,
    prev, next, navDisabled } = style

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
                <li key={`${id}-${i}`} className={item} title={devices[i]?.name}>
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
): JSX.Element => { return (
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
)}

const Set = () => {
    const id = useId()

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

    // #region Carousel
    const [emblaRef, emblaApi] = useEmblaCarousel({
        loop: false,
        align: 'start',
        duration: 10
    })

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)
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

    const prevBtnClazz = `button button_dark ${navButton} ${prev} ${prevBtnDisabled ? navDisabled : ''}`

    const nextBrnClazz = `button button_dark ${navButton} ${next} ${nextBtnDisabled ? navDisabled : ''}`

    return (
        <div className={wrapper}>
            <div className={nav}>
                <button className={prevBtnClazz} onClick={onPrevButtonClick}></button>
                <button className={nextBrnClazz} onClick={onNextButtonClick}></button>
            </div>
            <div ref={emblaRef} className={set}>
                <ul className={list}>
                    { border && selectedBorder }
                    { setList }
                </ul>
            </div>
        </div>
    )
}

export default Set