import style from './ProjectWorkspace.module.sass'

const { wrap, caption, body, project, footer, actions,total } = style

const ProjectWorkspace = () => {
    return (
        <div className={wrap}>
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