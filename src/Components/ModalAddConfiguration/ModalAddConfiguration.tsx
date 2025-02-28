import { Modal } from '../../Components'
import style from './ModalAddConfiguration.module.sass'
import useStore from '../../Store'

const ModalAddConfiguration = ({ visible }: {visible: boolean}) => {

    // #region Variables
    const [
        modalAddConfigurationSet,
        editProject,
        projects,
        resetSketch,
        resetProject,
        resetRoom,
        resetCountOfSets,
        // resetEditConfiguration,
        resetBackground,
        resetAllBorderFilters,
        resetAllDeviceFilters,
        setActiveCalcTab
    ] = useStore(state => [
        state.modalAddConfigurationSet,
        state.editProject,
        state.projects,
        state.resetSketch,
        state.resetProject,
        state.resetRoom,
        state.resetCountOfSets,
        // state.resetEditConfiguration,
        state.resetBackground,
        state.resetAllBorderFilters,
        state.resetAllDeviceFilters,
        state.setActiveCalcTab
    ])
    // #endregion

    const onClose = () => modalAddConfigurationSet(false)

    const onApprove = () => {
        const currentProject = projects.filter(p => p.selected)

        if (currentProject.length) {
            editProject(currentProject[0].id)
        }

        modalAddConfigurationSet(false)

        // Сбрасываем текущую конфигурацию на холсте
        resetSketch()
        resetProject()
        resetRoom()
        resetCountOfSets()

        // Сбрасываем выбранные фильтры
        resetAllBorderFilters()
        resetAllDeviceFilters()

        // Сбрасываем редактируемую конфигурацию
        // resetEditConfiguration()

        // Сбрасываем выбранный фон
        resetBackground()

        // Сбрасываем активный таб конфигуратора в Рамки
        setActiveCalcTab('borders')
    }

    return (
        <Modal visible={visible} title='Комплект добавлен в проект' onClose={onClose}>
            <div className={style.buttons}>
                <button onClick={onClose}
                    className='button button_block button_lite button_small'>
                    Продолжить
                </button>
                <button onClick={onApprove}
                    className='button button_block button_dark button_small'>
                    Перейти в проект
                </button>
            </div>
        </Modal>
    )
}

export default ModalAddConfiguration