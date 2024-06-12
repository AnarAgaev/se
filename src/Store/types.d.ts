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
    backgrounds: z.infer<typeof BackgroundsTypeList>
    setInitBackgroundsData: (data: z.infer<typeof BackgroundsTypeList>) => void
    addUploadedBackground: (background: z.infer<typeof BackgroundsType>) => void
    setActiveBackground: (backgroundId: string | number) => void
}


// Types for Borders
interface BordersStore {
    borders: z.infer<typeof BordersTypeList>
    setInitBordersData: (data: z.infer<typeof BordersTypeList>) => void
    getBordersColorsList: () => Array<string>
    getBordersList: () => Array<z.infer<typeof BorderType>>

    getBordersBrandsList: () => string[]
    getBordersCollectionsList: () => string[]
    getBordersMaterialsList: () => string[]
}


// Types for Devices
interface DevicesStore {
    devices: z.infer<typeof DevicesTypeList>
    setInitDevicesData: (data: z.infer<typeof DevicesTypeList>) => void
    getDevicesColorsList: () => Array<string>
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

    colors: Record<string, string>
    setAppColors: (colors: Record<string, string>) => void

    activeCalcTab: CalcTabs
    setActiveCalcTab: (tab: CalcTabs) => void

    activeViewportTab: ViewportTabs
    setActiveViewportTab: (tab: ViewportTabs) => void

    vendors: Record<string, z.infer<typeof VendorType>>
    setAppVendors: (vendors: Record<string, z.infer<typeof VendorType>>) => void

    functions: Record<string, string>
    setAppFunctionsKinds: (functions: Record<string, string>) => void
    getAppFunctionsKinds: () => Record<string, string>

    projects: Record<string, unknown>
    setAppProjects: (projects: Record<string, unknown>) => void
    addProject: (project: string) => void

    rooms: Record<string, unknown>
    setAppRooms: (rooms: Record<string, unknown>) => void
    addRoom: (project: string) => void
}


type CalcTabs = 'borders' | 'devices' | 'backgrounds'
type ViewportTabs = 'configurator' | 'collections' | 'project' | 'hub'