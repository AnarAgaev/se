import { z } from 'zod'
import { ErrorMessageOptions } from 'zod-error'



// #region Backgrounds
export const Background = z.object({
    id: z.union([z.string(), z.number()]),
    selected: z.boolean(),
    image: z.string(),
    preview: z.string(),
    default: z.boolean().optional()
})
export type TBackground = z.infer<typeof Background>

const BackgroundList = z.array(Background)
export type TBackgroundList = z.infer<typeof BackgroundList>
// #endregion



// #region Common properties for Border and Devices
export const Element = z.object({
    id: z.union([z.string(), z.number()]),
    name: z.string(),
    active: z.boolean().optional(),
    available: z.boolean().optional(),
    price: z.union([z.string(), z.number()]),
    start_price: z.union([z.string(), z.number(), z.null()]).optional(),
    image: z.string(),
    conf_color: z.string(),
    preview: z.string(),
    vendor: z.string(),
    collection: z.string(),
    article: z.string(),
    show_article: z.string(),
    armature_material: z.array(z.string()).optional(),
    rank: z.union([z.string(), z.null()]).optional()
})
export type TElement = z.infer<typeof Element>

export const ElementList = z.array(Element)
export type TElementList = z.infer<typeof ElementList>
// #endregion



// #region Borders
export const Border = Element.extend({
    conf_orientation: z.union([z.literal("universal"), z.literal("vertical")]).optional(),
    number_of_posts: z.array(z.string()).optional()
}).passthrough()
export type TBorder = z.infer<typeof Border>

export const BorderList = z.array(Border)
export type TBorderList = z.infer<typeof BorderList>
// #endregion



// #region Devices
export const Device = Element.extend({
    conf_product_group: z.string().optional(),
    conf_device_type: z.array(z.string()).optional()
}).passthrough()
export type TDevice = z.infer<typeof Device> & {
    [key: string]: string | number
}

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



// #region Projects & Configuration
export const Directions = z.union([z.literal('horizontal'), z.literal('vertical'), z.literal('universal')])
export type TDirections = z.infer<typeof Directions>

export const Configuration = z.object({
    id: z.union([z.number(), z.string()]),
    border: Border.optional(),
    devices: z.array(z.union([Device, z.null()])).optional(),
    count: z.number(),
    background: z.union([z.number(), z.string()]).optional(),
    edit: z.boolean().optional(),
    direction: Directions
})
export type TConfiguration = z.infer<typeof Configuration>

export const ConfigurationList = z.array(Configuration)
export type TConfigurationList = z.infer<typeof ConfigurationList>

export const RoomItem = z.object({
    id: z.union([z.number(), z.string()]),
    name: z.string(),
    configurations: ConfigurationList
})
export type TRoomItem = z.infer<typeof RoomItem>

export const Rooms = z.array(RoomItem)
export type TRooms = z.infer<typeof Rooms>

export const Project = z.object({
    id: z.union([z.number(), z.string()]),
    name: z.string(),
    selected: z.boolean(),
    edit: z.boolean(),
    rooms: Rooms.optional(),
    token: z.union([z.string(), z.null()]).optional(),
    localProject: z.boolean().optional(),
    shared: z.boolean().optional()
})
export type TProject = z.infer<typeof Project>

export const ProjectList = z.array(Project)
export type TProjectList = z.infer<typeof ProjectList>
// #endregion



// #region Rooms
export const Room = z.object({
    id: z.union([z.number(), z.string()]),
    selected: z.boolean(),
    name: z.string(),
	default: z.boolean()
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


const FunctionItem = z.object({
    "name": z.string(),
    "props": z.array(Function),
    "active": z.boolean().optional()
})
export type TFunctionItem = z.infer<typeof FunctionItem>

const FunctionList = z.array(FunctionItem)
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
    backgrounds: BackgroundList,
    borders: BorderList,
    devices: DeviceList,
    colors: ColorList,
    vendors: VendorList,
    functions: FunctionList,
    projects: ProjectList,
    rooms: RoomList,
    lang: Dictionary
})
// #endregion

export const zodErrorOptions: ErrorMessageOptions = {
    delimiter: {
        error: '\n',
    },
    path: {
        enabled: true,
        type: 'zodPathArray',
        label: 'Zod Path: ',
    },
    code: {
        enabled: true,
    },
    message: {
        enabled: true,
        label: '',
    },
    transform: ({ errorMessage, index }) => `🔥 \x1b[31m Zod Error #${index + 1}: \x1b[33m ${errorMessage}`,
}
