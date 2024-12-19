import { useId } from 'react'
import { TSetPluralFilter, TRemovePluralFilter, TCheckPluralFilter, TColorPalette, TColorsType } from '../../types'
import style from './ColorSelector.module.sass'

interface Props {
    caption: string
    colors: Array<string>
    setColorFn: TSetPluralFilter
    removeColorFn: TRemovePluralFilter
    checkColorFn: TCheckPluralFilter
    colorPalette: TColorPalette
    type: TColorsType
}

const { body, title, wrap, list, item, label, color, color_borders, color_devices, sign, text } = style

const getColorsList = (
    colors: Array<string>,
    setColorFn: TSetPluralFilter,
    removeColorFn: TRemovePluralFilter,
    checkColorFn: TCheckPluralFilter,
    id: string,
    colorPalette: TColorPalette,
    type: TColorsType
): JSX.Element[] => {

    const list: (JSX.Element)[] = []

    function handler(e: React.ChangeEvent<HTMLInputElement>, color: string) {
        if (e.target.checked) {
            setColorFn('colors', color)
            return
        }

        removeColorFn('colors', color)
    }

    colors.forEach(c => {
        if (!c) return

        const isChecked = checkColorFn('colors', c)
        const colorImage = colorPalette[c]
        const colorClazz = type === 'borders'
            ? `${color} ${color_borders}`
            : `${color} ${color_devices}`

        list.push(
            <li key={`${id}-${c}`} className={item} title={c}>
                <label className={label}>
                    <span className={colorClazz}style={{backgroundImage: `url("${colorImage}")`}}></span>
                    <p className={sign}>
                        <span className={text}>{c}</span>
                    </p>
                    <input
                        className="invisible"
                        type="checkbox"
                        checked={isChecked}
                        onChange={e => handler(e, c)}
                    />
                </label>
            </li>
        )
    })

    return list
}

const ColorSelector = ({caption, colors, setColorFn, removeColorFn, checkColorFn, colorPalette, type}: Props) => {
    const id = useId()

    const colorsList = getColorsList(colors, setColorFn, removeColorFn, checkColorFn, id, colorPalette, type)

    return (
        <div className={body}>
            <h3 className={title}>{caption}</h3>
            <div className={wrap}>
                <ul className={list}>
                    { colorsList }
                </ul>
            </div>
        </div>
    )
}

export default ColorSelector
