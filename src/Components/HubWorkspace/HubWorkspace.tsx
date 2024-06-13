import { useId, useMemo } from 'react'
import { InputAdd } from '../../Components'
import useStore from '../../Store'
import style from './HubWorkspace.module.sass'

const { hub, form, add, upload, blocks, title, list, item, name, actions,
    button, button_edit, button_share, button_cloud, button_cart } = style

const getProjectsElms = (
    projects: Record<string, unknown>,
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

const MyProjectsWorkspace = () => {
    const id = useId()
    const projects = useStore(state => state.projects)
    const addProject = useStore(state => state.addProject)

    const projectList = useMemo(
        () => getProjectsElms(projects, id),
        [projects, id]
    )

    return (
        <div className={hub}>
            <div className={form}>
                <div className={add}>
                    <InputAdd placeholder="Создать новый проект" cbf={addProject} />
                </div>
                <div className={upload}>
                    <button type="button" className='button button_block button_dark'>
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
    )
}

export default MyProjectsWorkspace