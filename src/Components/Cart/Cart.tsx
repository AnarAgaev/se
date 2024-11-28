import useStore from '../../Store'
import { Price, Locations, Set } from '../../Components'
import style from './Cart.module.sass'

const { cart, section, caption } = style

const Cart = () => {

    // #region Variables
    const [
        selectedBorder,
        checkDevices,
        modalMessageSet,
        checkProject,
        checkRoom,
        projects,
        rooms
    ] = useStore(state => [
        state.border,
        state.checkDevices,
        state.modalMessageSet,
        state.checkProject,
        state.checkRoom,
        state.projects,
        state.rooms
    ])
    // #endregion

    const isSelectedBorder = Boolean(selectedBorder)
    const isSelectedDevice = checkDevices()
    const isProjectSelected = checkProject()
    const isRoomSelected = checkRoom()

    const addToProjectHandler = () => {
        if (!isSelectedBorder) {
            modalMessageSet(true, 'В начале необходимо выбрать рамку')
            return
        }

        if (!isSelectedDevice) {
            modalMessageSet(true, 'Необходимо выбрать хотя бы одно устройство')
            return
        }

        if (!isProjectSelected) {
            modalMessageSet(true, `Необходимо ${projects.length ? 'выбрать' : 'добавить'} проект`)
            return
        }

        if (!isRoomSelected) {
            modalMessageSet(true, `Необходимо ${rooms.length ? 'выбрать' : 'добавить'} помещение`)
            return
        }

        alert("Отправляем запрос на API --- Сохраняем конфигурацию в выбранном проекте")
    }

    const addToCartHandler = () => {
        if (!isSelectedDevice) {
            modalMessageSet(true, 'Необходимо выбрать хотя бы одно устройство')
            return
        }

        alert("Отправляем запрос на API --- Добавляем комплект в корзину")
    }

    const addToProjectButtonClazz = `button button_block button_dark ${!isSelectedBorder || !isSelectedDevice || !isProjectSelected || !isRoomSelected ? 'clickedDisabled' : ''}`
    const addToCartButtonClazz = `button button_block button_dark ${!isSelectedDevice ? 'clickedDisabled' : ''}`

    return (
        <div className={cart}>
            <div className={section}>
                <h3 className={caption}>Стоимость полного комплекта</h3>
                <Price />
                <Locations />
                <button type="button" onClick={addToProjectHandler}
                    className={addToProjectButtonClazz}>
                    Добавить в проект
                </button>
            </div>
            { Boolean(selectedBorder) &&
                <div className={section}>
                    <h3 className={caption}>Состав комплекта</h3>
                    <Set />
                    <button type="button" onClick={addToCartHandler}
                        className={addToCartButtonClazz}>
                        Добавить комплект в корзину
                    </button>
                </div>
            }
        </div>
    )
}

export default Cart