import useStore from '../../Store'
import style from './TabsCalc.module.sass'

const { list, item, item_active } = style

const getTabClassName = (onTab: string, activeTab: string): string => {
    return onTab === activeTab
        ? `${item} ${item_active}`
        : `${item}`
}

const TabsCalc = () => {
    const activeCalcTab = useStore(state => state.activeCalcTab)
    const setActiveTab = useStore(state => state.setActiveCalcTab)

    return (
        <ul id='tabs' className={list}>
            <li className={getTabClassName('borders', activeCalcTab)}
                onClick={() => setActiveTab('borders')}>
                    <span id='step_1'>Рамки</span>
            </li>
            <li className={getTabClassName('devices', activeCalcTab)}
                onClick={() => setActiveTab('devices')}>
                    <span id='step_3'>Механизмы</span>
            </li>
            <li className={getTabClassName('backgrounds', activeCalcTab)}
                onClick={() => setActiveTab('backgrounds')}>
                    <span id='step_4'>Фон</span>
            </li>
        </ul>
    )
}

export default TabsCalc