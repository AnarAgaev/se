interface Window {
    initSourceDataLink: string
    uploadBackgroundLink: string
}

interface BoundStore {
    requestInitData: () => void
}

interface BackgroundsStore {
    backgrounds: z.infer<typeof BackgroundsType>
    setInitBackgroundsData: (data: z.infer<typeof BackgroundsType>) => void
}

type CalcTabs = 'borders' | 'mechanics' | 'backgrounds'
type ScreenTabs = 'configurator' | 'collections' | 'project' | 'hub'

interface AppStore {
    loading: boolean
    error: Error | unknown

    activeCalcTab: CalcTabs
    setActiveCalcTab: (tab: CalcTabs) => void

    activeScreenTab: ScreenTabs
    setActiveScreenTab: (tab: ScreenTabs) => void
}