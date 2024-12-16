import { useMemo } from 'react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { PdfDocument, ProjectComposition } from '../../Components'
import { getFileName, formatNumber } from '../../Helpers'
import { TAppStore, TProject } from '../../types'
import useStore from '../../Store'
import style from './ProjectWorkspace.module.sass'

const { wrap, wrapCenter, caption, title, subtitle,
    body, footer, actions, total } = style

const getProjectActions = (
    project: TProject,
    shareProject: TAppStore['shareProject'],
    removeProject: TAppStore['removeProject'],
    modalLoadProjectSet: TAppStore['modalLoadProjectSet']
): JSX.Element | null => {
    return !project
        ? null
        : <ul className={actions}>

        <li>
            <button
                onClick={() => shareProject(project.id)}
                className="button button_dark"
                title="Поделиться проектом">
                <i className='icon icon_share'></i>
            </button>
        </li>

        <li>
            <PDFDownloadLink
                document={ <PdfDocument project={project} /> }
                fileName={ getFileName(project.name, project.id) }>
                <button
                    className="button button_dark"
                    title="Скачать проект">
                    <i className="icon icon_down"></i>
                </button>
            </PDFDownloadLink>
        </li>

        <li>
            <button
                onClick={() => modalLoadProjectSet(true, '')}
                className="button button_dark"
                title="Загрузить проект по ссылке">
                <i className="icon icon_upload"></i>
            </button>
        </li>

        <li>
            <button
                onClick={() => removeProject(project.id, project.name)}
                className="button button_dark"
                title="Удалить проект">
                <i className="icon icon_basket"></i>
            </button>
        </li>

    </ul>
}

const ProjectWorkspace = () => {

    // #region Variables
    const [
        projects,
        setActiveTab,
        removeProject,
        shareProject,
        modalLoadProjectSet
    ] = useStore(state => [
        state.projects,
        state.setActiveViewportTab,
        state.removeProject,
        state.shareProject,
        state.modalLoadProjectSet
    ])
    // #endregion

    const project = projects.filter(p => p.edit)[0]

    const projectActions = useMemo(() => getProjectActions(project, shareProject, removeProject, modalLoadProjectSet), [
        project, shareProject, removeProject, modalLoadProjectSet
    ])

    const getTotalCost = () => {
        const rooms = project.rooms

        let total = 0

        if (!rooms) return null

        for (const r of rooms) {
            const configurations = r.configurations

            for (const c of configurations) {

                let totalConfigurationsCost = typeof c.border.price === 'string'
                    ? parseFloat(c.border.price)
                    : c.border.price

                for (const d of c.devices) {
                    totalConfigurationsCost += typeof d.price === 'string'
                        ? parseFloat(d.price)
                        : d.price
                }

                total += (totalConfigurationsCost * c.count)
            }
        }

        return total
    }

    const totalProjectCost = getTotalCost()

    let addToCartButtonClassName = 'button button_dark button_block'
    if (project && !project.rooms?.length) addToCartButtonClassName += ' disabled'

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
            <h2 className={caption}>{project.name}</h2>

            <div className={body}>
                <ProjectComposition project={project} />
                {/* <pre>
                    {JSON.stringify(project, null, 4)}
                </pre> */}
            </div>

            <footer className={footer}>
                { projectActions }
                <div className={total}>
                    { project && project.rooms?.length && totalProjectCost &&
                        <p>
                            <span>Общая стоимость:</span>
                            <strong>{formatNumber(totalProjectCost)} р.</strong>
                        </p>
                    }
                    <button className={addToCartButtonClassName}>Добавить в корзину</button>
                </div>
            </footer>
        </div>
}

export default ProjectWorkspace