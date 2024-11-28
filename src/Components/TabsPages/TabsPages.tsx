import useStore from '../../Store'
import style from './TabsPages.module.sass'
import { TViewportTabs } from '../../types'

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
    const activeViewportTab = useStore(state => state.activeViewportTab)
    const setActiveTab = useStore(state => state.setActiveViewportTab)
    const setVisible = useStore(state => state.setVisible)

    const clickHandler = (page: TViewportTabs) => {
        setActiveTab(page)

        if (page === 'configurator') setVisible(false)
    }

    return (
        <div className={tabs}>
            <ul className={list}>
                <li className={getTabClassName('configurator', activeViewportTab)}
                    onClick={() => clickHandler('configurator')}>
                    <span>
                        Конфигуратор
                    </span>
                </li>
                <li className={getTabClassName('collections', activeViewportTab)}
                    onClick={() => clickHandler('collections')}>
                    <span>
                        Гид по коллекциям
                    </span>
                </li>
                <li className={getTabClassName('project', activeViewportTab)}
                    onClick={() => clickHandler('project')}>
                    <span>
                        Состав проекта
                    </span>
                </li>
                <li className={getTabClassName('hub', activeViewportTab)}
                    onClick={() => clickHandler('hub')}>
                    <span>
                        Мои проекты
                    </span>
                </li>
            </ul>
        </div>
    )
}

export default TabsPages