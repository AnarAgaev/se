import { useMemo, useId } from 'react'
import { z } from 'zod'
import useStore from '../../Store'
import { VendorTypeList } from '../../Store/zod-data-contracts'

import { FactoryWorkspace, ColorSelector, Select, OptionFunction,
    OptionBrand, OptionCollection, OptionMaterial, FunctionalitySelectsList } from '../../Components'

const getBrandOptionsList = (
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
    const vendors = useStore(state => state.vendors)

    const colorsList = useStore(state => state.getDevicesColorsList())
    const devicesList = useStore(state => state.getDevicesBrandsList())
    const collectionsList = useStore(state => state.getDevicesCollectionsList())
    const materialsList = useStore(state => state.getDevicesMaterialsList())
    const functionsList = useStore(state => state.getDevicesFunctionsList())

    const devicesBrandsOptions = useMemo(
        () => getBrandOptionsList(devicesList, vendors, key),
        [devicesList, vendors, key]
    )

    const devicesCollectionsOptions = useMemo(
        () => getCollectionsOptionsList(collectionsList, key),
        [collectionsList, key]
    )

    const devicesMaterialsOptions = useMemo(
        () => getMaterialsOptionsList(materialsList, key),
        [materialsList, key]
    )

    const devicesFunctionsOptions = useMemo(
        () => getFunctionsOptionsList(functionsList, key),
        [functionsList, key]
    )

    return (
        <FactoryWorkspace>
            <Select title="Бренд">{devicesBrandsOptions}</Select>
            <Select title="Коллекцию">{devicesCollectionsOptions}</Select>
            <Select title="Материал рамки">{devicesMaterialsOptions}</Select>
            <Select title="Тип функции">{devicesFunctionsOptions}</Select>
            <FunctionalitySelectsList />
            <ColorSelector caption="Цвет изделия" colors={colorsList} />
        </FactoryWorkspace>
    )
}

export default DevicesWorkspace