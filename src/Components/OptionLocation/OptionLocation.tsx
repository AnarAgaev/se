import { EditNameButton } from '../../Components'
import useStore from '../../Store'
import style from './OptionLocation.module.sass'

type TProps = {
    caption: string
    isChecked: boolean
    eventHandler: () => void
    locationType: 'project' | 'room'
	editable?: boolean,
	projectId: string | number | null,
	roomId: string | number | null
}

const { option, text } = style

const OptionLocation = ({ caption, isChecked, eventHandler, editable, locationType, projectId, roomId }: TProps) => {

    // #region Variables
    const [
        modalRenameProjectRoomSet
    ] = useStore(state => [
        state.modalRenameProjectRoomSet
    ])
    // #endregion


    return (
        <li className='closing'>
            <label className={option} title={caption}>
                <input
                    className='invisible'
                    type='checkbox'
                    checked={isChecked}
                    onChange={eventHandler} />
                <span></span>
                <mark className={text}>{caption}</mark>
				{ !editable &&
                    <EditNameButton
                        cbf={() => modalRenameProjectRoomSet(
                            locationType,
                            true,
                            caption,
							projectId,
							roomId
                        )}
                        size='small'
                        title={`Переименовать ${locationType === 'project' ? 'проект' : 'помещение'}`}
                    />
				}
            </label>
        </li>
    )
}

export default OptionLocation
