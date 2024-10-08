interface Window {
    initSourceDataLink: string
    uploadBackgroundLink: string
}

// Types for bound of the all Stores
interface BoundStore {
    requestInitData: () => void
}


// Types for Backgrounds
interface BackgroundsStore {
    backgrounds: z.infer<typeof BackgroundsList>
    setInitBackgroundsData: (data: z.infer<typeof BackgroundsList>) => void
    addUploadedBackground: (background: z.infer<typeof BackgroundType>) => void
    setActiveBackground: (backgroundId: string | number) => void
}


// Types for Borders
interface BordersStore {
    borders: z.infer<typeof BordersList>
    setInitBordersData: (data: z.infer<typeof BordersList>) => void
    getBordersList: () => Array<z.infer<typeof BorderType>>

    getBordersBrandsList: () => string[]
    getBordersCollectionsList: () => string[]
    getBordersMaterialsList: () => string[]
}


// Types for Devices
interface DevicesStore {
    devices: z.infer<typeof DevicesList>
    setInitDevicesData: (data: z.infer<typeof DevicesList>) => void
    getDevicesList: () => Array<z.infer<typeof DeviceType>>
    getDevicesBrandsList: () => string[]
    getDevicesCollectionsList: () => string[]
    getDevicesMaterialsList: () => string[]
    getDevicesFunctionsList: () => string[]
    getDevicesFunctionsOptions: (deviceFuncProp: string) => string[]
}

// Types for all app
interface AppStore {
    loading: boolean
    error: Error | unknown

    colors: z.infer<typeof ColorsType>
    setAppColors: (colors: z.infer<typeof ColorsType>) => void

    activeCalcTab: CalcTabs
    setActiveCalcTab: (tab: CalcTabs) => void

    activeViewportTab: ViewportTabs
    setActiveViewportTab: (tab: ViewportTabs) => void

    vendors: z.infer<typeof VendorsList>
    setAppVendors: (vendors: z.infer<typeof VendorsList>) => void

    functions: Record<string, string>
    setAppFunctionsKinds: (functions: Record<string, string>) => void
    getAppFunctionsKinds: () => Record<string, string>

    projects: z.infer<typeof ProjectsList>
    setAppProjects: (projects: z.infer<typeof ProjectsList>) => void
    addProject: (project: string) => void

    rooms: z.infer<typeof RoomsList>
    setAppRooms: (rooms: z.infer<typeof RoomsList>) => void
    addRoom: (room: string) => void
}


type CalcTabs = 'borders' | 'devices' | 'backgrounds'
type ViewportTabs = 'configurator' | 'collections' | 'project' | 'hub'