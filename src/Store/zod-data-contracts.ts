import { z } from 'zod'

const BackgroundsType = z.array(
    z.object({
        id: z.union([ z.string(), z.number() ]),
        active: z.boolean(),
        image: z.string(),
        preview: z.string()
    })
)

const InitDataContractType = z.object({
    backgrounds: BackgroundsType
})

export { BackgroundsType, InitDataContractType }