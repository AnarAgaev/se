import { useId } from 'react'
import { TSetPluralFilter, TRemovePluralFilter, TCheckPluralFilter } from '../../types'
import style from './ColorSelector.module.sass'

interface Props {
    caption: string
    colors: Array<string>
    setColorFn: TSetPluralFilter
    removeColorFn: TRemovePluralFilter
    checkColorFn: TCheckPluralFilter
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
    setColorFn: TSetPluralFilter,
    removeColorFn: TRemovePluralFilter,
    checkColorFn: TCheckPluralFilter,
    id: string
): JSX.Element[] => {

    const list: (JSX.Element)[] = []

    function handler(e: React.ChangeEvent<HTMLInputElement>, color: string) {
        if (e.target.checked) {
            setColorFn('colors', color)
            return
        }

        removeColorFn('colors', color)
    }

    colors.forEach(clr => {
        const clazz = `${color} ${colorClassDictionary[clr]}`
        const isChecked = checkColorFn('colors', clr)

        list.push(
            <li key={`${id}-${clr}`} className={item}>
                <label className={clazz} title={clr}>
                    <input
                        className="invisible"
                        type="checkbox"
                        checked={isChecked}
                        onChange={e => handler(e, clr)}
                    />
                </label>
            </li>
        )
    })

    return list
}

const ColorSelector: React.FC<Props> = ({caption, colors, setColorFn, removeColorFn, checkColorFn}) => {
    const id = useId()

    const colorsList = getColorsList(colors, setColorFn, removeColorFn, checkColorFn, id)

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
