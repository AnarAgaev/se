import { useMemo, useId, FC } from 'react'
import useStore from '../../Store'

import { TVendor, TGetBrandByCollection,
    TSetSingleFilter, TCheckSingleFilter, TRemoveSingleFilter,
    TSetPluralFilter, TRemovePluralFilter, TCheckPluralFilter } from '../../types'

import { FactoryWorkspace, ColorSelector, Select,
    OptionBrand, OptionCollection, OptionMaterial } from '../../Components'

const getBrandsOptionsList = (
    brandsList: string[],
    getVendorByName: (brandName: string) => TVendor | undefined,
    setSingleBordersFilter: TSetSingleFilter,
    setSingleDevicesFilter: TSetSingleFilter,
    checkSingleBordersFilter: TCheckSingleFilter,
    removeSingleBordersFilter: TRemoveSingleFilter,
    removeSingleDevicesFilter: TRemoveSingleFilter,
    key: string
): JSX.Element[] => {

    const elementsList: JSX.Element[] = []

    brandsList.forEach(brandName => {
        const vendor = getVendorByName(brandName)

        if (!vendor) return

        const isChecked = checkSingleBordersFilter('brand', vendor.name)

        const eventHandler = () => {

            if (isChecked) return

            setSingleBordersFilter('brand', vendor.name)
            removeSingleBordersFilter('collection')

            setSingleDevicesFilter('brand', vendor.name)
            removeSingleDevicesFilter('collection')
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
    checkSingleBordersFilter: TCheckSingleFilter,
    getBrandByCollection: TGetBrandByCollection,
    selectedBrand: string | undefined,
    key: string
): JSX.Element[] => {

    const elementsList: JSX.Element[] = []

    collectionsList.forEach(collectionName => {

        const isChecked = checkSingleBordersFilter('collection', collectionName)
        const brandName = getBrandByCollection(collectionName)

        const selectable = !selectedBrand
            ? true
            : brandName === selectedBrand

        const eventHandler = () => {

            setSingleBordersFilter('collection', collectionName)
            setSingleBordersFilter('brand', brandName)

            setSingleDevicesFilter('collection', collectionName)
            setSingleDevicesFilter('brand', brandName)
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

const BordersWorkspace: FC = () => {
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
    const removeSingleBordersFilter = useStore(state => state.removeSingleBordersFilter)
    const removeSingleDevicesFilter = useStore(state => state.removeSingleDevicesFilter)

    const setPluralBordersFilter = useStore(state => state.setPluralBordersFilter)
    const removePluralBordersFilter = useStore(state => state.removePluralBordersFilter)
    const checkPluralBordersFilter = useStore(state => state.checkPluralBordersFilter)

    const selectedBrand = useStore(state => state.filtersBorders.brand)
    const selectedCollection = useStore(state => state.filtersBorders.collection)
    const selectedMaterials = useStore(state => state.filtersBorders.materials).sort().join(', ')
    // #endregion

    const brandsOptions = useMemo(
        () => getBrandsOptionsList(
            brandsList,
            getVendorByName,
            setSingleBordersFilter,
            setSingleDevicesFilter,
            checkSingleBordersFilter,
            removeSingleBordersFilter,
            removeSingleDevicesFilter,
            key
        ),
        [
            brandsList,
            getVendorByName,
            setSingleBordersFilter,
            setSingleDevicesFilter,
            checkSingleBordersFilter,
            removeSingleBordersFilter,
            removeSingleDevicesFilter,
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
            key
        ),
        [
            collectionsList,
            setSingleBordersFilter,
            setSingleDevicesFilter,
            checkSingleBordersFilter,
            getBrandByCollection,
            selectedBrand,
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
        <FactoryWorkspace>
            <Select title="Бренд" selectedValue={selectedBrand}>
                {brandsOptions}
            </Select>
            <Select title="Коллекция" selectedValue={selectedCollection}>
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
                />
            }
        </FactoryWorkspace>
    )
}

export default BordersWorkspace