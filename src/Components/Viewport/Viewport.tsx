import { Suspense, lazy } from 'react'
import { Loader } from '../../Components'
import useStore from '../../Store'
import style from './Viewport.module.sass'

const ConfiguratorWorkspace = lazy(() => import('../ConfiguratorWorkspace/ConfiguratorWorkspace'))
const CollectionsWorkspace = lazy(() => import('../CollectionsWorkspace/CollectionsWorkspace'))
const ProjectWorkspace = lazy(() => import('../ProjectWorkspace/ProjectWorkspace'))
const HubWorkspace = lazy(() => import('../HubWorkspace/HubWorkspace'))

const { body, body_block } = style

const Viewport = () => {
    const activeViewportTab = useStore(state => state.activeViewportTab)

    return (
        <Suspense fallback={<Loader/>}>
            <div className={activeViewportTab === 'configurator' ? body : `${body} ${body_block}`}>
                { activeViewportTab === 'configurator' && <ConfiguratorWorkspace /> }
                { activeViewportTab === 'collections' && <CollectionsWorkspace /> }
                { activeViewportTab === 'project' && <ProjectWorkspace /> }
                { activeViewportTab === 'hub' && <HubWorkspace /> }
            </div>
        </Suspense>
    )
}

export default Viewport