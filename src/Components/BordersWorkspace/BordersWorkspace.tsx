import { useMemo, useId, FC } from 'react'
import { z } from 'zod'
import useStore from '../../Store'
import { VendorTypeList } from '../../Store/zod-data-contracts'

import { FactoryWorkspace, ColorSelector, Select,
    OptionBrand, OptionCollection, OptionMaterial } from '../../Components'

const getBrandsOptionsList = (
    brandsList: string[],
    vendors: z.infer<typeof VendorTypeList>,
    key: string
): JSX.Element[] => {

    const elementsList: JSX.Element[] = []

    brandsList.forEach(brand => {
        for (let prop in vendors) {
            if (prop.toLocaleLowerCase() === brand.toLocaleLowerCase()) {
                elementsList.push(
                    <OptionBrand
                        key={`${key}-${vendors[prop].name}`}
                        name={`brand-${key}`}
                        img={vendors[prop].image}
                        caption={vendors[prop].title} />
                )
            }
        }
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
    const vendors = useStore(state => state.vendors)

    const colorsList = useStore(state => state.getBordersColorsList())
    const brandsList = useStore(state => state.getBordersBrandsList())
    const collectionsList = useStore(state => state.getBordersCollectionsList())
    const materialsList = useStore(state => state.getBordersMaterialsList())

    const bordersBrandsOptions = useMemo(
        () => getBrandsOptionsList(brandsList, vendors, key),
        [brandsList, vendors, key]
    )

    const bordersCollectionsOptions = useMemo(
        () => getCollectionsOptionsList(collectionsList, key),
        [collectionsList, key]
    )

    const bordersMaterialsOptions = useMemo(
        () => getMaterialsOptionsList(materialsList, key),
        [materialsList, key]
    )

    return (
        <FactoryWorkspace>
            <Select title="Бренд">{bordersBrandsOptions}</Select>
            <Select title="Коллекцию">{bordersCollectionsOptions}</Select>
            <Select title="Материал рамки">{bordersMaterialsOptions}</Select>
            <ColorSelector caption="Цвет рамки" colors={colorsList} />
        </FactoryWorkspace>
    )
}

export default BordersWorkspace