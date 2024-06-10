import { Price, Set } from '../../Components'
import style from './Cart.module.sass'

const { cart, section, caption } = style

const Cart = () => {
    return (
        <div className={cart}>
            <div className={section}>
                <h3 className={caption}>Стоимость полного комплекта</h3>
                <Price />
                <button type="button" className='button button_block button_dark'>
                    Добавить в проект
                </button>
            </div>

            <div className={section}>
                <h3 className={caption}>Состав комплекта</h3>
                <Set />
                <button type="button" className='button button_block button_dark disabled'>
                    Добавить комплект в корзину
                </button>
            </div>
        </div>
    )
}

export default Cart