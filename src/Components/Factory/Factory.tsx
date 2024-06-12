import { BordersWorkspace, DevicesWorkspace, BackgroundsWorkspace } from '../../Components'
import useStore from '../../Store'
import style from './Factory.module.sass'

const { factory } = style

const Factory = () => {
    const activeViewportTab = useStore(state => state.activeViewportTab)
    const activeCalcTab = useStore(state => state.activeCalcTab)

    if (activeViewportTab !== 'configurator') return null

    return (
        <div className={factory}>
            { activeCalcTab === 'borders' && <BordersWorkspace /> }
            { activeCalcTab === 'devices' && <DevicesWorkspace /> }
            { activeCalcTab === 'backgrounds' && <BackgroundsWorkspace /> }
        </div>
    )
}

export default Factory