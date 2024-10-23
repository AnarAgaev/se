import { useMemo, useId, FC } from 'react'
import useStore from '../../Store'

import { TVendor, TSetFilter, TCheckFilter,
    TSetPluralFilter, TRemovePluralFilter,
    TCheckPluralFilter } from '../../types'

import { FactoryWorkspace, ColorSelector, Select,
    OptionBrand, OptionCollection, OptionMaterial } from '../../Components'

const getBrandsOptionsList = (
    brandsList: string[],
    getVendorByName: (brandName: string) => TVendor | undefined,
    checkBordersFilter: TCheckFilter,
    setBordersFilter: TSetFilter,
    setDevicesFilter: TSetFilter,
    key: string
): JSX.Element[] => {

    const elementsList: JSX.Element[] = []

    brandsList.forEach(brandName => {
        const vendor = getVendorByName(brandName)

        if (!vendor) return

        const isChecked = checkBordersFilter('brand', vendor.name)

        const eventHandler = () => {
            setBordersFilter('brand', vendor.name)
            setDevicesFilter('brand', vendor.name)
        }

        elementsList.push(
            <OptionBrand
                key={`${key}-${vendor.id}`}
                img={vendor.image}
                value={vendor.name}
                isChecked={isChecked}
                eventHandler={eventHandler} />
        )
    })

    return elementsList
}

const getCollectionsOptionsList = (
    collectionsList: string[],
    key: string
): JSX.Element[] => {

    const elementsList: JSX.Element[] = []

    collectionsList.forEach(collectionName => {
        elementsList.push(
            <OptionCollection
                key={`${key}-${collectionName}`}
                name={`collection-${key}`}
                caption={collectionName} />
        )
    })

    return elementsList
}

const getMaterialsOptionsList = (
    materialList: string[],
    setPluralBordersFilter: TSetPluralFilter,
    removePluralBordersFilter: TRemovePluralFilter,
    checkPluralBordersFilter: TCheckPluralFilter,
    key: string
): JSX.Element[] => {

    const elementsList: JSX.Element[] = []

    materialList.forEach(material => {
        elementsList.push(
            <OptionMaterial
                key={`${key}-${material}`}
                material={material}
                setFilter={setPluralBordersFilter}
                removeFilter={removePluralBordersFilter}
                checkFilter={checkPluralBordersFilter}
            />
        )
    })

    return elementsList
}

const BordersWorkspace: FC = () => {
    const key = useId()
    const getVendorByName = useStore(state => state.getVendorByName)


    const setBordersFilter = useStore(state => state.setBordersFilter)
    // const removeBordersFilter = useStore(state => state.removeBordersFilter)
    const checkBordersFilter = useStore(state => state.checkBordersFilter)
    const setDevicesFilter = useStore(state => state.setDevicesFilter)


    const colorsList = useStore(state => state.colors?.borders)
    const brandsList = useStore(state => state.getBordersBrandsList())
    const collectionsList = useStore(state => state.getBordersCollectionsList())
    const materialList = useStore(state => state.getBordersMaterialList())




    const setPluralBordersFilter = useStore(state => state.setPluralBordersFilter)
    const removePluralBordersFilter = useStore(state => state.removePluralBordersFilter)
    const checkPluralBordersFilter = useStore(state => state.checkPluralBordersFilter)

    const brandsOptions = useMemo(
        () => getBrandsOptionsList(brandsList, getVendorByName, checkBordersFilter, setBordersFilter, setDevicesFilter, key),
        [brandsList, getVendorByName, checkBordersFilter, setBordersFilter, setDevicesFilter, key]
    )

    const collectionsOptions = useMemo(
        () => getCollectionsOptionsList(collectionsList, key),
        [collectionsList, key]
    )

    const materialsOptions = useMemo(
        () => getMaterialsOptionsList(materialList, setPluralBordersFilter, removePluralBordersFilter, checkPluralBordersFilter, key),
        [materialList, setPluralBordersFilter, removePluralBordersFilter, checkPluralBordersFilter, key]
    )

    return (
        <FactoryWorkspace>
            <Select title="Бренд">{brandsOptions}</Select>
            <Select title="Коллекцию">{collectionsOptions}</Select>
            <Select title="Материал рамки">{materialsOptions}</Select>
            {
                colorsList && <ColorSelector
                    caption="Цвет рамки"
                    colors={colorsList}
                    setColorFn={setPluralBordersFilter}
                    removeColorFn={removePluralBordersFilter}
                    checkColorFn={checkPluralBordersFilter} />
            }
        </FactoryWorkspace>
    )
}

export default BordersWorkspace