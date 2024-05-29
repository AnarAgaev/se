import useStore from '../../Store'
import { FactoryWorkspace, ColorSelector, Select } from '../../Components'

const BordersWorkspace = () => {
    const colorsList = useStore(state => state.getBordersColorsList())

    return (
        <FactoryWorkspace>
            <Select title="Бренд" />
            <Select title="Коллекцию" />
            <Select title="Материал рамки" />
            <ColorSelector caption="Цвет рамки" colors={colorsList} />
        </FactoryWorkspace>
    )
}

export default BordersWorkspace