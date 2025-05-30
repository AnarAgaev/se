import { useId, useMemo } from 'react'
import { TSketchStore, TAppStore, TDeviceList, TDevice } from '../../types'
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
    setModalResetSketch: TAppStore['setModalResetSketch'],
    addProductsToCart: TAppStore['addProductsToCart']
): JSX.Element => {

    const removeHandler = () => {
        setModalResetSketch(
            true,
            'removeBorder',
            'Удаление рамки приведет к удалению комплекта на холсте',
            'Удалить рамку',
            'Оставить рамку'
        )
    }

    const addToCardHandler = () => {
        if (!border) return

        addProductsToCart([{
            type: 'border',
            article: border.article,
            count: countOfSets
        }])
    }

    return (
        <li key={`${id}-border`} className={item} title={border?.name}>
            <div className={pic}>
                <img src={border?.preview} alt="" />
            </div>
            <div className={content}>
                <div className={head}>
                    <span className={caption}>{border?.name}</span>
                    <button type="button" className={close} onClick={removeHandler}></button>
                </div>
                <div className={body}>
                    <div className={data}>
                        <span className={price}>{border?.price} ₽</span>
                        <span className={count}>{countOfSets} шт.</span>
                    </div>
                    <button type="button" onClick={addToCardHandler}
                        className={`button button_small button_dark button_cart ${add}`}>
                        В корзину
                        <i className='icon icon_cart'></i>
                    </button>
                </div>
            </div>
        </li>
    )
}

const getSetList = (
    id: string,
    deviceList: TDeviceList,
    countOfSets: TAppStore['countOfSets'],
    removeDevice: TSketchStore['removeDevice'],
    addProductsToCart: TAppStore['addProductsToCart']
): JSX.Element[] => {

    const devices = collapseDevices(deviceList as (TDevice | null)[])

    return devices.map((d, i) => {

        const finalPrice = Math.round(
			(typeof d.price === 'string'
				? parseFloat(d.price) * d.selectedCount * countOfSets
				: d.price * d.selectedCount * countOfSets
			) * 100
		) / 100

        const addToCartHandler = () => {
            addProductsToCart([{
                type: 'device',
                article: d.article,
                count: d.selectedCount * countOfSets
            }])
        }

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
                    <button type="button" onClick={addToCartHandler}
                        className={`button button_small button_dark button_cart ${add}`}>
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
        removeDevice,
        setModalResetSketch,
        addProductsToCart
    ] = useStore(state => [
        state.border,
        state.countOfSets,
        state.deviceList,
        state.removeDevice,
        state.setModalResetSketch,
        state.addProductsToCart
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
        () => getBorder(id, border, countOfSets, setModalResetSketch, addProductsToCart),
        [id, border, countOfSets, setModalResetSketch, addProductsToCart]
    )

    const devices = Object.values(deviceList).filter(Boolean) as TDeviceList

    const setList = useMemo(
        () => getSetList(id, devices, countOfSets, removeDevice, addProductsToCart),
        [id, devices, countOfSets, removeDevice, addProductsToCart]
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
