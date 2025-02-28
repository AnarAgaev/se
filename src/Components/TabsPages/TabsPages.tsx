import useStore from '../../Store'
import style from './TabsPages.module.sass'

const { tabs, list, item,
    item_active, item_configurator, item_collections,
    item_project, item_hub } = style

const getTabClassName = (onTab: string, activeTab: string): string => {
    const modifiers: {[key: string]: string} = {
        'configurator': item_configurator,
        'collections': item_collections,
        'project': item_project,
        'hub': item_hub
    }

    return onTab === activeTab
        ? `${item}  ${modifiers[onTab]} ${item_active}`
        : `${item}  ${modifiers[onTab]}`
}

const TabsPages = () => {

    // #region Variables
    const [
        activeViewportTab,
        setActiveTab
    ] = useStore(state => [
        state.activeViewportTab,
        state.setActiveViewportTab
    ])
    // #endregion

    return (
        <div className={tabs}>
            <ul className={list}>
                <li id='step_1' className={getTabClassName('configurator', activeViewportTab)}
                    onClick={() => setActiveTab('configurator')}>
                    <span>
                        Конфигуратор
                    </span>
                </li>
                <li id='step_2' className={getTabClassName('collections', activeViewportTab)}
                    onClick={() => setActiveTab('collections')}>
                    <span>
                        Гид по коллекциям
                    </span>
                </li>
                <li id='step_4' className={getTabClassName('project', activeViewportTab)}
                    onClick={() => setActiveTab('project')}>
                    <span>
                        Состав проекта
                    </span>
                </li>
                <li id='step_3' className={getTabClassName('hub', activeViewportTab)}
                    onClick={() => setActiveTab('hub')}>
                    <span>
                        Мои проекты
                    </span>
                </li>
            </ul>
        </div>
    )
}

export default TabsPages