import { useMemo, useId } from 'react'
import useStore from '../../Store'

import { TDevicesFilters, TBordersFilters, TVendor, TGetBrandByCollection,
    TFunctionOptionList, TSetSingleFilter, TCheckSingleFilter, TRemoveSingleFilter,
    TSetPluralFilter, TRemovePluralFilter, TCheckPluralFilter, TSetModalSelect,
    TResetSketch } from '../../types'

import { FactoryWorkspace, ColorSelector, Select,
    OptionFunction, OptionBrand, OptionCollection,
    OptionMaterial, FunctionalitySelectsList } from '../../Components'

const getBrandOptionsList = (
    brandsList: string[],
    getVendorByName: (brandName: string) => TVendor | undefined,
    setSingleDevicesFilter: TSetSingleFilter,
    setSingleBordersFilter: TSetSingleFilter,
    checkSingleDevicesFilter: TCheckSingleFilter<keyof TDevicesFilters>,
    removeSingleBordersFilter: TRemoveSingleFilter<keyof TBordersFilters>,
    removeSingleDevicesFilter: TRemoveSingleFilter<keyof TDevicesFilters>,
    selectedCollection: TBordersFilters['collection'],
    setModalSelect: TSetModalSelect,
    key: string
): JSX.Element[] => {

    const elementsList: JSX.Element[] = []

    brandsList.forEach(brandName => {
        const vendor = getVendorByName(brandName)

        if (!vendor) return

        const isChecked = checkSingleDevicesFilter('brand', vendor.name)

        const eventHandler = () => {

            const approveAction = () => {
                setSingleDevicesFilter('brand', vendor.name)
                removeSingleDevicesFilter('collection')

                setSingleBordersFilter('brand', vendor.name)
                removeSingleBordersFilter('collection')
            }

            if (isChecked) return

            if (!selectedCollection) {
                approveAction()
                return
            }

            setModalSelect(
                'При выборе бренда, будет сброшена выбранная ранее коллекция',
                'Оставить бренд',
                'Изменить бренд',
                {
                    from: 'brand',
                    brandName: vendor.name,
                    collectionName: null
                }
            )
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
    checkSingleDevicesFilter: TCheckSingleFilter<keyof TDevicesFilters>,
    getBrandByCollection: TGetBrandByCollection,
    selectedBrand: TBordersFilters['brand'],
    setModalSelect: TSetModalSelect,
    key: string,
    resetSketch: TResetSketch
): JSX.Element[] => {

    const elementsList: JSX.Element[] = []

    collectionsList.forEach(collectionName => {

        const isChecked = checkSingleDevicesFilter('collection', collectionName)
        const brandName = getBrandByCollection(collectionName)

        const selectable = !selectedBrand
            ? true
            : brandName === selectedBrand

        const eventHandler = () => {

            const approveAction = () => {
                setSingleDevicesFilter('collection', collectionName)
                setSingleDevicesFilter('brand', brandName)

                setSingleBordersFilter('collection', collectionName)
                setSingleBordersFilter('brand', brandName)
            }

            if (isChecked) return

            // Если не выбран бренд или Выбран бренд, но меням коллекцию в рамках одного бренда
            if (!selectedBrand || (selectedBrand && selectable)) {
                approveAction()

                // Всегда, при изменении Коллекции, сбрасываем скетч
                resetSketch()
                return
            }

            // Если пытаемся изменить коллекцию, но ранее уже выбирали коллекцию из другого бренда
            setModalSelect(
                'При выборе коллекции, будет сброшен выбранный ранее бренд',
                'Оставить коллекцию',
                'Изменить коллекцию',
                {
                    from: 'collection',
                    brandName: brandName,
                    collectionName: collectionName
                }
            )
        }

        elementsList.push(
            <OptionCollection
                key={`${key}-${collectionName}`}
                isChecked={isChecked}
                value={collectionName}
                brand={brandName}
                selectedBrand={!!selectedBrand}
                selectable={selectable}
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

    // #region Variables
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

    const selectedBrand = useStore(state => state.filtersDevices.brand)
    const selectedCollection = useStore(state => state.filtersDevices.collection)
    const selectedMaterials = useStore(state => state.filtersDevices.materials).sort().join(', ')

    const filterFunctions = useStore(state => state.filtersDevices.functions)
    const selectedFunction = filterFunctions.find(fn => fn.active)?.name

    const setModalSelect = useStore(state => state.setModalSelect)

    const resetSketch = useStore(state => state.resetSketch)
    // #endregion

    const brandsOptions = useMemo(
        () => getBrandOptionsList(
            brandsList,
            getVendorByName,
            setSingleDevicesFilter,
            setSingleBordersFilter,
            checkSingleDevicesFilter,
            removeSingleBordersFilter,
            removeSingleDevicesFilter,
            selectedCollection,
            setModalSelect,
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
            selectedCollection,
            setModalSelect,
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
            selectedBrand,
            setModalSelect,
            key,
            resetSketch
        ),
        [
            collectionsList,
            setSingleDevicesFilter,
            setSingleBordersFilter,
            checkSingleDevicesFilter,
            getBrandByCollection,
            selectedBrand,
            setModalSelect,
            key,
            resetSketch
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
        <FactoryWorkspace type='devices'>
            <Select title="Бренд" selectedValue={selectedBrand}>
                {brandsOptions}
            </Select>
            <Select title="Коллекция" selectedValue={selectedCollection}>
                {collectionsOptions}
            </Select>
            <Select title="Материал устройства" selectedValue={selectedMaterials}>
                {materialsOptions}
            </Select>
            <Select title="Тип функции" selectedValue={selectedFunction !== 'Все функции' ? selectedFunction : undefined}>
                {functionsOptions}
            </Select>
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