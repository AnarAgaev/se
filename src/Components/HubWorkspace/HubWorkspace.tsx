import { useId, useMemo } from 'react'
import { InputAdd } from '../../Components'
import { TProjectList, TAppStore } from '../../types'
import { getFileName } from '../../Helpers'
import useStore from '../../Store'
import style from './HubWorkspace.module.sass'

const { hub, form, add, upload, blocks, title,
    message, list, item, name, actions } = style

const getProjectsElms = (
    id: string,
    projects: TProjectList,
    editProject: TAppStore['editProject'],
    shareProject: TAppStore['shareProject'],
    removeProject: TAppStore['removeProject'],
    setDownloadProject:  TAppStore['setDownloadProject']
): JSX.Element[] => {

    return projects.map(p => {

        return (
            <li key={`${id}-${p.id}`} className={item}>
                <span className={name}>
                    {p.name}
                    <i>#{p.id}</i>
                </span>
                <ul className={actions}>
                    <li>
                        <button
                            onClick={() => editProject(p.id)}
                            className="button button_dark"
                            title="Редактировать проект">
                            <i className='icon icon_edit'></i>
                        </button>
                    </li>

                    <li>
                        <button
                            onClick={() => shareProject(p.id)}
                            className="button button_dark"
                            title="Поделиться проектом">
                            <i className='icon icon_share'></i>
                        </button>
                    </li>

                    <li>
                        <button
                            onClick={() => setDownloadProject({
                                project: p,
                                filename: getFileName(p.name, p.id)
                            })}
                            className="button button_dark"
                            title="Скачать проект как PDF файл">
                            <i className="icon icon_down"></i>
                        </button>
                    </li>

                    <li>
                        <button
                            onClick={() => removeProject(p.id, p.name)}
                            className="button button_dark"
                            title="Удалить проект">
                            <i className="icon icon_basket"></i>
                        </button>
                    </li>
                </ul>
            </li>
        )
    })
}

const HubWorkspace = () => {
    const id = useId()

    // #region Variables
    const [
        userId,
        projects,
        addProject,
        editProject,
        shareProject,
        removeProject,
        modalLoadProjectSet,
        setDownloadProject,
    ] = useStore(state => [
        state.userId,
        state.projects,
        state.addProject,
        state.editProject,
        state.shareProject,
        state.removeProject,
        state.modalLoadProjectSet,
        state.setDownloadProject,
    ])
    // #endregion

    const projectList = useMemo(
        () => getProjectsElms(id, projects, editProject, shareProject, removeProject, setDownloadProject),
        [id, projects, editProject, shareProject, removeProject, setDownloadProject]
    )

    return (
        <>
            <div className={hub}>
                <div className={form}>
                    <div className={add}>
                        <InputAdd placeholder="Создать новый проект" cbf={addProject} type='project' />
                    </div>
                    <div className={upload}>
                        <button type="button" className='button button_block button_dark'
                            onClick={() => modalLoadProjectSet(true, '')}>
                            Загрузить по ссылке
                            <i className="icon icon_upload"></i>
                        </button>
                    </div>
                </div>
                <div className={blocks}>
                    {!userId &&
                        <h3 className={message}>Чтобы сохранить проект или работать с сохраненными проектами, войдите на сайт.</h3>
                    }
                    <h3 className={title}>
                        { projects.length === 0
                                ? 'У Вас пока нет проектов. Создайте новый проект или загрузите проект по ссылке.'
                                : 'Список проектов'
                        }
                    </h3>
                    <ul className={list}>
                        { projectList }
                    </ul>
                </div>
            </div>
        </>
    )
}

export default HubWorkspace