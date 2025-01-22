import { Modal } from '../../Components'
import useStore from '../../Store'
import style from './ModalSavePDF.module.sass'

const ModalSavePDF = ({ visible }: {visible: boolean}) => {

    // #region Variables
    const [
        resetDownloadProject,
        filename,
        url
    ] = useStore(state => [
        state.resetDownloadProject,
        state.downloadProjectFilename,
        state.downloadProjectBlobUrl
    ])
    // #endregion


    const onClose = () => {
        resetDownloadProject()
    }

    const onNewWindow = () => {
        if (url) {
            window.open(url, '_blank')
        }

        resetDownloadProject()
    }

    const onSave = () => {
        if (url && filename) {
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', filename)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }

        resetDownloadProject()
    }

    return (
        <Modal
            visible={visible}
            title="Создали PDF файл проекта"
            onClose={onClose}>
            <div className={style.buttons}>
                <button
                    onClick={onNewWindow}
                    className='button button_block button_lite'>
                    Открыть в новом окне
                </button>
                <button
                    onClick={onSave}
                    className='button button_block button_dark'>
                    Сохранить на устройство
                </button>
            </div>
        </Modal>
    )
}

export default ModalSavePDF