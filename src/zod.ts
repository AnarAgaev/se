import { z } from 'zod'


/** Backgrounds */
export const ZTBackground = z.object({
    id: z.union([z.string(), z.number()]),
    selected: z.boolean(),
    image: z.string(),
    preview: z.string()
})
export type TBackground = z.infer<typeof ZTBackground>

const ZTBackgroundList = z.array(ZTBackground)
export type TBackgroundList = z.infer<typeof ZTBackgroundList>



/** Common properties for Border and Devices */
export const ZTElement = z.object({
    id: z.union([z.string(), z.number()]),
    name: z.string(),
    price: z.union([z.string(), z.number()]),
    image: z.string(),
    color: z.string(),
    preview: z.string(),
    vendor: z.string(),
    collection: z.string(),
    armature_material: z.array(z.string()).optional(), // У некоторых рамок и девайсов не указан материал!!!
})
export type TElement = z.infer<typeof ZTElement>



/** Borders */
export const ZTBorder = ZTElement.extend({
    number_of_posts: z.string().optional()
})
export type TBorder = z.infer<typeof ZTBorder>

export const ZTBorderList = z.array(ZTBorder)
export type TBorderList = z.infer<typeof ZTBorderList>



/** Devices */
export const ZTDevice = ZTElement.extend({
    conf_product_group: z.string().optional(), // У некоторых девайсов не указан тип!!!
})
export type TDevice = z.infer<typeof ZTDevice>

export const ZTDeviceList = z.array(ZTDevice)
export type TDeviceList = z.infer<typeof ZTDeviceList>





/** Collections */
export const CollectionType = z.object({
    name: z.string(),
    materials: z.array(z.string())
})

export const CollectionsList = z.array(CollectionType)



/** Vendors */
export const VendorType = z.object({
    id: z.union([z.string(), z.number()]),
    name: z.string(),
    image: z.string(),
    collections: CollectionsList
})

export const VendorsList = z.array(VendorType)



/** Projects */
export const ProjectType = z.object({
    id: z.union([z.number(), z.string()]),
    selected: z.boolean(),
    name: z.string()
})

export const ProjectsList = z.array(ProjectType)



/** Rooms */
export const RoomType = z.object({
    id: z.union([z.number(), z.string()]),
    selected: z.boolean(),
    name: z.string()
})

export const RoomsList = z.array(RoomType)



/** Functions */
const FunctionProp = z.object({
    "conf_product_group": z.string(),
    "values": z.array(z.union([z.number(), z.string()])),
})
export type TFunctionProp = z.infer<typeof FunctionProp>

const Functions = z.array(z.object({
    "name": z.string(),
    "props": z.array(FunctionProp),
}))
export type TFunctions = z.infer<typeof Functions>



/** Colors */
export const ColorsType = z.object({
    borders: z.array(z.string()),
    devices: z.array(z.string())
})



/** Dictionary */
export const Dictionary = z.object({
    "ru": z.record(z.string())
})
export type Dictionary = z.infer<typeof Dictionary>



/** Initial data */
export const InitDataContractType = z.object({
    borders: ZTBorderList,

    backgrounds: ZTBackgroundList,

    devices: ZTDeviceList,

    colors: ColorsType,

    vendors: VendorsList,

    functions: Functions,

    projects: ProjectsList,

    rooms: RoomsList
})
