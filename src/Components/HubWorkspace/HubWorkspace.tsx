import { useId, useMemo } from 'react'
import { InputAdd } from '../../Components'
import { TProjectList, TAppStore } from '../../types'
import { getFileName } from '../../Helpers'
import useStore from '../../Store'
import style from './HubWorkspace.module.sass'

const { hub, form, add, upload, blocks, title, list, item, name, actions } = style

const userToken = window.userToken

const getProjectsElms = (
    id: string,
    projects: TProjectList,
    editProject: TAppStore['editProject'],
    shareProject: TAppStore['shareProject'],
    removeProject: TAppStore['removeProject'],
    setDownloadProject:  TAppStore['setDownloadProject'],
    removeLocalProject: TAppStore['removeLocalProject'],
    copyProject: TAppStore['copyProject'],
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
                            title="Проект подробно">
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

                    {/* Copy project */}
                    { ( p.token === null || p.token !== userToken) &&
                        <li>
                            <button
                                onClick={() => copyProject(p.id, userToken)}
                                className="button button_dark"
                                title={`Скопировать проект себе${!userToken ? ' локально' : ''}`}>
                                <i className="icon icon_copy"></i>
                            </button>
                        </li>
                    }

                    {/* Remove project */}
                    { p.localProject &&
                        <li>
                            <button
                                onClick={() => removeLocalProject(p.id, p.name)}
                                className="button button_dark"
                                title="Удалить локальный проект">
                                <i className="icon icon_basket"></i>
                            </button>
                        </li>
                    }
                    { p.token && p.token === userToken &&
                        <li>
                            <button
                                onClick={() => removeProject(p.id, p.name)}
                                className="button button_dark"
                                title="Удалить проект">
                                <i className="icon icon_basket"></i>
                            </button>
                        </li>
                    }
                </ul>
            </li>
        )
    })
}

const HubWorkspace = () => {
    const id = useId()

    // #region Variables
    const [
        projects,
        addProject,
        editProject,
        shareProject,
        removeProject,
        modalLoadProjectSet,
        setDownloadProject,
        removeLocalProject,
        copyProject,
    ] = useStore(state => [
        state.projects,
        state.addProject,
        state.editProject,
        state.shareProject,
        state.removeProject,
        state.modalLoadProjectSet,
        state.setDownloadProject,
        state.removeLocalProject,
        state.copyProject,
    ])
    // #endregion

    const projectList = useMemo(
        () => getProjectsElms(id, projects, editProject, shareProject, removeProject, setDownloadProject, removeLocalProject, copyProject),
        [id, projects, editProject, shareProject, removeProject, setDownloadProject, removeLocalProject, copyProject]
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