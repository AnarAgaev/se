import useStore from '../../Store'
import { Price, Locations, Set } from '../../Components'
import style from './Cart.module.sass'

const { cart, section, caption } = style

const Cart = () => {

    // #region Variables
    const [
        selectedBorder,
        checkDevices,
        modalMessageSet
    ] = useStore(state => [
        state.border,
        state.checkDevices,
        state.modalMessageSet
    ])
    // #endregion

    const handler = () => {
        if (!checkDevices()) {
            modalMessageSet(true, 'Необходимо добавить еще устройств или выбрать рамку с меньшим количеством постов')
            return
        }

        console.log('\x1b[34m%s\x1b[0m', 'Отправляем запрос на API --- Добавляем комплект в корзину')
    }

    return (
        <div className={cart}>
            <div className={section}>
                <h3 className={caption}>Стоимость полного комплекта</h3>
                <Price />
                <Locations />
                <button type="button" className='button button_block button_dark'>
                    Добавить в проект
                </button>
            </div>
            { selectedBorder &&
                <div className={section}>
                    <h3 className={caption}>Состав комплекта</h3>
                    <Set />
                    <button type="button" onClick={handler}
                        className={`button button_block button_dark ${checkDevices() ? '' : ' clickedDisabled'}`}>
                        Добавить комплект в корзину
                    </button>
                </div>
            }
        </div>
    )
}

export default Cart