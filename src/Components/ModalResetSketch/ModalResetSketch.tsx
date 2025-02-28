import { Modal } from '../../Components'
import useStore from '../../Store'
import style from './ModalResetSketch.module.sass'

const ModalResetSketch = ({visible}: {visible: boolean}) => {

    // #region Variables
    const [
        initializer,
        modalResetSketchCaption,
        modalResetSketchButtonApproveText,
        modalResetSketchButtonRejectText,
        setModalResetSketch,

        resetSketch,
        resetAllBorderFilters,
        resetAllDeviceFilters,
        resetProject,
        resetRoom,
        resetCountOfSets,
        resetEditConfiguration,
    ] = useStore(state => [
        state.modalResetSketchInitializer,
        state.modalResetSketchCaption,
        state.modalResetSketchButtonApproveText,
        state.modalResetSketchButtonRejectText,
        state.setModalResetSketch,

        state.resetSketch,
        state.resetAllBorderFilters,
        state.resetAllDeviceFilters,
        state.resetProject,
        state.resetRoom,
        state.resetCountOfSets,
        state.resetEditConfiguration,
    ])
    // #endregion

    const onApprove = () => {

        // Сбрасываем выбранные фильтры
        if (initializer === 'resetFilters') {
            resetAllBorderFilters()
            resetAllDeviceFilters()
        }

        // Скрываем модалку
        setModalResetSketch(false, null)

        // Сбрасываем текущую конфигурацию на холсте
        resetSketch()
        resetProject()
        resetRoom()
        resetCountOfSets()

        // Сбрасываем редактируемую конфигурацию
        resetEditConfiguration()

        // Сбрасываем выбранный фон
        // resetBackground()

    }

    const onReject = () => {
        setModalResetSketch(false, null)
    }

    return (
        <Modal visible={visible} title={modalResetSketchCaption} onClose={onReject}>
            <div className={style.buttons}>
                <button onClick={onApprove}
                    className='button button_block button_lite button_small'>
                    { modalResetSketchButtonApproveText }
                </button>
                <button onClick={onReject}
                    className='button button_block button_dark button_small'>
                    { modalResetSketchButtonRejectText }
                </button>
            </div>
        </Modal>
    )
}

export default ModalResetSketch