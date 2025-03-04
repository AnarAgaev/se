import { Modal } from '../../Components'
import useStore from '../../Store'

const ModalMessage = ({ visible }: {visible: boolean}) => {

    // #region Variables
    const [
        modalMessageSet,
        modalMessageCaption,
        modalMessageText
    ] = useStore(state => [
        state.modalMessageSet,
        state.modalMessageCaption,
        state.modalMessageText
    ])
    // #endregion

    return (
        <Modal
            visible={visible}
            title={modalMessageCaption}
            subtitle={modalMessageText ?? modalMessageText}
            onClose={() => modalMessageSet(false, '')}>
        </Modal>
    )
}

export default ModalMessage