import useStore from '../../Store'
import { ItemsList  } from '../../Components/'
import style from './FactoryWorkspace.module.sass'

const { body, actions, list, title, selectors } = style

const FactoryWorkspace = (props: { children: React.ReactNode }) => {
    const activeCalcTab = useStore(state => state.activeCalcTab)
    const bordersList = useStore(state => state.getBordersList())
    const devicesList = useStore(state => state.getDevicesList())

    return (
        <div className={body}>
            <div className={actions}>
                <h2 className={title}>Выберите:</h2>
                <div className={selectors}>
                    { props.children }
                </div>
            </div>
            <div className={list}>
                <h2 className={title}>Варианты:</h2>
                { activeCalcTab === 'borders' &&
                    <ItemsList itemList={bordersList} /> }
                { activeCalcTab === 'devices' &&
                    <ItemsList itemList={devicesList} /> }
            </div>
        </div>
    )
}

export default FactoryWorkspace