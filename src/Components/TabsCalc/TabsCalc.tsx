import useStore from '../../Store'
import style from './TabsCalc.module.sass'

const { list, item, item_active } = style

const getTabClassName = (onTab: string, activeTab: string): string => {
    return onTab === activeTab
        ? `${item} ${item_active}`
        : `${item}`
}

const TabsCalc = () => {
    const activeViewportTab = useStore(state => state.activeViewportTab)
    const activeCalcTab = useStore(state => state.activeCalcTab)
    const setActiveTab = useStore(state => state.setActiveCalcTab)

    if (activeViewportTab !== 'configurator') return null

    return (
        <ul className={list}>
            <li className={getTabClassName('borders', activeCalcTab)}
                onClick={() => setActiveTab('borders')}>
                    Рамки
            </li>
            <li className={getTabClassName('devices', activeCalcTab)}
                onClick={() => setActiveTab('devices')}>
                    Механизмы
            </li>
            <li className={getTabClassName('backgrounds', activeCalcTab)}
                onClick={() => setActiveTab('backgrounds')}>
                    Фон
            </li>
        </ul>
    )
}

export default TabsCalc