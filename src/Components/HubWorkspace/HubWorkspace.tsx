import { useId, useMemo, useState } from 'react'
import { InputAdd } from '../../Components'
import { TProjectList } from '../../types'
import useStore from '../../Store'
import style from './HubWorkspace.module.sass'

const { hub, form, add, upload, blocks, title, list, item, name, actions,
    button, button_edit, button_share, button_cloud, button_cart,
    modal, modal_show, close, content, caption, controllers } = style

const getProjectsElms = (
    projects: TProjectList,
    id: string
): JSX.Element[] => {

    const elList: JSX.Element[] = []
    const names = Object.keys(projects)

    names.forEach(project => elList.push(
        <li key={`${id}-${project}`} className={item}>
            <span className={name}>{project}</span>
            <ul className={actions}>
                <li className={`${button} ${button_edit}`}></li>
                <li className={`${button} ${button_share}`}></li>
                <li className={`${button} ${button_cloud}`}></li>
                <li className={`${button} ${button_cart}`}></li>
            </ul>
        </li>
    ))

    return elList
}

const HubWorkspace = () => {
    const id = useId()
    const projects = useStore(state => state.projects)
    const addProject = useStore(state => state.addProject)
    const [showModal, toggleShowModal] = useState(false)

    const projectList = useMemo(
        () => getProjectsElms(projects, id),
        [projects, id]
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
                    <h3 className={title}>Список проектов</h3>
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