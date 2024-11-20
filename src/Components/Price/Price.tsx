import useStore from '../../Store'
import style from './Price.module.sass'

const { wrap, sum, counter, val, controller,
    controller_dec, controller_inc } = style

const Price = () => {

    // #region Variables
    const [
        count,
        handler
    ] = useStore(state => [
        state.countOfSets,
        state.setCountOfSets
    ])
    // #endregion

    return (
        <div className={wrap}>
            <span className={sum}>1 000 000 ₽</span>

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