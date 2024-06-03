import { useMemo, useId } from 'react'
import { z } from 'zod'
import useStore from '../../Store'
import { FactoryWorkspace, ColorSelector, Select, OptionBrand } from '../../Components'
import { VendorTypeList } from '../../Store/zod-data-contracts'

const getBrandOptionsList = (
    brandsList: string[],
    vendors: z.infer<typeof VendorTypeList>,
    key: string): JSX.Element[] => {

        const elementsList: JSX.Element[] = []

        brandsList.forEach(brand => {
            for (let prop in vendors) {
                if (prop.toLocaleLowerCase() === brand.toLocaleLowerCase()) {
                    elementsList.push(
                        <OptionBrand
                            key={`${key}-${vendors[prop].name}`}
                            img={vendors[prop].image}
                            caption={vendors[prop].title} />
                    )
                }
            }
        })

    return elementsList
}

const BordersWorkspace = () => {
    const colorsList = useStore(state => state.getBordersColorsList())
    const brandsList = useStore(state => state.getBordersBrandsList())
    const vendors = useStore(state => state.vendors)
    const key = useId()

    const brandsOptions = useMemo(
        () => getBrandOptionsList(brandsList, vendors, key),
        [brandsList, vendors, key]
    )

    const collectionsOptions = useMemo(
        () => [],
        []
    )

    const materialsOptions = useMemo(
        () => [],
        []
    )

    return (
        <FactoryWorkspace>
            <Select title="Бренд">{brandsOptions}</Select>
            <Select title="Коллекцию">{collectionsOptions}</Select>
            <Select title="Материал рамки">{materialsOptions}</Select>
            <ColorSelector caption="Цвет рамки" colors={colorsList} />
        </FactoryWorkspace>
    )
}

export default BordersWorkspace