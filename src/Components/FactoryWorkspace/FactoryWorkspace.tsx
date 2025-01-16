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
        checkSelectedDeviceFilters,
        setModalResetSketch
    ] = useStore(state => [
        state.getFilteredItems(),
        state.activeCalcTab,
        state.checkSelectedBorderFilters,
        state.checkSelectedDeviceFilters,
        state.setModalResetSketch
    ])
    // #endregion

    const onResetAllFilters = () => {
        setModalResetSketch(
            true,
            'resetFilters',
            'Сброс всех фильтров приведет к удалению комплекта на холсте',
            'Сбросить все фильтры',
            'Оставить фильтры'
        )
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
                        onClick={onResetAllFilters}
                        className='button button_block button_lite'>
                        Сбросить все параметры
                    </button>
                )}

                { activeCalcTab === 'devices' && checkSelectedDeviceFilters() && (
                    <button
                        onClick={onResetAllFilters}
                        className='button button_block button_lite'>
                        Сбросить все параметры
                    </button>
                )}
            </div>
            <div className={list}>
                <h2 className={title}>Варианты:</h2>
                { filteredItems.length
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