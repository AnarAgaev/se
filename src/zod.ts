import { z } from 'zod'

// #region Backgrounds
export const Background = z.object({
    id: z.union([z.string(), z.number()]),
    selected: z.boolean(),
    image: z.string(),
    preview: z.string()
})
export type TBackground = z.infer<typeof Background>

const BackgroundList = z.array(Background)
export type TBackgroundList = z.infer<typeof BackgroundList>
// #endregion



// #region Common properties for Border and Devices
export const Element = z.object({
    id: z.union([z.string(), z.number()]),
    name: z.string(),
    price: z.union([z.string(), z.number()]),
    image: z.string(),
    color: z.string(),
    preview: z.string(),
    vendor: z.string(),
    collection: z.string(),
    armature_material: z.array(z.string()).optional(),
})
export type TElement = z.infer<typeof Element>
// #endregion



// #region Borders
export const Border = Element.extend({
    number_of_posts: z.string().optional()
})
export type TBorder = z.infer<typeof Border>

export const BorderList = z.array(Border)
export type TBorderList = z.infer<typeof BorderList>
// #endregion



// #region Devices
export const Device = Element.extend({
    conf_product_group: z.string().optional(), // У некоторых девайсов не указан тип!!!
})
export type TDevice = z.infer<typeof Device>

export const DeviceList = z.array(Device)
export type TDeviceList = z.infer<typeof DeviceList>
// #endregion



// #region Collections
export const Collection = z.object({
    name: z.string(),
    materials: z.array(z.string())
})
export type TCollection = z.infer<typeof Collection>

export const CollectionList = z.array(Collection)
export type TCollectionList = z.infer<typeof CollectionList>
// #endregion



// #region Vendors
export const Vendor = z.object({
    id: z.union([z.string(), z.number()]),
    name: z.string(),
    image: z.string(),
    collections: CollectionList
})
export type TVendor = z.infer<typeof Vendor>

export const VendorList = z.array(Vendor)
export type TVendorList = z.infer<typeof VendorList>
// #endregion



// #region Projects
export const Project = z.object({
    id: z.union([z.number(), z.string()]),
    selected: z.boolean(),
    name: z.string()
})
export type TProject = z.infer<typeof Project>

export const ProjectList = z.array(Project)
export type TProjectList = z.infer<typeof ProjectList>
// #endregion



// #region Rooms
export const Room = z.object({
    id: z.union([z.number(), z.string()]),
    selected: z.boolean(),
    name: z.string()
})
export type TRoom = z.infer<typeof Room>

export const RoomList = z.array(Room)
export type TRoomList = z.infer<typeof RoomList>
// #endregion



// #region Functions
const Function = z.object({
    "conf_product_group": z.string(),
    "values": z.array(z.union([z.number(), z.string()])),
})
export type TFunction = z.infer<typeof Function>

const FunctionList = z.array(z.object({
    "name": z.string(),
    "props": z.array(Function),
}))
export type TFunctionList = z.infer<typeof FunctionList>
// #endregion



// #region Colors
export const ColorList = z.object({
    borders: z.array(z.string()),
    devices: z.array(z.string())
})
export type TColorList = z.infer<typeof ColorList>
// #endregion



// #region Dictionary
export const Dictionary = z.object({
    "ru": z.record(z.string())
})
export type TDictionary = z.infer<typeof Dictionary>
// #endregion



// #region Initial data
export const InitDataContract = z.object({
    borders: BorderList,
    backgrounds: BackgroundList,
    devices: DeviceList,
    colors: ColorList,
    vendors: VendorList,
    functions: FunctionList,
    projects: ProjectList,
    rooms: RoomList
})
// #endregion