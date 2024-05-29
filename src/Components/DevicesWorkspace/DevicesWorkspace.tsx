import useStore from '../../Store'
import { FactoryWorkspace, ColorSelector } from '../../Components'

const DevicesWorkspace = () => {
    const colorsList = useStore(state => state.getDevicesColorsList())

    return (
        <FactoryWorkspace>
            <ColorSelector caption="Цвет изделия" colors={colorsList} />
        </FactoryWorkspace>
    )
}

export default DevicesWorkspace