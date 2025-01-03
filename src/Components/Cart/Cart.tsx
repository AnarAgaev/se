import useStore from '../../Store'
import { Price, Locations, Set } from '../../Components'
import { TDevice } from '../../types'
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
        rooms,
        addConfiguration,
        getSelectedBackgroundId,
        deviceList,
        countOfSets
    ] = useStore(state => [
        state.border,
        state.checkDevices,
        state.modalMessageSet,
        state.checkProject,
        state.checkRoom,
        state.projects,
        state.rooms,
        state.addConfiguration,
        state.getSelectedBackgroundId,
        state.deviceList,
        state.countOfSets
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

        const project = [...projects].filter(p => p.selected)[0]
        const room = [...rooms].filter(r => r.selected)[0]
        const backgroundId = getSelectedBackgroundId()
        const devices = Object.values(deviceList).filter(d => !!d)

        addConfiguration(
            project.id,
            room.id,
            room.name,
            backgroundId,
            selectedBorder,
            devices as TDevice[],
            countOfSets
        )
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