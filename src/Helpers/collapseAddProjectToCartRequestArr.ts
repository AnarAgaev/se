import { TAddProductsToCart } from '../types'

type TDataArr = Parameters<TAddProductsToCart>[0]

export const collapseAddProjectToCartRequestArr = (requestArr: TDataArr): TDataArr => {

    const requestMap = new Map()

    for (const i of requestArr) {

        if (requestMap.has(i.article)) {
            const existingItem = requestMap.get(i.article)
            existingItem.count = existingItem.count + i.count
        } else {
            requestMap.set(i.article, { ...i })
        }
    }

    return Array.from(requestMap.values())
}