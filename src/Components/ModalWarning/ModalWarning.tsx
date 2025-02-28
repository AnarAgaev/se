import { Modal } from '../../Components'
import useStore from '../../Store'
import style from './ModalWarning.module.sass'

const ModalWarning = ({visible}: {visible: boolean}) => {

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
        <Modal visible={visible} title={modalWarningCaption} onClose={() => modalWarningSet(false, '', true)}>
            <div className={style.buttons}>
                {/* <button onClick={() => modalWarningSet(false, '', false)}
                    className={`button button_block button_lite`}>
                    Больше не показывать
                </button> */}
                <button onClick={() => modalWarningSet(false, '', false)}
                    className={`button button_block button_dark button_small`}>
                    Больше не показывать
                </button>
            </div>
        </Modal>
    )
}

export default ModalWarning