import useStore from '../../Store'
import { TabsCalc, TabsPages } from '../../Components'
import style from './Tabs.module.sass'

const { tabs, configurator, pages } = style

const Tabs = () => {
    const activeViewportTab = useStore(state => state.activeViewportTab)

    return (
        <div className={tabs}>
            <div className={pages}>
                <TabsPages />
            </div>
            { activeViewportTab !== 'configurator'
                ? null
                : <div className={configurator}>
                    <TabsCalc />
                </div>
            }
        </div>
    )
}

export default Tabs