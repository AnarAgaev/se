import { useId, useMemo, useState } from 'react'
import { InputAdd } from '../../Components'
import { TProjectList, TAppStore } from '../../types'
import useStore from '../../Store'
import style from './HubWorkspace.module.sass'

const { hub, form, add, upload, blocks, title, message, list, item, name, actions,
    button, button_edit, button_share, button_down, button_cart,
    modal, modal_show, close, content, caption, controllers } = style

const getProjectsElms = (
    id: string,
    projects: TProjectList,
    editProject: TAppStore['editProject'],
    shareProject: TAppStore['shareProject']
): JSX.Element[] => {

    return projects.map(p => (
        <li key={`${id}-${p.id}`} className={item}>
            <span className={name}>
                {p.name}
                <i>#{p.id}</i>
            </span>
            <ul className={actions}>
                <li className={`${button} ${button_edit}`}
                    onClick={() => editProject(p.id)}
                    title="Редактировать проект"></li>

                <li className={`${button} ${button_share}`}
                    onClick={() => shareProject(p.id)}
                    title="Поделиться проектом"></li>

                <li className={`${button} ${button_down}`}
                    title="Скачать проект"></li>

                <li className={`${button} ${button_cart}`}
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
        shareProject
    ] = useStore(state => [
        state.userId,
        state.projects,
        state.addProject,
        state.editProject,
        state.shareProject
    ])
    // #endregion

    const [showModal, toggleShowModal] = useState(false)

    const projectList = useMemo(
        () => getProjectsElms(id, projects, editProject, shareProject),
        [id, projects, editProject, shareProject]
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
                            onClick={() => toggleShowModal(true)}>
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

            <div className={ showModal ? `${modal} ${modal_show}` : modal }>
                <button type='button' className={close}
                    onClick={() => toggleShowModal(false)}></button>
                <div className={content}>
                    <h4 className={caption}>
                        Загрузить проект по ссылке
                    </h4>
                    <div className={controllers}>
                        <input type="text" placeholder='Вставьте ссылку на проект' />
                        <button type='button' className='button button_dark'
                            onClick={() => toggleShowModal(false)}>
                            Примерить
                            <i className='icon  icon_check'></i>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HubWorkspace