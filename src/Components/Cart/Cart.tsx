import useStore from '../../Store'
import { Price, Locations, Set } from '../../Components'
import { collapseDevices } from '../../Helpers'
import { TAddProductsToCart } from '../../types'
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
        countOfSets,
        editConfiguration,
        direction,
        saveConfiguration,
        addProductsToCart
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
        state.countOfSets,
        state.editConfiguration,
        state.direction,
        state.saveConfiguration,
        state.addProductsToCart
    ])
    // #endregion

    const isSelectedBorder = Boolean(selectedBorder)
    const isSelectedDevice = checkDevices()
    const isProjectSelected = checkProject()
    const isRoomSelected = checkRoom()

    const addToProjectHandler = () => {
        if (!isSelectedBorder && !isSelectedDevice) {
            modalMessageSet(true, 'Необходимо выбрать рамку или хотя бы одно устройство')
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
        const devices = Object.values(deviceList)

        addConfiguration(
            project.id,
            room.id,
            room.name,
            backgroundId,
            selectedBorder,
            devices,
            countOfSets,
            direction
        )
    }

    const saveConfigurationHandler = () => {
        if (!isSelectedDevice && !isSelectedBorder) {
            modalMessageSet(true, 'Необходимо выбрать хотя бы одно устройство или рамку')
            return
        }

        const backgroundId = getSelectedBackgroundId()
        const devices = Object.values(deviceList)

        saveConfiguration(
            backgroundId,
            selectedBorder,
            devices,
            direction
        )
    }

    const addToCartHandler = () => {

        const selectedDevices = collapseDevices(Object.values(deviceList))

        const requestArr: Parameters<TAddProductsToCart>[0] = []

        if (selectedBorder) requestArr.push({
            type: 'border',
            article: selectedBorder.article,
            count: countOfSets
        })

        selectedDevices.forEach(device => {
            if (device) {
                requestArr.push({
                    type: 'device',
                    article: device.article,
                    count: device.selectedCount * countOfSets
                })
            }
        })

        addProductsToCart(requestArr)
    }

    const addToProjectButtonClazz = `button button_block button_dark ${(!isSelectedBorder && !isSelectedDevice) || !isProjectSelected || !isRoomSelected ? 'clickedDisabled' : ''}`
    const saveConfButtonClazz = `button button_block button_dark ${(!isSelectedBorder && !isSelectedDevice) ? 'clickedDisabled' : ''}`

    return (
        <div className={cart}>
            <div className={section}>
                <h3 className={caption}>Стоимость полного комплекта</h3>
                <Price />
                <Locations />
                { !editConfiguration
                    ? <button type="button" onClick={addToProjectHandler}
                        className={addToProjectButtonClazz}>
                        Добавить в проект
                    </button>
                    : <button type="button" onClick={saveConfigurationHandler}
                        className={saveConfButtonClazz}>
                        Сохранить комплект
                    </button>
                }
            </div>
            { (isSelectedBorder || isSelectedDevice) &&
                <div className={section}>
                    <h3 className={caption}>Состав комплекта</h3>
                    <Set />
                    <button type="button"
                        onClick={addToCartHandler}
                        className='button button_block button_dark'>
                        Добавить комплект в корзину
                    </button>
                </div>
            }
        </div>
    )
}

export default Cart