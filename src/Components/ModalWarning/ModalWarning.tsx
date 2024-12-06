import { Modal } from '../../Components'
import useStore from '../../Store'
import style from './ModalWarning.module.sass'

const ModalWarning = () => {

    // #region Variables
    const [
        modalWarningCaption,
        modalWarningSet
    ] = useStore(state => [
        state.modalWarningCaption,
        state.modalWarningSet
    ])
    // #endregion

    return (
        <Modal title={modalWarningCaption} onClose={() => modalWarningSet(false, '', true)}>
            <div className={style.buttons}>
                <button onClick={() => modalWarningSet(false, '', false)}
                    className={`button button_block button_lite`}>
                    Больше не показывать
                </button>
                <button onClick={() => modalWarningSet(false, '', true)}
                    className={`button button_block button_dark`}>
                    Понятно
                </button>
            </div>
        </Modal>
    )
}

export default ModalWarning