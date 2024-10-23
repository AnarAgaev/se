import { useMemo, useId } from 'react'
import useStore from '../../Store'

import { TVendor, TFunctionOptionList,
    TSetFilter, TCheckFilter,
    TSetPluralFilter, TRemovePluralFilter,
    TCheckPluralFilter } from '../../types'

import { FactoryWorkspace, ColorSelector, Select,
    OptionFunction, OptionBrand, OptionCollection,
    OptionMaterial, FunctionalitySelectsList } from '../../Components'

const getBrandOptionsList = (
    brandsList: string[],
    getVendorByName: (brandName: string) => TVendor | undefined ,
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
            setDevicesFilter('brand', vendor.name)
            setBordersFilter('brand', vendor.name)
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
    setPluralDevicesFilter: TSetPluralFilter,
    removePluralDevicesFilter: TRemovePluralFilter,
    checkPluralDevicesFilter: TCheckPluralFilter,
    key: string
): JSX.Element[] => {

    const elementsList: JSX.Element[] = []

    materialList.forEach(material => {
        elementsList.push(
            <OptionMaterial
                key={`${key}-${material}`}
                material={material}
                setFilter={setPluralDevicesFilter}
                removeFilter={removePluralDevicesFilter}
                checkFilter={checkPluralDevicesFilter}
            />
        )
    })

    return elementsList
}

const getFunctionsOptionsList = (
    functionsList: TFunctionOptionList,
    key: string
): JSX.Element[] => {

    const elementsList: JSX.Element[] = []

    functionsList.forEach(f => {
        elementsList.push(
            <OptionFunction
                key={`${key}-${f.name}`}
                name={f.name}
                active={f.active} />
        )
    })

    return elementsList
}

const DevicesWorkspace = () => {
    const key = useId()
    const getVendorByName = useStore(state => state.getVendorByName)
    const setDevicesFilter = useStore(state => state.setDevicesFilter)
    // const removeDevicesFilter = useStore(state => state.removeDevicesFilter)
    const checkDevicesFilter = useStore(state => state.checkDevicesFilter)
    const setBordersFilter = useStore(state => state.setBordersFilter)
    const colorsList = useStore(state => state.colors?.devices)
    const brandsList = useStore(state => state.getDevicesBrandsList())
    const collectionsList = useStore(state => state.getDevicesCollectionsList())
    const materialList = useStore(state => state.getDevicesMaterialList())
    const functionsList = useStore(state => state.getFunctions())






    const setPluralDevicesFilter = useStore(state => state.setPluralDevicesFilter)
    const removePluralDevicesFilter = useStore(state => state.removePluralDevicesFilter)
    const checkPluralDevicesFilter = useStore(state => state.checkPluralDevicesFilter)

    const brandsOptions = useMemo(
        () => getBrandOptionsList(brandsList, getVendorByName, checkDevicesFilter, setDevicesFilter, setBordersFilter, key),
        [brandsList, getVendorByName, checkDevicesFilter, setDevicesFilter, setBordersFilter, key]
    )

    const collectionsOptions = useMemo(
        () => getCollectionsOptionsList(collectionsList, key),
        [collectionsList, key]
    )

    const materialsOptions = useMemo(
        () => getMaterialsOptionsList(materialList, setPluralDevicesFilter, removePluralDevicesFilter, checkPluralDevicesFilter, key),
        [materialList, setPluralDevicesFilter, removePluralDevicesFilter, checkPluralDevicesFilter, key]
    )

    const functionsOptions = useMemo(
        () => getFunctionsOptionsList(functionsList, key),
        [functionsList, key]
    )

    return (
        <FactoryWorkspace>
            <Select title="Бренд">{brandsOptions}</Select>
            <Select title="Коллекцию">{collectionsOptions}</Select>
            <Select title="Материал устройства">{materialsOptions}</Select>
            <Select title="Тип функции">{functionsOptions}</Select>
            <FunctionalitySelectsList />
            {
                colorsList && <ColorSelector
                    caption="Цвет устройства"
                    colors={colorsList}
                    setColorFn={setPluralDevicesFilter}
                    removeColorFn={removePluralDevicesFilter}
                    checkColorFn={checkPluralDevicesFilter} />
            }
        </FactoryWorkspace>
    )
}

export default DevicesWorkspace