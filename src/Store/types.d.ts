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
}


type CalcTabs = 'borders' | 'mechanics' | 'backgrounds'
type ViewportTabs = 'configurator' | 'collections' | 'project' | 'hub'