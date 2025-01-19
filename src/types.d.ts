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
    TUserId,
    InitDataContract,
    TConfiguration,
    TConfigurationList,
    TRoomItem,
    TRooms,
    TDirections
} from "./zod"

export type TCalcTabs = 'borders' | 'devices' | 'backgrounds'
export type TItemsType = Exclude<TCalcTabs, 'backgrounds'>
export type TViewportTabs = 'configurator' | 'collections' | 'project' | 'hub'

export type TFunctionOption = { name: string, active?: boolean }
export type TFunctionOptionList = TFunctionOption[]

export type TColorPalette = Record<string, string>
export type TColorsType = Exclude<TCalcTabs, 'backgrounds'>

export type TRequestAddConfiguration = {
    projectId: string | number
	roomId: string | number
	border: TBorder | null
	devices: (TDevice | null)[] | null
    counts: number
	backgroundId?: string | number
    direction: TDirections
}

export type TRequestSaveConfiguration = {
    projectId: string | number
	roomId: string | number
	configurationId: string | number
	border: TBorder | null
	devices: (TDevice | null)[] | null
    counts: number
	backgroundId?: string | number
    direction: TDirections
}

export type TRequestUpdateConfigurationCount = {
    projectId: string | number
    roomId: string | number
    configurationId: string | number
    count: number
}

export type TRequestRemoveConfiguration = {
    projectId: string | number
    roomId: string | number
    configurationId: string | number
}

export type TRequestCopyReplaceConfiguration = {
	projectIdFrom: string | number
	roomIdFrom: string | number
	configurationId: string | number
	projectIdTo: string | number
	roomIdTo: string | number
	requestType: "copy" | "replace"
}

// #region Bound of the all Stores
export type TStore = {
    requestInitData: () => void
    getFilteredItems: () => Array<TBorder> | Array<TDevice>
    getColorPallette: (type: TColorsType) => TColorPalette
}
// #endregion



// #region Backgrounds
export type TBackgroundsStore = {
    backgrounds: TBackgroundList
    addUploadedBackground: (background: TBackground) => void
    setActiveBackground: (backgroundId: string | number) => void
    getSelectedBackgroundId: () => string | number | null
    resetBackground: () => void
    setEditBackground: (backgroundId: string | number | undefined) => void
}
// #endregion



// #region Sketch
export type TSketchStore = {
    border: TBorder | null
    deviceList: TSketchDeviceList
    project: string | undefined
    placement: string | undefined
    postsCount: number
    selectedPost: boolean[]
    direction: TDirections
    scale: number
    visible: boolean

    resizeSketch: TResizeSketch
    setBorder: TSetBorder
    resetSketch: TResetSketch
    setDirection: TSetDirection
    setDevice: TSetDevice
    removeDevice: TRemoveDevice
    fixDeviceList: TFixDeviceList,
    checkDevices: TCheckDevices,
    setVisible: TSetVisible,

    setEditSketch: TSetEditSketch
}

// export type TDirections = 'horizontal' | 'vertical'
export type TResizeSketch = (direction: -1 | 1) => void
export type TSetBorder = (border: TBorder, numberOfPost: TNumberOfPosts, countOfPosts?: number, direction?: TDirections ) => void
export type TResetSketch = () => void
export type TSetDirection = (d: TDirections) => void
export type TSketchDeviceItem = TDevice | null
export type TSketchDeviceList = Record<1, TSketchDeviceItem> & Partial<Record<2 | 3 | 4 | 5, TSketchDeviceItem>>
export type TSetDevice = (d: TDevice) => void
export type TRemoveDevice = (remoteDevicePosition: TNumberOfPosts | null, remoteDeviceId?: string | number) => void
export type TFixDeviceList = (numberOfPosts: TNumberOfPosts) => TSketchDeviceList
export type TNumberOfPosts = 1 | 2 | 3 | 4 | 5
export type TCheckDevices = () => boolean
export type TSetVisible = (direction: boolean) => void

export type TSetEditSketch = (
    border: TBorder | null,
    numberOfPost: TNumberOfPosts | null,
    countOfPosts: number | null,
    devices: (TDevice | null)[] | null,
    direction: TDirections
) => void

export type TDefaultSketchProps = Omit<TSketchStore, 'resizeSketch' | 'setFirstBorder'
    | 'setBorder' | 'resetSketch' | 'setDirection' | 'setDevice' | 'fixDeviceList'
    | 'removeDevice' | 'checkDevices' | 'setVisible' | 'setEditSketch' >

// #endregion



// #region Borders
export type TBordersStore = {
    borders: TBorderList
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
    getSiblingBorder: TGetSiblingBorder
    checkSiblingBorder: TCheckSiblingBorder
    checkSelectedBorderFilters: TCheckSelectedBorderFilters
    resetAllBorderFilters: TResetAllBorderFilters
}
export type TGetCountOfPosts = (border: TBorder) => number
export type TGetSiblingBorder = (border: TBorder, numberOfPost: number, direction: TDirections) => TBorder | undefined
export type TCheckSiblingBorder = (f: TBorder, s: TBorder) => boolean
export type TCheckSelectedBorderFilters = () => boolean
export type TResetAllBorderFilters = () => void
// #endregion



// #region Devices
export type TDevicesStore = {
    devices: TDeviceList
    getDevicesList: () => TDeviceList
    getDevicesBrandsList: () => string[]
    getDevicesCollectionsList: () => string[]
    getDevicesMaterialList: () => string[]


    functions: TFunctionList
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

    checkSelectedDeviceFilters: TCheckSelectedDeviceFilters
    resetAllDeviceFilters: TResetAllDeviceFilters
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

export type TFilters = {
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

export type TCheckSelectedDeviceFilters = () => boolean
export type TResetAllDeviceFilters = () => void
// #endregion



// #region App
type TFunc = () => void
type TFireError = (error: Error) => void
export type TSetModalSelect = (caption: string, approveText: string, rejectText: string, payload: Record<string>) => void

export type TAppStore = {
    userId?: TUserId

    loading: boolean
    dataLoading: boolean

    error: Error | unknown
    fireError: TFireError


    setCountTimeoutId: Timer | undefined
    startValueConfigurationCount: number | null

    // #region Colors
    colors: TColorList | undefined
    // #endregion


    // #region Tabs
    activeCalcTab: TCalcTabs
    setActiveCalcTab: (tab: TCalcTabs) => void

    activeViewportTab: TViewportTabs
    setActiveViewportTab: (tab: TViewportTabs) => void
    // #endregion


    // #region Vendors
    vendors: TVendorList
    getVendorByName: (brandName: string) => TVendor | undefined
    getBrandByCollection: TGetBrandByCollection
    // #endregion


    // #region Project
    projects: TProjectList
    addProject: (project: string) => void
    setProject: (id: TProject['id']) => void
    editProject: (id: TProject['id']) => void
    shareProject: (id: TProject['id']) => void
    removeProject: (id: TProject['id'], name: TProject['name']) => void
    loadProject: (id: TProject['id']) => void
    checkProject: () => boolean
    resetProject: () => void
    // #endregion


    // #region Rooms
    rooms: TRoomList
    addRoom: (room: string) => void
    setRoom: (id: TRoom['id']) => void
    checkRoom: () => boolean
    resetRoom: () => void
    // #endregion


    // #region Configuration Actions
    currentConfiguration: {
        projectId: string | number | null
        roomId: string | number | null
        configurationId: string | number | null
        type: 'copy' | 'replace' | null
    }

    setCurrentConfiguration: ( configuration: currentConfiguration ) => void

    resetCurrentConfiguration: () => void

    copyReplaceConfiguration: (
        projectId: string | number,
        roomId: string | number,
        roomName: string
    ) => void

    addConfiguration: (
        projectId: string | number,
        roomId: string | number,
        roomName: string,
        backgroundId: string | number | null,
        border: TBorder | null,
        devices: (TDevice | null)[],
        counts: number,
        direction: TDirections
    ) => void

    setConfigurationCount: (
        projectId: string | number,
        roomId: string | number,
        configurationId: string | number,
        direction: -1 | 1
    ) => void

    updateRemoteConfigurationCount: (
        projectId: string | number,
        roomId: string | number,
        configurationId: string | number,
        count: number
    ) => void

    resetConfigurationCountToStart: (
        projectId: string | number,
        roomId: string | number,
        configurationId: string | number
    ) => void

    removeConfiguration: (
        projectId: string | number,
        roomId: string | number,
        configurationId: string | number
    ) => void
    // #endregion


    // #region Edit Configuration
    editConfiguration: {
        projectId: string | number,
        roomId: string | number,
        configurationId: string | number
    } | null

    setEditConfiguration: (
        projectId: string | number,
        roomId: string | number,
        configurationId: string | number
    ) => void

    resetEditConfiguration: () => void

    saveConfiguration: (
        // projectId: string | number,
        // roomId: string | number,
        // roomName: string,
        backgroundId: string | number | null,
        border: TBorder | null,
        devices: (TDevice | null)[],
        // counts: number,
        direction: TDirections
    ) => void
    // #endregion


    // #region Dictionary
    dictionary: TDictionary
    // #endregion


    countOfSets: number
    setCountOfSets: (direction: 1 | -1) => void
    resetCountOfSets: () => void


    // #region Modal Select
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
    // #endregion


    // #region Modal Warning
    modalWarningVisible: boolean
    modalWarningCaption: string
    modalWarningEnabled: boolean
    modalWarningSet: (visible: boolean, caption: string, enabled?: boolean) => void
    // #endregion


    // #region Modal Message
    modalMessageVisible: boolean
    modalMessageCaption: string
    modalMessageSet: (visible: boolean, caption: string) => void
    // #endregion


    // #region Modal Add Configuration
    modalAddConfigurationVisible: boolean
    modalAddConfigurationSet: (visible: boolean) => void
    // #endregion


    // #region Modal Save Configuration
    modalSaveConfigurationVisible: boolean
    modalSaveConfigurationSet: (visible: boolean) => void
    // #endregion


    // #region Modal Share
    modalShareVisible: boolean
    modalShareValue: string | null
    modalShareSet: (visible: boolean, value: string | null) => void
    // #endregion


    // #region Modal Load Project
    modalLoadProjectVisible: boolean
    modalLoadProjectValue: string
    modalLoadProjectSetValue: (value: string) => void
    modalLoadProjectSet: (visible: boolean, value: string) => void
    // #endregion


    // #region Modal Copy Configuration
    modalCopyConfigurationType: 'copy' | 'replace' | null
    modalCopyConfigurationVisible: boolean
    modalCopyConfigurationCaption: string
    modalCopyConfigurationSet: (type: 'copy' | 'replace' | null, visible: boolean, caption: string) => void
    // #endregion

    // #region Modal Reset Sketch
    modalResetSketchVisible: boolean
    modalResetSketchCaption: string
    modalResetSketchButtonApproveText: string
    modalResetSketchButtonRejectText: string
    modalResetSketchInitializer?: TResetSketchInitializerVariants,
    setModalResetSketch: (
        visible: boolean,
        from: TResetSketchInitializerVariants,
        caption?: string,
        approveText?: string,
        rejectText?: string
    ) => void
    // #endregion
}
type TResetSketchInitializerVariants = 'removeBorder' | 'resetFilters' | null
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
    InitDataContract,
    TConfiguration,
    TConfigurationList,
    TRoomItem,
    TRooms,
    TDirections,
    TResetSketchInitializerVariants
}