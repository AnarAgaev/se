import {
    TBackground, TBackgroundList,
    TBorder, TBorderList,
    TDeviceList,




    VendorsList, VendorType, TFunctions } from "./zod"

export type CalcTabs = 'borders' | 'devices' | 'backgrounds'
export type ViewportTabs = 'configurator' | 'collections' | 'project' | 'hub'

/** Types for bound of the all Stores */
export type TStore = {
    requestInitData: () => void
}



/** Types for Backgrounds */
export type TBackgroundsStore = {
    backgrounds: TBackgroundList
    setInitBackgroundsData: (payload: TBackgroundList) => void
    addUploadedBackground: (background: TBackground) => void
    setActiveBackground: (backgroundId: string | number) => void
}



/** Types for Borders */
export type TBordersStore = {
    borders: TBorderList
    setInitBordersData: (payload: TBorderList) => void
    getBordersList: () => Array<TBorder>
    getBordersBrandsList: () => string[]
    getBordersCollectionsList: () => string[]
    getBordersMaterialsList: () => string[]
}



/** Types for Devices */
export type TDevicesStore = {
    devices: TDeviceList
    setInitDevicesData: (payload: TDeviceList) => void
    getDevicesList: () => TDeviceList
    getDevicesBrandsList: () => string[]
    getDevicesCollectionsList: () => string[]
    getDevicesMaterialsList: () => string[]
    getDevicesFunctionsList: () => string[]
    getDevicesFunctionsOptions: (deviceFuncProp: string) => string[]
}



/** Types for all app */
export type TAppStore = {
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
    getVendorByName: (brandName: string) => z.infer<typeof VendorType>

    functions: TFunctions | null
    setFunctions: (functions: TFunctions) => void
    // getAppFunctionsKinds: () => Record<string, string>

    projects: z.infer<typeof ProjectsList>
    setAppProjects: (projects: z.infer<typeof ProjectsList>) => void
    addProject: (project: string) => void

    rooms: z.infer<typeof RoomsList>
    setAppRooms: (rooms: z.infer<typeof RoomsList>) => void
    addRoom: (room: string) => void
}
