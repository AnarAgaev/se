import { useId, useMemo } from 'react'
import useStore from '../../Store'
import style from './ColorSelector.module.sass'

interface Props {
    caption: string
    colors: Array<string>
}

const { body, title, list, item, color,
    color_gold, color_gray, color_white,
    color_copper, color_black, color_silver
} = style

const colorStyleModifiers: Record<string, string> = {
    gold: color_gold,
    gray: color_gray,
    white: color_white,
    copper: color_copper,
    black: color_black,
    silver: color_silver
}

const getColorsList = (
    colors: Array<string>,
    colorsDic: Record<string, string>,
    id: string
): JSX.Element[] => {

    const list: (JSX.Element)[] = []

    colors.forEach(clr => {
        const clazz = `${color} ${colorStyleModifiers[clr]}`
        list.push(
            <li key={`${id}-${clr}`} className={item}>
                <label className={clazz} title={colorsDic[clr]}>
                    <input className="invisible" type="radio" name={`color-${id}`} />
                </label>
            </li>
        )
    })

    return list
}

const ColorSelector: React.FC<Props> = ({caption, colors}) => {
    const colorsDic = useStore(state => state.colors)
    const id = useId()

    const colorsList = useMemo(
        () => getColorsList(colors, colorsDic, id),
        [colors, colorsDic, id]
    )

    return (
        <div className={body}>
            <h3 className={title}>{caption}</h3>
            <ul className={list}>
                {colorsList}
            </ul>
        </div>
    )
}

export default ColorSelector
