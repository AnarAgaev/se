import useStore from '../../Store'
import { BordersWorkspace, DevicesWorkspace, BackgroundsWorkspace } from '../../Components'
import style from './Factory.module.sass'

const { factoryBody, tabsList, tabsItem, tabsItem_active } = style

const getTabClassName = (onTab: string, activeTab: string): string => {
    return onTab === activeTab
        ? `${tabsItem} ${tabsItem_active}`
        : `${tabsItem}`
}

const Factory = () => {
    const activeTab = useStore(state => state.activeCalcTab)
    const setActiveTab = useStore(state => state.setActiveCalcTab)

    return (
        <div className={factoryBody}>
            <ul className={tabsList}>
                <li className={getTabClassName('borders', activeTab)}
                    onClick={() => setActiveTab('borders')}>
                        Рамки
                </li>
                <li className={getTabClassName('devices', activeTab)}
                    onClick={() => setActiveTab('devices')}>
                        Механизмы
                </li>
                <li className={getTabClassName('backgrounds', activeTab)}
                    onClick={() => setActiveTab('backgrounds')}>
                        Фон
                </li>
            </ul>
            { activeTab === 'borders' && <BordersWorkspace /> }
            { activeTab === 'devices' && <DevicesWorkspace /> }
            { activeTab === 'backgrounds' && <BackgroundsWorkspace /> }
        </div>
    )
}

export default Factory