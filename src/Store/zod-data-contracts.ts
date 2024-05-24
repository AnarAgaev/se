import { z } from 'zod'

const BackgroundsType = z.object({
        id: z.union([ z.string(), z.number() ]),
        active: z.boolean(),
        image: z.string(),
        preview: z.string()
    })

const BackgroundsTypeList = z.array(BackgroundsType)

const InitDataContractType = z.object({
    backgrounds: BackgroundsTypeList
})

export { BackgroundsType, BackgroundsTypeList, InitDataContractType }