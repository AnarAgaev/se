import { z } from 'zod'


// Backgrounds
const BackgroundsType = z.object({
    id: z.union([z.string(), z.number()]),
    active: z.boolean(),
    image: z.string(),
    preview: z.string()
})

const BackgroundsTypeList = z.array(BackgroundsType)


// Borders
const BorderType = z.object({
    id: z.union([z.string(), z.number()]),
    name: z.string(),
    price: z.union([z.string(), z.number()]),
    color: z.string(),
    image: z.string(),
    preview: z.string(),
})

const BordersTypeList = z.array(BorderType)


// Devices
const DeviceType = z.object({
    id: z.union([z.string(), z.number()]),
    name: z.string(),
    price: z.union([z.string(), z.number()]),
    color: z.string(),
    image: z.string(),
    preview: z.string(),
})

const DevicesTypeList = z.array(DeviceType)


// Initial data
const InitDataContractType = z.object({
    borders: BordersTypeList,

    backgrounds: BackgroundsTypeList,

    devices: DevicesTypeList,

    colors: z.record(z.string(), z.string())
})


export {
    BackgroundsType,
    BackgroundsTypeList,

    BorderType,
    BordersTypeList,

    DeviceType,
    DevicesTypeList,

    InitDataContractType
}