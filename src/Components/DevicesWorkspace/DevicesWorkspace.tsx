import { useMemo, useId } from 'react'
import useStore from '../../Store'
import { TVendor } from '../../types'

import { FactoryWorkspace, ColorSelector, Select, OptionFunction,
    OptionBrand, OptionCollection, OptionMaterial, FunctionalitySelectsList } from '../../Components'

const getBrandOptionsList = (
    brandsList: string[],
    getVendorByName: (brandName: string) => TVendor | undefined ,
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

const getFunctionsOptionsList = (
    functionsList: string[],
    key: string
): JSX.Element[] => {

    const elementsList: JSX.Element[] = []

    functionsList.forEach(functionName => {
        elementsList.push(
            <OptionFunction
                key={`${key}-${functionName}`}
                name={`function-${key}`}
                caption={functionName} />
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
    const materialsList = useStore(state => state.getDevicesMaterialsList())
    const functionsList = useStore(state => state.getDevicesFunctionsList())

    const brandsOptions = useMemo(
        () => getBrandOptionsList(brandsList, getVendorByName, key),
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
            {colorsList && <ColorSelector caption="Цвет устройства" colors={colorsList} />}
        </FactoryWorkspace>
    )
}

export default DevicesWorkspace