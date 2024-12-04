import useStore from '../../Store'
import style from './ModalMessage.module.sass'

const { modal, body, text, button } = style

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
        <div className={modal}>
            <div className={body}>
                <h3 className={text}>{modalMessageCaption}</h3>
                <button onClick={() => modalMessageSet(false, '')}
                    className={`button button_block button_dark ${button}`}>
                    Понятно
                </button>
            </div>
        </div>
    )
}

export default ModalMessage