import useStore from '../../Store'
import style from './Warning.module.sass'

const { visible, warning, message, buttons } = style

const Warning = () => {
    const userToken = window.userToken
    const wasShown = useStore(state => state.logWarningShown)
    const onClose = useStore(state => state.setLogWarningShown)

    const showClassName = !userToken && !wasShown
        ? `${warning} ${visible}`
        : warning

    return (
        <div className={showClassName}>
            <p className={message}>
                <span>Конфигурации сохраняются в вашем браузере.</span>
                <span>При очистке кэша браузера все данные конфигуратора будут потеряны.</span>
                <span>Чтобы сохранить конфигурации в вашем аккаунте, выполните вход.</span>
            </p>
            <div className={buttons}>
                <a title="Войти на сайт"
                    href="/account/lk/"
                    rel="noopener noreferrer nofollow"
                    className="button button_dark auth_model-btn elem elem_enter">
                    Войти
                </a>
                <button className='button button_lite' onClick={onClose}>Закрыть</button>
            </div>
        </div>
    )
}

export default Warning