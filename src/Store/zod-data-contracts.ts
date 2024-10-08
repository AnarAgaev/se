import { z } from 'zod'

// Backgrounds
const BackgroundType = z.object({
    id: z.union([z.string(), z.number()]),
    selected: z.boolean(),
    image: z.string(),
    preview: z.string()
})

const BackgroundsList = z.array(BackgroundType)


// Common properties for Border and Devices
const ElementType = z.object({
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

const BorderType = ElementType.extend({
    number_of_posts: z.string().optional()
})

const BordersList = z.array(BorderType)


// Devices
const DeviceType = ElementType.extend({
    conf_product_group: z.string().optional(), // У некоторых девайсов не указан тип!!!
})

const DevicesList = z.array(DeviceType)


// Vendors
const CollectionType = z.object({
    name: z.string(),
    materials: z.array(z.string())
})

const CollectionsList = z.array(CollectionType)

const VendorType = z.object({
    id: z.union([z.string(), z.number()]),
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
    ElementType,

    BackgroundType,
    BackgroundsList,

    BorderType,
    BordersList,

    DeviceType,
    DevicesList,

    InitDataContractType,

    VendorType,
    VendorsList,

    ColorsType,

    ProjectType,
    ProjectsList,

    RoomType,
    RoomsList,

    CollectionType,
    CollectionsList
}