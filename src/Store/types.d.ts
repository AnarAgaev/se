interface Window {
    initSourceDataLink: string
    uploadBackgroundLink: string
}

interface BoundStore {
    requestInitData: () => void
}

interface BackgroundsStore {
    backgrounds: z.infer<typeof BackgroundsTypeList>
    setInitBackgroundsData: (data: z.infer<typeof BackgroundsTypeList>) => void
    addUploadedBackground: (background: z.infer<typeof BackgroundsType>) => void
}

type CalcTabs = 'borders' | 'mechanics' | 'backgrounds'
type ViewportTabs = 'configurator' | 'collections' | 'project' | 'hub'

interface AppStore {
    loading: boolean
    error: Error | unknown

    activeCalcTab: CalcTabs
    setActiveCalcTab: (tab: CalcTabs) => void

    activeViewportTab: ViewportTabs
    setActiveViewportTab: (tab: ViewportTabs) => void
}