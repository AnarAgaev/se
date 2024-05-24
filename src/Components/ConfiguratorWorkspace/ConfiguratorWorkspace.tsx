import { Sketch } from '../../Components'
import style from './ConfiguratorWorkspace.module.sass'

const ConfiguratorWorkspace = () => {
    return (
        <div className={style.configuratorWorkspace}>
            <Sketch />
        </div>
    )
}

export default ConfiguratorWorkspace