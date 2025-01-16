import { Modal } from '../../Components'
import useStore from '../../Store'
import style from './ModalResetSketch.module.sass'

const ModalResetSketch = ({visible}: {visible: boolean}) => {

    // #region Variables
    const [
        modalResetSketchCaption,
        modalResetSketchButtonApproveText,
        modalResetSketchButtonRejectText,
        setModalResetSketch,
        resetSketch
    ] = useStore(state => [
        state.modalResetSketchCaption,
        state.modalResetSketchButtonApproveText,
        state.modalResetSketchButtonRejectText,
        state.setModalResetSketch,
        state.resetSketch
    ])
    // #endregion

    const onApprove = () => {
        resetSketch()
        setModalResetSketch(false)
    }

    const onReject = () => {
        setModalResetSketch(false)
    }

    return (
        <Modal visible={visible} title={modalResetSketchCaption} onClose={onReject}>
            <div className={style.buttons}>
                <button onClick={onApprove}
                    className='button button_block button_lite'>
                    { modalResetSketchButtonApproveText }
                </button>
                <button onClick={onReject}
                    className='button button_block button_dark'>
                    { modalResetSketchButtonRejectText }
                </button>
            </div>
        </Modal>
    )
}

export default ModalResetSketch