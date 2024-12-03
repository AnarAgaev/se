import useStore from '../../Store'
import style from './ProjectWorkspace.module.sass'

const { wrap, wrapCenter, caption, title, subtitle, body, footer, actions,total } = style

const ProjectWorkspace = () => {

    // #region Variables
    const [
        projects,
        setActiveTab
    ] = useStore(state => [
        state.projects,
        state.setActiveViewportTab
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
            <h2 className={caption}>Название проекта</h2>

            <div className={body}>


            </div>

            <footer className={footer}>
                <ul className={actions}>
                    <li>
                        <button className='button button_dark'>
                            <i className='icon icon_share'></i>
                        </button>
                    </li>
                    <li>
                        <button className='button button_dark'>
                            <i className='icon icon_cloud'></i>
                        </button>
                    </li>
                    <li>
                        <button className='button button_dark'>
                            <i className='icon icon_upload'></i>
                        </button>
                    </li>
                    <li>
                        <button className='button button_dark'>
                            <i className='icon icon_basket'></i>
                        </button>
                    </li>
                </ul>
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