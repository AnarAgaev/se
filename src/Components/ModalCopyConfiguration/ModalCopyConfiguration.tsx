import { useState, useMemo, useId, useEffect } from 'react'
import { Modal, Select, OptionLocation } from '../../Components'
import { TProjectList, TRoomList } from '../../types'
import useStore from '../../Store'
import style from './ModalCopyConfiguration.module.sass'

const { selectors, selector, error, disabled } = style

type TSelectedElement = {
    id?: string | number
    name?: string | undefined
    error: boolean
}

const getOptionsList = (
    key: string,
    projectsList: TProjectList |  TRoomList,
    selectedEl: TSelectedElement,
    setEl: React.Dispatch<React.SetStateAction<TSelectedElement>>
): JSX.Element[] => {
    return projectsList.map(el => <OptionLocation
        key={`${key}-${el.id}`}
        caption={el.name}
        isChecked={el.id === selectedEl.id}
        eventHandler={() => setEl({ id: el.id, name: el.name, error: false })}
    />)
}

const ModalCopyConfiguration = ({ visible }: {visible: boolean}) => {

    const key = useId()

    const [selectedProject, setProject] = useState<TSelectedElement>({error: false})
    const [selectedRoom, setRoom] = useState<TSelectedElement>({error: false})

    // #region Variables
    const [
        projects,
        rooms,
        modalCopyConfigurationCaption,
        modalCopyConfigurationSet,
        resetCurrentConfiguration,
        copyReplaceConfiguration
    ] = useStore(state => [
        state.projects,
        state.rooms,
        state.modalCopyConfigurationCaption,
        state.modalCopyConfigurationSet,
        state.resetCurrentConfiguration,
        state.copyReplaceConfiguration
    ])
    // #endregion

    useEffect(() => {
        setProject({error: false})
        setRoom({error: false})
    }, [visible])

    const projectsOptions = useMemo(
        () => getOptionsList(key, projects, selectedProject, setProject),
        [key, projects, selectedProject, setProject]
    )

    const roomsOptions = useMemo(
        () => getOptionsList(key, rooms, selectedRoom, setRoom),
        [key, rooms, selectedRoom, setRoom]
    )

    const onClose = () => {
        setProject({error: false})
        setRoom({error: false})
        modalCopyConfigurationSet(null, false, '')
        resetCurrentConfiguration()
    }

    const onSend = () => {
        if (!selectedProject.id) setProject({error: true})
        if (!selectedRoom.id) setRoom({error: true})

        if (!selectedProject.id || !selectedRoom.id) return
        if (selectedProject.error || selectedRoom.error) return
        if (!selectedRoom.name) return

        copyReplaceConfiguration(selectedProject.id, selectedRoom.id, selectedRoom.name)
    }

    let sendButtonClazz = 'button button_block button_dark'
    if (!selectedProject.id || !selectedRoom.id) sendButtonClazz += ` ${disabled}`

    return (
        <Modal visible={visible}
            title={modalCopyConfigurationCaption}
            subtitle='Выберите помещение в нужном проекте'
            onClose={onClose}>

            <div className={selectors}>
                <div className={selector}>
                    <Select title={selectedProject.id ? 'Проект' : 'Выберите проект'}
                        selectedValue={selectedProject ? selectedProject.name : undefined}>
                        { projectsOptions }
                    </Select>
                    <span style={{display: `${selectedProject?.error ? 'block' : 'none'}`}}
                        className={error}>Необходимо выбрать Проект</span>
                </div>
                <div className={selector}>
                    <Select title={selectedRoom.id ? 'Помещение' : 'Выберите помещение'}
                        selectedValue={selectedRoom ? selectedRoom.name : undefined}>
                        { roomsOptions }
                    </Select>
                    <span style={{display: `${selectedRoom?.error ? 'block' : 'none'}`}}
                        className={error}>Необходимо выбрать Помещение</span>
                </div>
            </div>

            <button className={sendButtonClazz} onClick={onSend}>
                {modalCopyConfigurationCaption}
            </button>
        </Modal>
    )
}

export default ModalCopyConfiguration