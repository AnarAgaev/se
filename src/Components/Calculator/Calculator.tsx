import useStore from '../../Store'
import { BordersWorkspace, MechanicsWorkspace, BackgroundsWorkspace } from '../../Components'
import style from './Calculator.module.sass'

const { calculatorBody, tabsList, tabsItem, tabsItem_active } = style

const getTabClassName = (onTab: string, activeTab: string): string => {
    return onTab === activeTab
        ? `${tabsItem} ${tabsItem_active}`
        : `${tabsItem}`
}

const Calculator = () => {
    const activeTab = useStore(state => state.activeCalcTab)
    const setActiveTab = useStore(state => state.setActiveCalcTab)

    return (
        <div className={calculatorBody}>
            <ul className={tabsList}>
                <li className={getTabClassName('borders', activeTab)}
                    onClick={() => setActiveTab('borders')}>
                        Рамки
                </li>
                <li className={getTabClassName('mechanics', activeTab)}
                    onClick={() => setActiveTab('mechanics')}>
                        Механизмы
                </li>
                <li className={getTabClassName('backgrounds', activeTab)}
                    onClick={() => setActiveTab('backgrounds')}>
                        Фон
                </li>
            </ul>
            { activeTab === 'borders' && <BordersWorkspace /> }
            { activeTab === 'mechanics' && <MechanicsWorkspace /> }
            { activeTab === 'backgrounds' && <BackgroundsWorkspace /> }
        </div>
    )
}

export default Calculator