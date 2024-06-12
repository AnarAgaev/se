import { TabsCalc, TabsPages } from '../../Components'
import style from './Tabs.module.sass'

const { tabs, configurator, pages } = style

const Tabs = () => {
    return (
        <div className={tabs}>
            <div className={pages}>
                <TabsPages />
            </div>
            <div className={configurator}>
                <TabsCalc />
            </div>
        </div>
    )
}

export default Tabs