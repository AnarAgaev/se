import { useId, useMemo } from 'react'
import { InputAdd } from '../../Components'
import { TProjectList, TAppStore } from '../../types'
import useStore from '../../Store'
import style from './HubWorkspace.module.sass'

const { hub, form, add, upload, blocks, title, message, list, item, name, actions,
    button, button_edit, button_share, button_down, button_cart } = style

const getProjectsElms = (
    id: string,
    projects: TProjectList,
    editProject: TAppStore['editProject'],
    shareProject: TAppStore['shareProject'],
    removeProject: TAppStore['removeProject']
): JSX.Element[] => {

    return projects.map(p => (
        <li key={`${id}-${p.id}`} className={item}>
            <span className={name}>
                {p.name}
                <i>#{p.id}</i>
            </span>
            <ul className={actions}>
                <li onClick={() => editProject(p.id)}
                    className={`${button} ${button_edit}`}
                    title="Редактировать проект"></li>

                <li onClick={() => shareProject(p.id)}
                    className={`${button} ${button_share}`}
                    title="Поделиться проектом"></li>

                <li className={`${button} ${button_down}`}
                    title="Скачать проект"></li>

                <li onClick={() => removeProject(p.id, p.name)}
                    className={`${button} ${button_cart}`}
                    title="Удалить проект"></li>
            </ul>
        </li>
    ))
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
        modalLoadProjectSet
    ] = useStore(state => [
        state.userId,
        state.projects,
        state.addProject,
        state.editProject,
        state.shareProject,
        state.removeProject,
        state.modalLoadProjectSet
    ])
    // #endregion

    const projectList = useMemo(
        () => getProjectsElms(id, projects, editProject, shareProject, removeProject),
        [id, projects, editProject, shareProject, removeProject]
    )

    return (
        <>
            <div className={hub}>
                <div className={form}>
                    <div className={add}>
                        <InputAdd placeholder="Создать новый проект" cbf={addProject} />
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