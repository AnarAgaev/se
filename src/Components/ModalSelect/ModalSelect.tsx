import { Modal } from '../../Components'
import useStore from '../../Store'
import style from './ModalSelect.module.sass'

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
        const [ brand, collection ] = [ modalSelectPayload.brandName, modalSelectPayload.collectionName ]

        resetModalSelect()
        resetSketch()

        // Если задаем вопрос, то значит, меняем бренд при выбранной ранее коллекции
        if (modalSelectPayload.from === 'brand') {
            setSingleBordersFilter('brand', brand)
            removeSingleBordersFilter('collection')

            setSingleDevicesFilter('brand', brand)
            removeSingleDevicesFilter('collection')

            return
        }

        // Если задаем вопрос, значит есть выбранный бренд, и меняем на коллекцию из другого бренда
        if (modalSelectPayload.from === 'collection') {
            setSingleBordersFilter('collection', collection)
            setSingleBordersFilter('brand', brand)

            setSingleDevicesFilter('collection', collection)
            setSingleDevicesFilter('brand', brand)

            return
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