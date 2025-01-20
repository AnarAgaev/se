import style from './Loader.module.sass'

const { loader, loader_visible, body, message, process, point } = style

const Loader = ({ text, styles}: {text?: string, styles?: React.CSSProperties}) => {
    return(
        <div className={`${loader} ${loader_visible}`} style={{...styles}}>
            <div className={body}>
                <span className={message}>
                    {text ? text : 'Загружаем'}
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