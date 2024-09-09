import { z } from 'zod'


// Backgrounds
const BackgroundType = z.object({
    id: z.union([z.string(), z.number()]),
    selected: z.boolean(),
    image: z.string(),
    preview: z.string()
})

const BackgroundsList = z.array(BackgroundType)


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
    number_of_posts: z.string().optional(),
    armature_material: z.array(z.string()).optional() // У некоторых рамок не указан материал!!!
})

const BordersList = z.array(BorderType)


// Devices
const DeviceType = z.object({
    id: z.union([z.string(), z.number()]),
    name: z.string(),
    price: z.union([z.string(), z.number()]),
    image: z.string(),
    preview: z.string(),

    vendor: z.string(),
    collection: z.string(),
    armature_material: z.array(z.string()).optional(), // У некоторых девайсов не указан материал!!!
    conf_product_group: z.string().optional(), // У некоторых девайсов не указан тип!!!
    color: z.string(),

    // type: z.string(),
    // deviceType: z.string(),
    // keysCount: z.number(),
    // backlight: z.string(),
    // withGrounding: z.string(),
    // withCurtains: z.string(),
    // withProtection: z.string(),
    // withFunctions: z.string(),
    // connectionType: z.string(),
    // connectorsCount: z.number(),
})

const DevicesList = z.array(DeviceType)


// Vendors
const CollectionType = z.object({
    name: z.string(),
    materials: z.array(z.string())
})

const CollectionsList = z.array(CollectionType)

const VendorType = z.object({
    name: z.string(),
    image: z.string(),
    collections: CollectionsList
})

const VendorsList = z.array(VendorType)

// Projects
const ProjectType = z.object({
    id: z.union([z.number(), z.string()]),
    selected: z.boolean(),
    name: z.string()
})

const ProjectsList = z.array(ProjectType)

// Rooms
const RoomType = z.object({
    id: z.union([z.number(), z.string()]),
    selected: z.boolean(),
    name: z.string()
})

const RoomsList = z.array(RoomType)

// Initial data
const ColorsType = z.object({
    borders: z.array(z.string()),
    devices: z.array(z.string())
})

const InitDataContractType = z.object({
    borders: BordersList,

    backgrounds: BackgroundsList,

    devices: DevicesList,

    colors: ColorsType,

    vendors: VendorsList,

    // functions: z.record(z.string(), z.string()), // переписать

    projects: ProjectsList,

    rooms: RoomsList
})


export {
    BackgroundType,
    BackgroundsList,

    BorderType,
    BordersList,

    DeviceType,
    DevicesList,

    InitDataContractType,

    VendorsList,

    ColorsType,

    ProjectType,
    ProjectsList,

    RoomType,
    RoomsList,

    CollectionType,
    CollectionsList
}