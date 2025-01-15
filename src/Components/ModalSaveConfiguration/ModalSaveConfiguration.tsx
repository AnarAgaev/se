import { Modal } from '../../Components'
import style from './ModalSaveConfiguration.module.sass'
import useStore from '../../Store'

const ModalSaveConfiguration = ({ visible }: {visible: boolean}) => {

    // #region Variables
    const [
        modalSaveConfigurationSet,
        setActiveViewportTab,
    ] = useStore(state => [
        state.modalSaveConfigurationSet,
        state.setActiveViewportTab
    ])
    // #endregion

    const onClose = () => modalSaveConfigurationSet(false)

    const onApprove = () => {
        setActiveViewportTab('project')
        modalSaveConfigurationSet(false)
    }

    return (
        <Modal visible={visible} title='Комплект сохранён' onClose={onClose}>
            <div className={style.buttons}>
                <button onClick={onClose}
                    className='button button_block button_lite'>
                    Продолжить
                </button>
                <button onClick={onApprove}
                    className='button button_block button_dark'>
                    Перейти в проект
                </button>
            </div>
        </Modal>
    )
}

export default ModalSaveConfiguration