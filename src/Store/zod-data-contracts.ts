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
    vendor: z.string(),
    collection: z.string(),
    material: z.string()
})

const BordersTypeList = z.array(BorderType)


// Devices
const DeviceType = z.object({
    id: z.union([z.string(), z.number()]),
    name: z.string(),
    price: z.union([z.string(), z.number()]),
    image: z.string(),
    preview: z.string(),

    type: z.string(),

    vendor: z.string(),
    collection: z.string(),
    material: z.string(),
    function: z.string(),
    color: z.string(),

    deviceType: z.string(),
    keysCount: z.number(),
    backlight: z.string(),
    withGrounding: z.string(),
    withCurtains: z.string(),
    withProtection: z.string(),
    withFunctions: z.string(),
    connectionType: z.string(),
    connectorsCount: z.number(),
})

const DevicesTypeList = z.array(DeviceType)


// Vendors
const CollectionType = z.union([
    z.null(),
    z.record(
        z.string(),
        z.array(z.string())
    )
])

const VendorType = z.object({
    name: z.string(),
    title: z.string(),
    image: z.string(),
    collections: CollectionType
})

const VendorTypeList = z.record(
    z.string(),
    VendorType
)


// Initial data
const InitDataContractType = z.object({
    borders: BordersTypeList,

    backgrounds: BackgroundsTypeList,

    devices: DevicesTypeList,

    colors: z.record(z.string(), z.string()),

    vendors: VendorTypeList,

    functions: z.record(z.string(), z.string()),

    projects: z.record(z.string(), z.record(z.string(), z.unknown())),

    rooms: z.record(z.string(), z.record(z.string(), z.unknown()))
})


export {
    BackgroundsType,
    BackgroundsTypeList,

    BorderType,
    BordersTypeList,

    DeviceType,
    DevicesTypeList,

    InitDataContractType,

    VendorTypeList
}