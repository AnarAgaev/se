import { useId, useMemo } from 'react'
import useStore from '../../Store'
import style from './ColorSelector.module.sass'

const { body, caption, list, item, item_active,
    color, color_gold, color_gray, color_white,
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

const ColorSelector = (props: {caption: string, colors: Array<string>}) => {
    const colorsDic = useStore(state => state.colors)
    const id = useId()

    const colorsList = useMemo((): JSX.Element[] => {
        const list: (JSX.Element)[] = []

        props.colors.forEach(clr => {
            list.push(
                <li key={`${id}-${clr}`} className={item}>
                    <span className={`${color} ${colorStyleModifiers[clr]}`}
                        title={colorsDic[clr]}></span>
                </li>
            )
        })

        return list
    }, [props.colors, colorsDic, colorStyleModifiers, color])

    return (
        <div className={body}>
            <h3 className={caption}>{props.caption}</h3>
            <ul className={list}>
                {colorsList}
                {/* <li className={`${item} ${item_active}`}>
                    <span className={`${color} ${color_gold}`} title="Золотой"></span>
                </li>
                <li className={item}>
                    <span className={`${color} ${color_gray}`} title="Серый"></span>
                </li>
                <li className={item}>
                    <span className={`${color} ${color_white}`} title="Белый"></span>
                </li>
                <li className={item}>
                    <span className={`${color} ${color_copper}`} title="Медный"></span>
                </li>
                <li className={item}>
                    <span className={`${color} ${color_black}`} title="Черный"></span>
                </li>
                <li className={item}>
                    <span className={`${color} ${color_silver}`} title="Серебряный"></span>
                </li> */}
            </ul>
        </div>
    )
}

export default ColorSelector
