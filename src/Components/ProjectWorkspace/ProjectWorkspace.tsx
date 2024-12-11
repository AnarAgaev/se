import { PDFDownloadLink } from '@react-pdf/renderer'
import { PdfDocument } from '../../Components'
import { getFileName } from '../../Helpers'
import { TAppStore, TProject } from '../../types'
import useStore from '../../Store'
import style from './ProjectWorkspace.module.sass'

const { wrap, wrapCenter, caption, title, subtitle,
    body, footer, actions, total } = style

const getProjectActions = (
    project: TProject,
    shareProject: TAppStore['shareProject'],
    removeProject: TAppStore['removeProject']
): JSX.Element => {
    return (
        <ul className={actions}>
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

            <li title="Что-то сделать, не знаю что. А если не знаешь, то, конечно же, спроси и Лили!">
                <button className="button button_dark">
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
    )
}

const ProjectWorkspace = () => {

    // #region Variables
    const [
        projects,
        setActiveTab,
        removeProject,
        shareProject
    ] = useStore(state => [
        state.projects,
        state.setActiveViewportTab,
        state.removeProject,
        state.shareProject
    ])
    // #endregion

    const project = projects.filter(p => p.edit)[0]

    return !project

        ? ( <div className={wrapCenter}>
                <h2 className={title}>
                    Вначале необходимо выбрать проект
                </h2>
                <p className={subtitle}>
                    Перейдите на вкладку <button onClick={() => setActiveTab('hub')}>Мои проекты</button> и кликните по иконке <span><i></i> (Редактировать)</span> одного из проектов.
                </p>
            </div> )

        : ( <div className={wrap}>
            <h2 className={caption}>{project.name}</h2>

            <div className={body}>


            </div>

            <footer className={footer}>
                { getProjectActions(project, shareProject, removeProject) }
                <div className={total}>
                    <p>
                        <span>Общая стоимость:</span>
                        <strong>123 078.19 ₽</strong>
                    </p>
                    <button className='button button_dark button_block'>Добавить в корзину</button>
                </div>
            </footer>
        </div>
    )
}

export default ProjectWorkspace