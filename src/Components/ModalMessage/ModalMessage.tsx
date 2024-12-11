import { Modal } from '../../Components'
import useStore from '../../Store'

const ModalMessage = ({ visible }: {visible: boolean}) => {

    // #region Variables
    const [
        modalMessageCaption,
        modalMessageSet
    ] = useStore(state => [
        state.modalMessageCaption,
        state.modalMessageSet
    ])
    // #endregion

    return (
        <Modal visible={visible} title={modalMessageCaption} onClose={() => modalMessageSet(false, '')}>
            <button onClick={() => modalMessageSet(false, '')}
                    className='button button_block button_dark'>
                    Понятно
            </button>
        </Modal>
    )
}

export default ModalMessage