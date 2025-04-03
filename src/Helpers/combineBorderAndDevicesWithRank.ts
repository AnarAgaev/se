import { TBorder, TDevice } from '../types'

type TProps = {
    border: TBorder | null,
    devices: Array<TDevice | null>
}

type TReturn = Array<{
    product_id: number,
    rank: number[]
}>

type TProducts = Array<{
    product_id: number,
    rank: number[]
}>

export const combineBorderAndDevicesWithRank = ({ border, devices }: TProps): TReturn  => {
        const products: TProducts = []

        // Договорились, что в нулевом rank (rank: [0]) может быть только border
        if (border) products.push({
            product_id: toNumber(border.id),
            rank: [0]
        })

        const combinedProducts = [
            ...products,
            ...combineDevicesWithRank(devices)
        ]

    return combinedProducts
}

function toNumber(variable: string | number): number {
    return typeof variable === 'string' ? parseFloat(variable) : variable
}

function combineDevicesWithRank(devices: Array<TDevice | null>): TProducts {
    const productsMap: Record<number, number[]> = {}

    devices.forEach((item, idx) => {
        if (item !== null) {
            const deviceId = toNumber(item.id)
            const position = idx + 1

            if (!productsMap[deviceId]) {
                productsMap[deviceId] = []
            }

            productsMap[deviceId].push(position)
        }
    })

    const products: TProducts = Object.entries(productsMap).map(([product_id, rank]) => ({
        product_id: toNumber(product_id),
        rank
    }))

    return products
}