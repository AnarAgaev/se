import { Modal } from '../../Components'
import useStore from '../../Store'
import style from './ModalResetBrandOrCollection.module.sass'

const ModalResetBrandOrCollection = ({visible}: {visible: boolean}) => {

    // #region Variables
    const [
        modalSelectCaption,
        modalSelectButtonApproveText,
        modalSelectButtonRejectText,
        resetModalSelect,
        modalSelectPayload,
        setSingleBordersFilter,
        setSingleDevicesFilter,
        removeSingleBordersFilter,
        removeSingleDevicesFilter,
        resetSketch
    ] = useStore(state => [
        state.modalSelectCaption,
        state.modalSelectButtonApproveText,
        state.modalSelectButtonRejectText,
        state.resetModalSelect,
        state.modalSelectPayload,
        state.setSingleBordersFilter,
        state.setSingleDevicesFilter,
        state.removeSingleBordersFilter,
        state.removeSingleDevicesFilter,
        state.resetSketch
    ])
    // #endregion

    const onApprove = () => {

        /*
         * Функция onApprove срабатывает только если пользователь
         * 1. Пытается изменить бренд при выбранной ранее коллекции из другого бренда
         * 2. Пытается изменить коллекцию и выбрал коллекцию не из выбранного ранее бренда
        */

        const [ brand, collection ] = [ modalSelectPayload.brandName, modalSelectPayload.collectionName ]

        resetModalSelect()
        resetSketch()

        // Не зависимо от того, меняет ли пользователь Бренд или Коллекцию - бренд меняется всегда
        setSingleBordersFilter('brand', brand)
        setSingleDevicesFilter('brand', brand)

        // Если меням селектор Бренда, то сбрасываем коллекцию
        if (modalSelectPayload.from === 'brand') {
            removeSingleBordersFilter('collection')
            removeSingleDevicesFilter('collection')
        }

        // Если меняем селектор коллекции, то выставляем выбранную коллекцию
        if (modalSelectPayload.from === 'collection') {
            setSingleBordersFilter('collection', collection)
            setSingleDevicesFilter('collection', collection)
        }
    }

    return (
        <Modal visible={visible} title={modalSelectCaption} onClose={resetModalSelect}>
            <div className={style.buttons}>
                <button onClick={onApprove}
                    className='button button_block button_lite'>
                    { modalSelectButtonRejectText }
                </button>
                <button onClick={resetModalSelect}
                    className='button button_block button_dark'>
                    { modalSelectButtonApproveText }
                </button>
            </div>
        </Modal>
    )
}

export default ModalResetBrandOrCollection