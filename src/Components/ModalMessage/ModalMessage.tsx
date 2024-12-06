import { Modal } from '../../Components'
import useStore from '../../Store'

const ModalMessage = () => {

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
        <Modal title={modalMessageCaption} onClose={() => modalMessageSet(false, '')}>
            <button onClick={() => modalMessageSet(false, '')}
                    className='button button_block button_dark'>
                    Понятно
            </button>
        </Modal>
    )
}

export default ModalMessage