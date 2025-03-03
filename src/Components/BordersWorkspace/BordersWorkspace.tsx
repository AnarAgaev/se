import { useMemo, useId } from 'react'
import useStore from '../../Store'

import {
    TBordersFilters, TCheckSingleFilter, TVendor, TGetBrandByCollection,
    TSetSingleFilter, TSetPluralFilter, TRemovePluralFilter,
    TCheckPluralFilter, TSetModalSelect, TResetSketch } from '../../types'

import { FactoryWorkspace, ColorSelector, Select,
    OptionBrand, OptionCollection, OptionMaterial } from '../../Components'

const getBrandsOptionsList = (
    brandsList: string[],
    getVendorByName: (brandName: string) => TVendor | undefined,
    setSingleBordersFilter: TSetSingleFilter,
    setSingleDevicesFilter: TSetSingleFilter,
    checkSingleBordersFilter: TCheckSingleFilter<keyof TBordersFilters>,
    selectedCollection: TBordersFilters['collection'],
    setModalSelect: TSetModalSelect,
    key: string,
): JSX.Element[] => {

    const elementsList: JSX.Element[] = []

    brandsList.forEach(brandName => {

        const vendor = getVendorByName(brandName)

        if (!vendor) return

        const isChecked = checkSingleBordersFilter('brand', vendor.name)

        const eventHandler = () => {

            // Если это текущий выбранный бренд, выходим
            if (isChecked) return

            // Если коллекция не выбрана, просто меняем Бренд
            if (!selectedCollection) {
                setSingleBordersFilter('brand', vendor.name)
                setSingleDevicesFilter('brand', vendor.name)
                return
            }

            // Если пытаемся изменить бренд, но при этом ранее
            // выбрали коллекцию, предупреждаем пользователя
            setModalSelect(
                'При выборе бренда, будет сброшена выбранная ранее коллекция',
                'Оставить бренд',
                'Изменить бренд',
                {
                    from: 'brand',
                    brandName: vendor.name,
                    collectionName: selectedCollection
                }
            )
        }

        elementsList.push(
            <OptionBrand
                key={`${key}-${vendor.id}`}
                img={vendor.image}
                value={vendor.name}
                isChecked={isChecked}
                eventHandler={eventHandler}
            />
        )
    })

    return elementsList
}

const getCollectionsOptionsList = (
    collectionsList: string[],
    setSingleBordersFilter: TSetSingleFilter,
    setSingleDevicesFilter: TSetSingleFilter,
    checkSingleBordersFilter: TCheckSingleFilter<keyof TBordersFilters>,
    getBrandByCollection: TGetBrandByCollection,
    selectedBrand: TBordersFilters['brand'],
    setModalSelect: TSetModalSelect,
    resetSketch: TResetSketch,
    key: string,
): JSX.Element[] => {

    const elementsList: JSX.Element[] = []

    collectionsList.forEach(collectionName => {

        const isChecked = checkSingleBordersFilter('collection', collectionName)
        const brandName = getBrandByCollection(collectionName)

        const selectable = !selectedBrand
            ? true
            : brandName === selectedBrand

        const eventHandler = () => {

            const approveAction = () => {
                setSingleBordersFilter('collection', collectionName)
                setSingleBordersFilter('brand', brandName)

                setSingleDevicesFilter('collection', collectionName)
                setSingleDevicesFilter('brand', brandName)
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
                selectable={selectable}
                eventHandler={eventHandler}
                selectedBrand={!!selectedBrand}
            />
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

const BordersWorkspace = () => {

    // #region Variables
    const key = useId()
    const getVendorByName = useStore(state => state.getVendorByName)

    const colorsList = useStore(state => state.colors?.borders)
    const brandsList = useStore(state => state.getBordersBrandsList())
    const collectionsList = useStore(state => state.getBordersCollectionsList())
    const materialList = useStore(state => state.getBordersMaterialList())
    const getBrandByCollection = useStore(state => state.getBrandByCollection)

    const setSingleBordersFilter = useStore(state => state.setSingleBordersFilter)
    const setSingleDevicesFilter = useStore(state => state.setSingleDevicesFilter)
    const checkSingleBordersFilter = useStore(state => state.checkSingleBordersFilter)

    const setPluralBordersFilter = useStore(state => state.setPluralBordersFilter)
    const removePluralBordersFilter = useStore(state => state.removePluralBordersFilter)
    const checkPluralBordersFilter = useStore(state => state.checkPluralBordersFilter)

    const selectedColors = useStore(state => state.filtersBorders.colors)
    const selectedBrand = useStore(state => state.filtersBorders.brand)
    const selectedCollection = useStore(state => state.filtersBorders.collection)
    const selectedMaterials = useStore(state => state.filtersBorders.materials).sort().join(', ')

    const setModalSelect = useStore(state => state.setModalSelect)

    const resetSketch = useStore(state => state.resetSketch)

    const colorPalette = useStore(state => state.getColorPallette('borders'))
    // #endregion

    const brandsOptions = useMemo(
        () => getBrandsOptionsList(
            brandsList,
            getVendorByName,
            setSingleBordersFilter,
            setSingleDevicesFilter,
            checkSingleBordersFilter,
            selectedCollection,
            setModalSelect,
            key
        ),
        [
            brandsList,
            getVendorByName,
            setSingleBordersFilter,
            setSingleDevicesFilter,
            checkSingleBordersFilter,
            selectedCollection,
            setModalSelect,
            key
        ]
    )

    const collectionsOptions = useMemo(
        () => getCollectionsOptionsList(
            collectionsList,
            setSingleBordersFilter,
            setSingleDevicesFilter,
            checkSingleBordersFilter,
            getBrandByCollection,
            selectedBrand,
            setModalSelect,
            resetSketch,
            key
        ),
        [
            collectionsList,
            setSingleBordersFilter,
            setSingleDevicesFilter,
            checkSingleBordersFilter,
            getBrandByCollection,
            selectedBrand,
            setModalSelect,
            resetSketch,
            key
        ]
    )

    const materialsOptions = useMemo(
        () => getMaterialsOptionsList(
            materialList,
            setPluralBordersFilter,
            removePluralBordersFilter,
            checkPluralBordersFilter,
            key
        ),
        [
            materialList,
            setPluralBordersFilter,
            removePluralBordersFilter,
            checkPluralBordersFilter,
            key
        ]
    )

    return (
        <FactoryWorkspace type="borders">
            <Select title="Бренд" critical selectedValue={selectedBrand}>
                {brandsOptions}
            </Select>
            <Select title="Коллекция" critical selectedValue={selectedCollection}>
                {collectionsOptions}
            </Select>
            <Select title="Материал рамки" selectedValue={selectedMaterials}>
                {materialsOptions}
            </Select>
            {
                colorsList && <ColorSelector
                    caption="Цвет рамки"
                    colors={colorsList}
                    setColorFn={setPluralBordersFilter}
                    removeColorFn={removePluralBordersFilter}
                    checkColorFn={checkPluralBordersFilter}
                    colorPalette={colorPalette}
                    selectedColors={selectedColors}
                    type={'borders'}
                />
            }
        </FactoryWorkspace>
    )
}

export default BordersWorkspace