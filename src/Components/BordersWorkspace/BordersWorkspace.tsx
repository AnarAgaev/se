
import useStore from '../../Store'
import { ColorSelector } from '../../Components/'
import style from './BordersWorkspace.module.sass'

const { body, title, selectors } = style

const BordersWorkspace = () => {
    const colorsList = useStore(state => state.getBordersColorsList())

    return (
        <div className={body}>
            <h2 className={title}>Выберите:</h2>
            <div className={selectors}>
                <ColorSelector caption="Цвет рамки" colors={colorsList} />
            </div>
        </div>
    )
}

export default BordersWorkspace