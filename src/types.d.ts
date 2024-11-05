import {
    TBackground, TBackgroundList,
    TElement, TElementList,
    TBorder, TBorderList,
    TDevice, TDeviceList,
    TCollection, TCollectionList,
    TVendor, TVendorList,
    TProject, TProjectList,
    TRoom, TRoomList,
    TFunction, TFunctionItem, TFunctionList,
    TColorList,
    TDictionary,
    InitDataContract,
} from "./zod"

export type TCalcTabs = 'borders' | 'devices' | 'backgrounds'
export type TItemsType = Exclude<TCalcTabs, 'backgrounds'>
export type TViewportTabs = 'configurator' | 'collections' | 'project' | 'hub'

export type TFunctionOption = { name: string, active?: boolean }
export type TFunctionOptionList = TFunctionOption[]

// #region Bound of the all Stores
export type TStore = {
    requestInitData: () => void
    getFilteredItems: () => Array<TBorder> | Array<TDevice>
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



// #region Sketch
export type TSketchStore = {
    border: TBorder | undefined
    device: {
        [1 | 2 | 3 | 4 | 5]: TDevice | undefined
    }
    project: string | undefined
    placement: string | undefined
    postsCount: number
    selectedPost: boolean[]
    view: 'horizontal' | 'vertical'
    scale: number

    resizeSketch: TResizeSketch
    setFirstBorder: TSetFirstBorder
}
export type TResizeSketch = (direction: -1 | 1) => void
export type TSetFirstBorder = (border: TBorder, postsCount: number) => void
// #endregion



// #region Borders
export type TBordersStore = {
    borders: TBorderList
    setInitBordersData: (payload: TBorderList) => void
    getBordersBrandsList: () => string[]
    getBordersCollectionsList: () => string[]
    getBordersMaterialList: () => string[]


    filtersBorders: TBordersFilters
    setSingleBordersFilter: TSetSingleFilter
    removeSingleBordersFilter: TRemoveSingleFilter<keyof TBordersFilters>
    checkSingleBordersFilter: TCheckSingleFilter<keyof TBordersFilters>
    setPluralBordersFilter: TSetPluralFilter
    removePluralBordersFilter: TRemovePluralFilter
    checkPluralBordersFilter: TCheckPluralFilter
    getCountOfPosts: TGetCountOfPosts
}
export type TGetCountOfPosts = (border: TBorder) => number
// #endregion



// #region Devices
export type TDevicesStore = {
    devices: TDeviceList
    setInitDevicesData: (payload: TDeviceList) => void
    getDevicesList: () => TDeviceList
    getDevicesBrandsList: () => string[]
    getDevicesCollectionsList: () => string[]
    getDevicesMaterialList: () => string[]


    functions: TFunctionList
    setFunctions: (functions: TFunctionList) => void
    getFunctions: () => TFunctionOptionList
    updateActiveFunction: (functionName: string) => void
    getFunctionsKinds: () => TFunctionItem | undefined


    filtersDevices: TDevicesFilters
    setSingleDevicesFilter: TSetSingleFilter
    removeSingleDevicesFilter: TRemoveSingleFilter<keyof TDevicesFilters>
    checkSingleDevicesFilter: TCheckSingleFilter<keyof TDevicesFilters>
    setPluralDevicesFilter: TSetPluralFilter
    removePluralDevicesFilter: TRemovePluralFilter
    checkPluralDevicesFilter: TCheckPluralFilter

    setFunctionProp: TSetFunctionProp
    checkSelectedFunction: TCheckSelectedFunction
    checkSelectedFuncGroup: TCheckSelectedFuncGroup
    resetSelectedFuncGroup: TResetSelectedFuncGroup
}
// #endregion



// #region Functions
export type TFunctionsProperty = {
    name: string
    value: string | number
}

export type TFunctions = {
    active: boolean
    name: string
    props: Record<string, string | number>
    default?: boolean
}

type TFilters = {
    brand?: string
    collection?: string
    colors: string[]
    materials: string[]
    functions: TFunctions[]
}

export type TBordersFilters = Omit<TFilters, 'functions'>
export type TDevicesFilters = TFilters
export type TFilterPropNames = keyof TBordersFilters | keyof TDevicesFilters
export type TGetBrandByCollection = (collectionName: string) => string

export type TSetSingleFilter = (prop: TFilterPropNames, value: string | number) => void
export type TRemoveSingleFilter<T> = (prop: T) => void
export type TCheckSingleFilter<T> = (prop: T, value: string | number) => boolean

export type TSetPluralFilter = (prop: TFilterPropNames, value: string | number) => void
export type TRemovePluralFilter = (prop: TFilterPropNames, value: string | number) => void
export type TCheckPluralFilter = (prop: TFilterPropNames, value: string | number) => boolean

export type TSetFunctionProp = (groupName: string, propName: string, value: string | number) => void
export type TCheckSelectedFunction = (groupName: string, propName: string, value: string | number) => boolean
export type TCheckSelectedFuncGroup = (groupName: string) => boolean
export type TResetSelectedFuncGroup = (groupName: string) => void
// #endregion



// #region App
type TFunc = () => void
export type TSetModalSelect = (caption: string, approveText: string, rejectText: string, payload: Record<string>) => void

export type TAppStore = {
    loading: boolean
    error: Error | unknown

    colors: TColorList | undefined
    setAppColors: (colors: TColorList) => void

    activeCalcTab: TCalcTabs
    setActiveCalcTab: (tab: TCalcTabs) => void

    activeViewportTab: TViewportTabs
    setActiveViewportTab: (tab: TViewportTabs) => void

    vendors: TVendorList
    setAppVendors: (vendors: TVendorList) => void
    getVendorByName: (brandName: string) => TVendor | undefined
    getBrandByCollection: TGetBrandByCollection

    projects: TProjectList
    setAppProjects: (projects: TProjectList) => void
    addProject: (project: string) => void

    rooms: TRoomList
    setAppRooms: (rooms: TRoomList) => void
    addRoom: (room: string) => void

    dictionary: TDictionary
    setDictionary: (dictionary: TDictionary) => void

    modalSelectVisible: boolean
    modalSelectCaption: string
    modalSelectButtonApproveText: string
    modalSelectButtonRejectText: string
    modalSelectPayload: {
        from?: 'brand' | 'collection'
        brandName: string
        collectionName: string
    }
    resetModalSelect: TFunc
    setModalSelect: TSetModalSelect
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
    TFunction, TFunctionItem, TFunctionList,
    TColorList,
    TDictionary,
    InitDataContract
}