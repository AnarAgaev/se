import style from './Loader.module.sass'

const { loader, loader_visible, body, message, process, point } = style

const Loader = () => {
    return(
        <div className={`${loader} ${loader_visible}`}>
            <div className={body}>
                <span className={message}>
                    Загружаем
                    <mark className={process}>
                        <i className={point}></i>
                        <i className={point}></i>
                        <i className={point}></i>
                    </mark>
                </span>
            </div>
        </div>
    )
}

export default Loader