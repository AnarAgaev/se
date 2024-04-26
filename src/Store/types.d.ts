interface Window {
    initSourceDataLink: string
}

interface BoundStore {
    requestInitData: () => void
}

interface BackgroundsStore {
    backgrounds: z.infer<typeof BackgroundsType>
    setInitBackgroundsData: (data: z.infer<typeof BackgroundsType>) => void
}

interface AppStore {
    loading: boolean
    error: Error | unknown
}