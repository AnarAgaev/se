import { useRef, useState } from 'react'
import useStore from '../../Store'
import { Modal } from '../../Components'
import style from './ModalRenameProjectRoom.module.sass'

const { controllers, error, disabled } = style

const ModalRenameProjectRoom = ({ visible }: { visible: boolean }) => {

	const inputRef = useRef<HTMLInputElement | null>(null)
	const [newName, setNewName] = useState('')
	const [isError, setError] = useState(false)

	// #region Variables
	const [
		type,
		currentName,
		modalSet,
		projectId,
		roomId,
		updateProjectName,
		updateRoomName
	] = useStore((state) => [
		state.modalRenameProjectRoomType,
		state.modalRenameProjectRoomCurrentName,
		state.modalRenameProjectRoomSet,
		state.modalRenameProjectRoomProjectId,
		state.modalRenameProjectRoomRoomId,
		state.updateProjectName,
		state.updateRoomName
	])
	// #endregion

	const onClose = () => {
        modalSet(null, false, '', null, null)
		setNewName('')
        setError(false)
    }

    const onInput = () => {
        const controller = inputRef.current
        setNewName(controller ? controller.value : '')
		setError(false)
    }

    const onSend = () => {
        const controller = inputRef.current

        if (!controller) return

        if (controller.value === '') {
            setError(true)
            return
        }

		switch (type) {
			case 'project':
				projectId && updateProjectName(projectId, controller.value)
				break;

			case 'room':
				roomId && updateRoomName(roomId, controller.value)
				break;
		}

		onClose()
    }

    return (
        <Modal visible={visible}
            title={`Переименовать ${type === 'project' ? 'проект' : 'помещение'}:`}
            subtitle={currentName}
            onClose={onClose}
		>
			<div className={controllers}>
				<input
					ref={inputRef}
					value={newName}
					onChange={onInput}
					type='text'
					placeholder={`Напишите новое имя для ${type === 'project' ? 'проекта' : 'помещения'}`}
				/>
				{ isError && <p className={error}>Укажите корректное имя</p> }
				<button className={`button button_block button_dark button_small ${newName === '' ? disabled : ''}`} onClick={onSend}>
					Переименовать
				</button>
			</div>
        </Modal>
    )
}

export default ModalRenameProjectRoom
