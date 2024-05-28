
import useStore from '../../Store'
import { ColorSelector, ItemsList } from '../../Components/'
import style from './BordersWorkspace.module.sass'

const { body, actions, list, title, selectors } = style

const BordersWorkspace = () => {
    const colorsList = useStore(state => state.getBordersColorsList())
    const bordersList = useStore(state => state.getBordersList())

    return (
        <div className={body}>
            <div className={actions}>
                <h2 className={title}>Выберите:</h2>
                <div className={selectors}>
                    <ColorSelector
                        caption="Цвет рамки"
                        colors={colorsList} />
                </div>
            </div>
            <div className={list}>
                <h2 className={title}>Варианты:</h2>
                <ItemsList itemList={bordersList} />
            </div>
        </div>
    )
}

export default BordersWorkspace