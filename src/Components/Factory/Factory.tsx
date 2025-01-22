import { Suspense, lazy } from 'react'
import { Loader } from '../../Components'
import useStore from '../../Store'
import style from './Factory.module.sass'

const BordersWorkspace = lazy(() => import('../BordersWorkspace/BordersWorkspace'))
const DevicesWorkspace = lazy(() => import('../DevicesWorkspace/DevicesWorkspace'))
const BackgroundsWorkspace = lazy(() => import('../BackgroundsWorkspace/BackgroundsWorkspace'))

const Factory = () => {
    const activeViewportTab = useStore(state => state.activeViewportTab)
    const activeCalcTab = useStore(state => state.activeCalcTab)

    if (activeViewportTab !== 'configurator') return null

    const loadingTextMap = {
        'borders': 'Загружаем рамки',
        'devices': 'Загружаем устройства',
        'backgrounds': 'Загружаем обои'
    }

    const loadingText = loadingTextMap[activeCalcTab]

    return (
        <Suspense fallback={ <Loader text={loadingText} /> }>
            <div className={style.factory}>
                { activeCalcTab === 'borders' && <BordersWorkspace /> }
                { activeCalcTab === 'devices' && <DevicesWorkspace /> }
                { activeCalcTab === 'backgrounds' && <BackgroundsWorkspace /> }
            </div>
        </Suspense>
    )
}

export default Factory