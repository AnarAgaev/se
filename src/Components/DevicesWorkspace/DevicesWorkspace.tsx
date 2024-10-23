import { useMemo, useId } from 'react'
import useStore from '../../Store'

import { TVendor,TGetBrandByCollection, TFunctionOptionList,
    TSetSingleFilter, TCheckSingleFilter, TRemoveSingleFilter,
    TSetPluralFilter, TRemovePluralFilter, TCheckPluralFilter } from '../../types'

import { FactoryWorkspace, ColorSelector, Select,
    OptionFunction, OptionBrand, OptionCollection,
    OptionMaterial, FunctionalitySelectsList } from '../../Components'

const getBrandOptionsList = (
    brandsList: string[],
    getVendorByName: (brandName: string) => TVendor | undefined,
    setSingleDevicesFilter: TSetSingleFilter,
    setSingleBordersFilter: TSetSingleFilter,
    checkSingleDevicesFilter: TCheckSingleFilter,
    removeSingleBordersFilter: TRemoveSingleFilter,
    removeSingleDevicesFilter: TRemoveSingleFilter,
    key: string
): JSX.Element[] => {

    const elementsList: JSX.Element[] = []

    brandsList.forEach(brandName => {
        const vendor = getVendorByName(brandName)

        if (!vendor) return

        const isChecked = checkSingleDevicesFilter('brand', vendor.name)

        const eventHandler = () => {

            if (isChecked) return

            setSingleDevicesFilter('brand', vendor.name)
            removeSingleDevicesFilter('collection')

            setSingleBordersFilter('brand', vendor.name)
            removeSingleBordersFilter('collection')
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
    setSingleDevicesFilter: TSetSingleFilter,
    setSingleBordersFilter: TSetSingleFilter,
    checkSingleDevicesFilter: TCheckSingleFilter,
    getBrandByCollection: TGetBrandByCollection,
    key: string
): JSX.Element[] => {

    const elementsList: JSX.Element[] = []

    collectionsList.forEach(collectionName => {

        const isChecked = checkSingleDevicesFilter('collection', collectionName)

        const eventHandler = () => {
            const brandName = getBrandByCollection(collectionName)

            setSingleDevicesFilter('collection', collectionName)
            setSingleDevicesFilter('brand', brandName)

            setSingleBordersFilter('collection', collectionName)
            setSingleBordersFilter('brand', brandName)
        }

        elementsList.push(
            <OptionCollection
                key={`${key}-${collectionName}`}
                isChecked={isChecked}
                value={collectionName}
                eventHandler={eventHandler}
            />
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

    const colorsList = useStore(state => state.colors?.devices)
    const brandsList = useStore(state => state.getDevicesBrandsList())
    const collectionsList = useStore(state => state.getDevicesCollectionsList())
    const materialList = useStore(state => state.getDevicesMaterialList())
    const functionsList = useStore(state => state.getFunctions())
    const getBrandByCollection = useStore(state => state.getBrandByCollection)

    const setSingleDevicesFilter = useStore(state => state.setSingleDevicesFilter)
    const setSingleBordersFilter = useStore(state => state.setSingleBordersFilter)
    const checkSingleDevicesFilter = useStore(state => state.checkSingleDevicesFilter)
    const removeSingleBordersFilter = useStore(state => state.removeSingleBordersFilter)
    const removeSingleDevicesFilter = useStore(state => state.removeSingleDevicesFilter)

    const setPluralDevicesFilter = useStore(state => state.setPluralDevicesFilter)
    const removePluralDevicesFilter = useStore(state => state.removePluralDevicesFilter)
    const checkPluralDevicesFilter = useStore(state => state.checkPluralDevicesFilter)

    const brandsOptions = useMemo(
        () => getBrandOptionsList(
            brandsList,
            getVendorByName,
            setSingleDevicesFilter,
            setSingleBordersFilter,
            checkSingleDevicesFilter,
            removeSingleBordersFilter,
            removeSingleDevicesFilter,
            key
        ),
        [
            brandsList,
            getVendorByName,
            setSingleDevicesFilter,
            setSingleBordersFilter,
            checkSingleDevicesFilter,
            removeSingleBordersFilter,
            removeSingleDevicesFilter,
            key
        ]
    )

    const collectionsOptions = useMemo(
        () => getCollectionsOptionsList(
            collectionsList,
            setSingleDevicesFilter,
            setSingleBordersFilter,
            checkSingleDevicesFilter,
            getBrandByCollection,
            key
        ),
        [
            collectionsList,
            setSingleDevicesFilter,
            setSingleBordersFilter,
            checkSingleDevicesFilter,
            getBrandByCollection,
            key
        ]
    )

    const materialsOptions = useMemo(
        () => getMaterialsOptionsList(
            materialList,
            setPluralDevicesFilter,
            removePluralDevicesFilter,
            checkPluralDevicesFilter,
            key
        ),
        [
            materialList,
            setPluralDevicesFilter,
            removePluralDevicesFilter,
            checkPluralDevicesFilter,
            key
        ]
    )

    const functionsOptions = useMemo(
        () => getFunctionsOptionsList(
            functionsList,
            key
        ),
        [
            functionsList,
            key
        ]
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
                    checkColorFn={checkPluralDevicesFilter}
                />
            }
        </FactoryWorkspace>
    )
}

export default DevicesWorkspace