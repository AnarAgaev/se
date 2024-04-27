import { BackgroundPicker } from '../../Components'
import style from './BackgroundsWorkspace.module.sass'

const { backgroundsWorkspace } = style

const BackgroundsWorkspace = () => {

    return (
        <div className={backgroundsWorkspace}>
            <BackgroundPicker />
        </div>
    )
}

export default BackgroundsWorkspace