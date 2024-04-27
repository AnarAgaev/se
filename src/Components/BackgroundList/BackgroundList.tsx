import style from './BackgroundList.module.sass'

const { backgroundList, caption, list, item } = style

const BackgroundList = () => {
    return (
        <div className={backgroundList}>
            <h2 className={caption}>Выберите фон:</h2>
            <ul className={list}>
                <li className={item}></li>
                <li className={item}></li>
                <li className={item}></li>
                <li className={item}></li>
                <li className={item}></li>
                <li className={item}></li>
                <li className={item}></li>
                <li className={item}></li>
                <li className={item}></li>
                <li className={item}></li>
                <li className={item}></li>
                <li className={item}></li>
                <li className={item}></li>
                <li className={item}></li>
                <li className={item}></li>
            </ul>
        </div>
    )
}

export default BackgroundList