import useStore from '../../Store'
import { ItemsList  } from '../../Components/'
import style from './FactoryWorkspace.module.sass'

const { body, actions, list, title, selectors, empty } = style

const FactoryWorkspace = (props: { children: React.ReactNode }) => {
    const filteredItems = useStore(state => state.getFilteredItems())

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
                {
                    filteredItems.length
                        ? <ItemsList itemList={filteredItems} />
                        : <span className={empty}>
                            К сожалению, нет элементов согласно выбранным параметрам!
                        </span>
                }
            </div>
        </div>
    )
}

export default FactoryWorkspace