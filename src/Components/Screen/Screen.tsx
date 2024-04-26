import useStore from '../../Store'
import style from './Screen.module.sass'

import { ConfiguratorWorkspace, CollectionsWorkspace,
    ProjectWorkspace, HubWorkspace } from '../../Components'

const { screenBody, tabsWrap, tabsList, tabsItem, tabsItem_active,
    tabsItem_configurator, tabsItem_collections,  tabsItem_project,
    tabsItem_hub } = style

const getTabClassName = (onTab: string, activeTab: string): string => {
    const modifiers: {[key: string]: string} = {
        'configurator': tabsItem_configurator,
        'collections': tabsItem_collections,
        'project': tabsItem_project,
        'hub': tabsItem_hub
    }

    return onTab === activeTab
        ? `${tabsItem}  ${modifiers[onTab]} ${tabsItem_active}`
        : `${tabsItem}  ${modifiers[onTab]}`
}

const Screen = () => {
    const activeTab = useStore(state => state.activeScreenTab)
    const setActiveTab = useStore(state => state.setActiveScreenTab)

    return (
        <div className={screenBody}>
            <div className={tabsWrap}>
                <ul className={tabsList}>
                    <li className={getTabClassName('configurator', activeTab)}
                        onClick={() => setActiveTab('configurator')}>
                        <span>
                            Конфигуратор
                        </span>
                    </li>
                    <li className={getTabClassName('collections', activeTab)}
                        onClick={() => setActiveTab('collections')}>
                        <span>
                            Гид по коллекциям
                        </span>
                    </li>
                    <li className={getTabClassName('project', activeTab)}
                        onClick={() => setActiveTab('project')}>
                        <span>
                            Состав проекта
                        </span>
                    </li>
                    <li className={getTabClassName('hub', activeTab)}
                        onClick={() => setActiveTab('hub')}>
                        <span>
                            Мои проекты
                        </span>
                    </li>
                </ul>
            </div>
            { activeTab === 'configurator' && <ConfiguratorWorkspace /> }
            { activeTab === 'collections' && <CollectionsWorkspace /> }
            { activeTab === 'project' && <ProjectWorkspace /> }
            { activeTab === 'hub' && <HubWorkspace /> }
        </div>
    )
}

export default Screen