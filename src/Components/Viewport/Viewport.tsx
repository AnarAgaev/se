import useStore from '../../Store'
import style from './Viewport.module.sass'

import { ConfiguratorWorkspace, CollectionsWorkspace,
    ProjectWorkspace, HubWorkspace } from '../../Components'

const { body, body_block } = style

const Viewport = () => {
    const activeViewportTab = useStore(state => state.activeViewportTab)

    return (
        <div className={activeViewportTab === 'configurator' ? body : `${body} ${body_block}`}>
            { activeViewportTab === 'configurator' && <ConfiguratorWorkspace /> }
            { activeViewportTab === 'collections' && <CollectionsWorkspace /> }
            { activeViewportTab === 'project' && <ProjectWorkspace /> }
            { activeViewportTab === 'hub' && <HubWorkspace /> }
        </div>
    )
}

export default Viewport