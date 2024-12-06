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
    const filteredItems = useStore(state => state.getFilteredItems())

    return (
        <div className={body}>
            <div className={actions}>
                <h2 className={title}>Выберите:</h2>
                <div className={selectors}>
                    { children }
                </div>
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