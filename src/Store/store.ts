import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { InitDataContractType } from '../zod'
import { generateErrorMessage, ErrorMessageOptions } from 'zod-error'
import { appSlice, bordersSlice, devicesSlice, backgroundSlice } from './'
import { TAppStore, TDevicesStore, TBordersStore, TBackgroundsStore, TStore } from '../types'

const zodErrorOptions: ErrorMessageOptions = {
    delimiter: {
        error: '\n',
    },
    path: {
        enabled: true,
        type: 'zodPathArray',
        label: 'Zod Path: ',
    },
    code: {
        enabled: true,
    },
    message: {
        enabled: true,
        label: '',
    },
    transform: ({ errorMessage, index }) => `🔥 \x1b[31m Zod Error #${index + 1}: \x1b[33m ${errorMessage}`,
}

const useStore = create<TDevicesStore & TBordersStore & TBackgroundsStore & TAppStore & TStore>()(
    devtools(
        (set, get, ...args) => ({
            ...appSlice(set, get, ...args),
            ...backgroundSlice(set, get, ...args),
            ...bordersSlice(set, get, ...args),
            ...devicesSlice(set, get, ...args),

            requestInitData: async () => {

                // This variable should be initialized on the page with the widget
                const initSourceDataLink = window.initSourceDataLink

                set({ loading: true })

                try {
                    if (!initSourceDataLink) console.error(
                        'There is no link window.initSourceDataLink on the page to request data.')

                    const body = new FormData()
                    body.append('domain', 'fandeco')

                    const res = await fetch(initSourceDataLink, {
                        method: 'POST',
                        body: body
                    })

                    if (!res.ok) console.error(
                        'Failed to fetch json initial data! URL link is', initSourceDataLink)

                    const safeResponse = InitDataContractType
                        .passthrough().safeParse(await res.json())

                    if (!safeResponse.success) {
                        const errorMessage = generateErrorMessage(safeResponse.error.issues, zodErrorOptions)
                        console.log(errorMessage)

                        set({ error: "Zod contract is invalid!", loading: false })

                        return
                    }

                    // Pushing data to appropriate stores
                    get().setInitBackgroundsData(safeResponse.data.backgrounds)
                    get().setAppColors(safeResponse.data.colors)
                    get().setInitBordersData(safeResponse.data.borders)
                    get().setInitDevicesData(safeResponse.data.devices)
                    get().setAppVendors(safeResponse.data.vendors)
                    get().setAppProjects(safeResponse.data.projects)
                    get().setAppRooms(safeResponse.data.rooms)
                    get().setFunctions(safeResponse.data.functions)

                    set({ error: null, loading: false })
                } catch (error: Error | unknown) {
                    set({ error: error, loading: false })
                }
            }
        })
    )
)

export default useStore