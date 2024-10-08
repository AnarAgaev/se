import { useMemo, useId, FC } from 'react'
import useStore from '../../Store'
import { TVendor } from '../../types'

import { FactoryWorkspace, ColorSelector, Select,
    OptionBrand, OptionCollection, OptionMaterial } from '../../Components'

const getBrandsOptionsList = (
    brandsList: string[],
    getVendorByName: (brandName: string) => TVendor | undefined,
    key: string
): JSX.Element[] => {

    const elementsList: JSX.Element[] = []

    if (getVendorByName) {
        brandsList.forEach(brandName => {
            const vendor = getVendorByName(brandName)

            if (!vendor) return

            elementsList.push(
                <OptionBrand
                    key={`${key}-${vendor.id}`}
                    name={`brand-${key}`}
                    img={vendor.image}
                    caption={vendor.name} />
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
    const colorsList = useStore(state => state.colors?.borders)
    const brandsList = useStore(state => state.getBordersBrandsList())
    const collectionsList = useStore(state => state.getBordersCollectionsList())
    const materialsList = useStore(state => state.getBordersMaterialsList())

    const brandsOptions = useMemo(
        () => getBrandsOptionsList(brandsList, getVendorByName, key),
        [brandsList, getVendorByName, key]
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