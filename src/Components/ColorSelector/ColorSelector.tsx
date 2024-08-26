import { useId, useMemo } from 'react'
import style from './ColorSelector.module.sass'

interface Props {
    caption: string
    colors: Array<string>
}

const { body, title, list, item, color,
    color_gold, color_gray, color_white,
    color_copper, color_black, color_silver,
    color_brown, color_green, color_blue,
    color_beige
} = style

const colorClassDictionary: Record<string, string> = {
    "Белый": color_white,
    "Бежевый": color_beige,
    "Серый": color_gray,
    "Коричневый": color_brown,
    "Зелёный": color_green,
    "Чёрный": color_black,
    "Синий": color_blue,
    "Серебристый": color_silver,
    "Золотистый": color_gold,
    "Медный": color_copper,
}

const getColorsList = (
    colors: Array<string>,
    id: string
): JSX.Element[] => {

    const list: (JSX.Element)[] = []

    colors.forEach(clr => {
        const clazz = `${color} ${colorClassDictionary[clr]}`
        list.push(
            <li key={`${id}-${clr}`} className={item}>
                <label className={clazz} title={clr}>
                    <input className="invisible" type="radio" name={`color-${id}`} />
                </label>
            </li>
        )
    })

    return list
}

const ColorSelector: React.FC<Props> = ({caption, colors}) => {
    const id = useId()

    const colorsList = useMemo(
        () => getColorsList(colors, id),
        [colors, id]
    )

    return (
        <div className={body}>
            <h3 className={title}>{caption}</h3>
            <ul className={list}>
                { colorsList }
            </ul>
        </div>
    )
}

export default ColorSelector
