import { useMemo, useId, FC } from 'react'
import useStore from '../../Store'
import { TVendor } from '../../types'

import { FactoryWorkspace, ColorSelector, Select,
    OptionBrand, OptionCollection, OptionMaterial } from '../../Components'

const getBrandsOptionsList = (
    brandsList: string[],
    getVendorByName: (brandName: string) => TVendor | undefined,
    checkBordersBrandSelected: (brandName: string) => boolean,
    setBordersFilterBrand: (brandName: string) => void,
    setDevicesFilterBrand: (brandName: string) => void,
    key: string
): JSX.Element[] => {

    const elementsList: JSX.Element[] = []

    if (getVendorByName) {
        brandsList.forEach(brandName => {
            const vendor = getVendorByName(brandName)

            if (!vendor) return

            const isChecked = checkBordersBrandSelected(vendor.name)

            const eventHandler = () => {
                setBordersFilterBrand(vendor.name)
                setDevicesFilterBrand(vendor.name)
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
    }

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
    materialsList: string[],
    key: string
): JSX.Element[] => {

    const elementsList: JSX.Element[] = []

    materialsList.forEach(materialName => {
        elementsList.push(
            <OptionMaterial
                key={`${key}-${materialName}`}
                caption={materialName} />
        )
    })

    return elementsList
}

const BordersWorkspace: FC = () => {
    const key = useId()
    const getVendorByName = useStore(state => state.getVendorByName)
    const checkBordersBrandSelected = useStore(state => state.checkBordersBrandSelected)
    const setBordersFilterBrand = useStore(state => state.setBordersFilterBrand)
    const setDevicesFilterBrand = useStore(state => state.setDevicesFilterBrand)
    const colorsList = useStore(state => state.colors?.borders)
    const brandsList = useStore(state => state.getBordersBrandsList())
    const collectionsList = useStore(state => state.getBordersCollectionsList())
    const materialsList = useStore(state => state.getBordersMaterialsList())

    const brandsOptions = useMemo(
        () => getBrandsOptionsList(brandsList, getVendorByName, checkBordersBrandSelected, setBordersFilterBrand, setDevicesFilterBrand, key),
        [brandsList, getVendorByName, checkBordersBrandSelected, setBordersFilterBrand, setDevicesFilterBrand, key]
    )

    const collectionsOptions = useMemo(
        () => getCollectionsOptionsList(collectionsList, key),
        [collectionsList, key]
    )

    const materialsOptions = useMemo(
        () => getMaterialsOptionsList(materialsList, key),
        [materialsList, key]
    )

    return (
        <FactoryWorkspace>
            <Select title="Бренд">{brandsOptions}</Select>
            <Select title="Коллекцию">{collectionsOptions}</Select>
            <Select title="Материал рамки">{materialsOptions}</Select>
            {colorsList && <ColorSelector caption="Цвет рамки" colors={colorsList} />}
        </FactoryWorkspace>
    )
}

export default BordersWorkspace