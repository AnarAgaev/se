import { ProjectComposition } from '../../Components'
import { TAppStore, TProject, TAddProductsToCart, TDevice } from '../../types'
import { getFileName, formatNumber, getTotalProjectCost,
        collapseDevices, collapseAddProjectToCartRequestArr } from '../../Helpers'
import useStore from '../../Store'
import style from './ProjectWorkspace.module.sass'

const { wrap, wrapCenter, caption, title, subtitle,
    body, footer, actions, total } = style

const userToken = window.userToken

const getProjectActions = (
    project: TProject,
    shareProject: TAppStore['shareProject'],
    removeProject: TAppStore['removeProject'],
    modalLoadProjectSet: TAppStore['modalLoadProjectSet'],
    setDownloadProject: TAppStore['setDownloadProject'],
    copyProject: TAppStore['copyProject'],
    removeLocalProject: TAppStore['removeLocalProject']
): JSX.Element | null => {

    return !project
        ? null
        : <ul id='step_19' className={actions}>

            <li>
                <button
                    onClick={() => shareProject(project.id)}
                    className="button button_dark"
                    title="Поделиться проектом">
                    <i className='icon icon_share'></i>
                </button>
            </li>

            <li>
                <button
                    onClick={() => setDownloadProject({
                        project,
                        filename: getFileName(project.name, project.id)
                    })}
                    className="button button_dark"
                    title="Скачать проект как PDF файл">
                    <i className="icon icon_down"></i>
                </button>
            </li>

            <li>
                <button
                    onClick={() => modalLoadProjectSet(true, '')}
                    className="button button_dark"
                    title="Загрузить проект по ссылке">
                    <i className="icon icon_upload"></i>
                </button>
            </li>

            {/* Copy project */}
            { ( project.token === null || project.token !== userToken) &&
                <li>
                    <button
                        onClick={() => copyProject(project.id, userToken)}
                        className="button button_dark"
                        title={`Скопировать проект себе${!userToken ? ' локально' : ''}`}>
                        <i className="icon icon_copy"></i>
                    </button>
                </li>
            }

            {/* Remove project */}
            { (project.localProject || (project.token && project.token === userToken)) &&
                <li>
                    <button
                        onClick={() => project.localProject
                            ? removeLocalProject(project.id, project.name)
                            : removeProject(project.id, project.name)
                        }
                        className="button button_dark"
                        title={ project.localProject ? "Удалить локальный проект" : "Удалить проект" }>
                        <i className="icon icon_basket"></i>
                    </button>
                </li>
            }
        </ul>
}

const getAddProjectToCartRequestArr = (project: TProject): Parameters<TAddProductsToCart>[0]  => {

    const requestArr: Parameters<TAddProductsToCart>[0] = []

    if (!project.rooms) return requestArr

    project.rooms.forEach(room => {
        room.configurations.forEach(configuration => {

            const border = configuration.border
            const devices = configuration.devices as (TDevice | null)[] | undefined

            if (border) requestArr.push({
                type: 'border',
                article: border.article,
                count: configuration.count
            })

            if (devices && devices.length) {
                const selectedDevices = collapseDevices(devices)

                selectedDevices.forEach(device => {
                    requestArr.push({
                        type: 'device',
                        article: device.article,
                        count: device.selectedCount * configuration.count
                    })
                })
            }
        })
    })

    return collapseAddProjectToCartRequestArr(requestArr)
}

const ProjectWorkspace = () => {

    // #region Variables
    const [
        projects,
        setActiveTab,
        removeProject,
        shareProject,
        modalLoadProjectSet,
        setDownloadProject,
        addProductsToCart,
        copyProject,
        removeLocalProject
    ] = useStore(state => [
        state.projects,
        state.setActiveViewportTab,
        state.removeProject,
        state.shareProject,
        state.modalLoadProjectSet,
        state.setDownloadProject,
        state.addProductsToCart,
        state.copyProject,
        state.removeLocalProject
    ])
    // #endregion

    const project = projects.filter(p => p.edit)[0]

    const projectActions = getProjectActions(
        project, shareProject, removeProject,
        modalLoadProjectSet, setDownloadProject,
        copyProject, removeLocalProject
    )

    const totalProjectCost = getTotalProjectCost(project)

    let addToCartButtonClassName = 'button button_dark button_block'
    if (project && !project.rooms?.length) addToCartButtonClassName += ' disabled'

    const addToCartHandler = () => {
        addProductsToCart(
            getAddProjectToCartRequestArr(project)
        )
    }

    return !project

        ? <div className={wrapCenter}>
            <h2 className={title}>
                Вначале необходимо выбрать проект
            </h2>
            <p className={subtitle}>
                Перейдите на вкладку <button onClick={() => setActiveTab('hub')}>Мои проекты</button> и кликните по иконке <span><i></i> (Редактировать)</span> одного из проектов.
            </p>
        </div>

        : <div className={wrap}>
            <h2 className={caption}>
                <span id='step_17'>{project.name}</span>
            </h2>

            <div className={body}>
                <ProjectComposition project={project} />
                {/* <pre>
                    {JSON.stringify(project, null, 4)}
                </pre> */}
            </div>

            <footer className={footer}>
                { projectActions }
                <div id='step_20' className={total}>
                    { project && project.rooms?.length && totalProjectCost !== 0 &&
                        <p>
                            <span>Общая стоимость:</span>
                            <strong>{formatNumber(totalProjectCost)} р.</strong>
                        </p>
                    }
                    <button onClick={addToCartHandler}
                        className={`${addToCartButtonClassName}${totalProjectCost === 0 ? ' disabled' : ''}`}>
                        Добавить в корзину
                    </button>
                </div>
            </footer>
        </div>
}

export default ProjectWorkspace