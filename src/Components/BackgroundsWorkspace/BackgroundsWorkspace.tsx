import { BackgroundPicker, BackgroundList } from '../../Components'
import style from './BackgroundsWorkspace.module.sass'

const BackgroundsWorkspace = () => {
    return (
        <div className={style.backgroundsWorkspace}>
            <BackgroundPicker />
            <BackgroundList />
        </div>
    )
}

export default BackgroundsWorkspace