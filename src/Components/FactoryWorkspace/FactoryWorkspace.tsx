import useStore from '../../Store'
import { ItemsList  } from '../../Components/'
import { TItemsType } from '../../types'
import style from './FactoryWorkspace.module.sass'

const { body, actions, list, title, selectors, empty } = style

type TProps = {
    type: TItemsType
    children: React.ReactNode
}

const FactoryWorkspace = ({ type, children }: TProps) => {

    // #region Variables
    const [
        filteredItems,
        activeCalcTab,
        checkSelectedBorderFilters,
        resetAllBorderFilters,
        checkSelectedDeviceFilters,
        resetAllDeviceFilters,
    ] = useStore(state => [
        state.getFilteredItems(),
        state.activeCalcTab,
        state.checkSelectedBorderFilters,
        state.resetAllBorderFilters,
        state.checkSelectedDeviceFilters,
        state.resetAllDeviceFilters,
    ])
    // #endregion

    const onReset = () => {
        resetAllBorderFilters()
        resetAllDeviceFilters()
    }

    return (
        <div className={body}>
            <div className={actions}>
                <h2 className={title}>Выберите:</h2>
                <div className={selectors}>
                    { children }
                </div>

                { activeCalcTab === 'borders' && checkSelectedBorderFilters() && (
                    <button
                        onClick={onReset}
                        className='button button_block button_lite'>
                        Сбросить все параметры
                    </button>
                )}

                { activeCalcTab === 'devices' && checkSelectedDeviceFilters() && (
                    <button
                        onClick={onReset}
                        className='button button_block button_lite'>
                        Сбросить все параметры
                    </button>
                )}
            </div>
            <div className={list}>
                <h2 className={title}>Варианты:</h2>
                {
                    filteredItems.length
                        ? <ItemsList itemList={filteredItems} type={type} />
                        : <span className={empty}>
                            К сожалению, нет элементов согласно выбранным параметрам!
                        </span>
                }
            </div>
        </div>
    )
}

export default FactoryWorkspace