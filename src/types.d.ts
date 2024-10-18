import {
    TBackground, TBackgroundList,
    TElement, TElementList,
    TBorder, TBorderList,
    TDevice, TDeviceList,
    TCollection, TCollectionList,
    TVendor, TVendorList,
    TProject, TProjectList,
    TRoom, TRoomList,
    TFunction, TFunctionList,
    TColorList,
    TDictionary,
    InitDataContract,
} from "./zod"

export type TCalcTabs = 'borders' | 'devices' | 'backgrounds'
export type TViewportTabs = 'configurator' | 'collections' | 'project' | 'hub'

export type TFunctionOption = { name: string, active?: boolean }
export type TFunctionOptionList = TFunctionOption[]

// #region Bound of the all Stores
export type TStore = {
    requestInitData: () => void
}
// #endregion



// #region Backgrounds
export type TBackgroundsStore = {
    backgrounds: TBackgroundList
    setInitBackgroundsData: (payload: TBackgroundList) => void
    addUploadedBackground: (background: TBackground) => void
    setActiveBackground: (backgroundId: string | number) => void
}
// #endregion



// #region Borders
export type TBordersStore = {
    borders: TBorderList
    setInitBordersData: (payload: TBorderList) => void
    getBordersList: () => Array<TBorder>
    getBordersBrandsList: () => string[]
    getBordersCollectionsList: () => string[]
    getBordersMaterialsList: () => string[]
}
// #endregion



// #region Devices
export type TDevicesStore = {
    devices: TDeviceList
    setInitDevicesData: (payload: TDeviceList) => void
    getDevicesList: () => TDeviceList
    getDevicesBrandsList: () => string[]
    getDevicesCollectionsList: () => string[]
    getDevicesMaterialsList: () => string[]

    functions: TFunctionList
    setFunctions: (functions: TFunctionList) => void
    getFunctions: () => TFunctionOptionList
    updateActiveFunction: (functionName: string) => void
    getFunctionsKinds: () => TFunction[]
}
// #endregion



// #region App
export type TAppStore = {
    loading: boolean
    error: Error | unknown

    colors: TColorList | undefined
    setAppColors: (colors: TColorList) => void

    activeCalcTab: TCalcTabs
    setActiveCalcTab: (tab: TCalcTabs) => void

    activeViewportTab: TViewportTabs
    setActiveViewportTab: (tab: TViewportTabs) => void

    vendors: TVendorList | undefined
    setAppVendors: (vendors: TVendorList) => void
    getVendorByName: (brandName: string) => TVendor | undefined

    projects: TProjectList
    setAppProjects: (projects: TProjectList) => void
    addProject: (project: string) => void

    rooms: TRoomList
    setAppRooms: (rooms: TRoomList) => void
    addRoom: (room: string) => void

    dictionary: TDictionary
    setDictionary: (dictionary: TDictionary) => void
}
// #endregion



export {
    TBackground, TBackgroundList,
    TElement, TElementList,
    TBorder, TBorderList,
    TDevice, TDeviceList,
    TCollection, TCollectionList,
    TVendor, TVendorList,
    TProject, TProjectList,
    TRoom, TRoomList,
    TFunction, TFunctionList,
    TColorList,
    TDictionary,
    InitDataContract
}