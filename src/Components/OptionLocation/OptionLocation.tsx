import { EditNameButton } from '../../Components'
import useStore from '../../Store'
import style from './OptionLocation.module.sass'

type TProps = {
    caption: string
    isChecked: boolean
    eventHandler: () => void
    locationType: 'project' | 'room'
	editable?: boolean
}

const { option, text } = style

const OptionLocation = ({ caption, isChecked, eventHandler, editable, locationType }: TProps) => {

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
                            caption
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
