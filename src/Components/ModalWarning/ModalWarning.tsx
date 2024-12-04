import useStore from '../../Store'
import style from './ModalWarning.module.sass'

const { modal, body, text, buttons, button } = style

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
        <div className={`modal-warning ${modal}`}>
            <div className={body}>
                <h3 className={text}>{modalWarningCaption}</h3>
                <div className={buttons}>
                    <button onClick={() => modalWarningSet(false, '', true)}
                        className={`button button_block button_dark ${button}`}>
                        Понятно
                    </button>
                    <button onClick={() => modalWarningSet(false, '', false)}
                        className={`button button_block button_dark ${button}`}>
                        Больше не показывать
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ModalWarning