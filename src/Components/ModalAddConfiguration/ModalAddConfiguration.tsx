import { Modal } from '../../Components'
import style from './ModalAddConfiguration.module.sass'
import useStore from '../../Store'

const ModalAddConfiguration = ({ visible }: {visible: boolean}) => {

    // #region Variables
    const [
        modalAddConfigurationSet,
        editProject,
        projects
    ] = useStore(state => [
        state.modalAddConfigurationSet,
        state.editProject,
        state.projects
    ])
    // #endregion

    const onClose = () => modalAddConfigurationSet(false)

    const onApprove = () => {
        const currentProject = projects.filter(p => p.selected)

        if (currentProject.length) {
            editProject(currentProject[0].id)
        }

        modalAddConfigurationSet(false)
    }

    return (
        <Modal visible={visible} title='Комплект добавлен в проект' onClose={onClose}>
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

export default ModalAddConfiguration