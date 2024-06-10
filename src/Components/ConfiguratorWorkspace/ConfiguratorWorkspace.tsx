import { Sketch, Cart } from '../../Components'
import style from './ConfiguratorWorkspace.module.sass'

const ConfiguratorWorkspace = () => {
    return (
        <div className={style.configuratorWorkspace}>
            <Sketch />
            <Cart />
        </div>
    )
}

export default ConfiguratorWorkspace