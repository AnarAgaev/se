import { useId, useMemo } from 'react'
import { TSketchStore, TAppStore, TDeviceList } from '../../types'
import { collapseDevices } from '../../Helpers'
import useEmblaCarousel from 'embla-carousel-react'
import usePrevNextButtons from './CarouselArrowButtons'
import useStore from '../../Store'
import style from './Set.module.sass'

const { wrapper, set, list, item, pic, content, head, body,
    caption, close, data, price, count, add, nav, navButton,
    prev, next, navDisabled } = style

const getBorder = (
    id: string,
    border: TSketchStore['border'],
    countOfSets: TAppStore['countOfSets'],
    resetSketch: TSketchStore['resetSketch'],
): JSX.Element => { return (
    <li key={`${id}-border`} className={item} title={border?.name}>
        <div className={pic}>
            <img src={border?.preview} alt="" />
        </div>
        <div className={content}>
            <div className={head}>
                <span className={caption}>{border?.name}</span>
                <button type="button" className={close} onClick={resetSketch}></button>
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

const getSetList = (
    id: string,
    deviceList: TDeviceList,
    countOfSets: TAppStore['countOfSets'],
    removeDevice: TSketchStore['removeDevice']
): JSX.Element[] => {

    const devices = collapseDevices(deviceList)

    return devices.map((d, i) => {

        const finalPrice = typeof d.price === 'string'
            ? parseFloat(d.price) * d.selectedCount * countOfSets
            : d.price * d.selectedCount * countOfSets

        return (
            <li key={`${id}-${i}`} className={item} title={d?.name}>
            <div className={pic}>
                <img src={d?.preview} alt="" />
            </div>
            <div className={content}>
                <div className={head}>
                    <span className={caption}>{d?.name}</span>
                    <button onClick={() => removeDevice(null, d.id)}
                        type="button" className={close}></button>
                </div>
                <div className={body}>
                    <div className={data}>
                        <span className={price}>{finalPrice} ₽</span>
                        <span className={count}>
                            {d.selectedCount * countOfSets} шт.
                            <i>({d.price} р. ед.)</i>
                        </span>
                    </div>
                    <button type="button" className={`button button_small button_dark button_cart ${add}`}>
                        В корзину
                        <i className='icon icon_cart'></i>
                    </button>
                </div>
            </div>
        </li>
        )
    })
}

const Set = () => {
    const id = useId()

    // #region Variables
    const [
        border,
        countOfSets,
        deviceList,
        resetSketch,
        removeDevice
    ] = useStore(state => [
        state.border,
        state.countOfSets,
        state.deviceList,
        state.resetSketch,
        state.removeDevice
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
        () => getBorder(id, border, countOfSets, resetSketch),
        [id, border, countOfSets, resetSketch]
    )

    const devices = Object.values(deviceList).filter(Boolean) as TDeviceList

    const setList = useMemo(
        () => getSetList(id, devices, countOfSets, removeDevice),
        [id, devices, countOfSets, removeDevice]
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