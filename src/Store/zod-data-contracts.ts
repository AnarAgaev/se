import { z } from 'zod'

const BackgroundsType = z.object({
    id: z.union([z.string(), z.number()]),
    active: z.boolean(),
    image: z.string(),
    preview: z.string()
})

const BackgroundsTypeList = z.array(BackgroundsType)

const BorderType = z.object({
    id: z.union([z.string(), z.number()]),
    name: z.string(),
    price: z.union([z.string(), z.number()]),
    color: z.string(),
    image: z.string(),
    preview: z.string(),
})

const BordersTypeList = z.array(BorderType)

const InitDataContractType = z.object({
    borders: BordersTypeList,

    backgrounds: BackgroundsTypeList,

    colors: z.record(z.string(), z.string())
})

export {
    BorderType,
    BordersTypeList,
    BackgroundsType,
    BackgroundsTypeList,
    InitDataContractType
}