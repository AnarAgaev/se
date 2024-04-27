import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { InitDataContractType } from './zod-data-contracts'
import createAppSlice from './createAppSlice'
import createBackgroundSlice from './createBackgroundSlice'

const useStore = create<BackgroundsStore & AppStore & BoundStore>()(
    devtools(
        (set, get, ...args) => ({
            ...createAppSlice(set, get, ...args),
            ...createBackgroundSlice(set, get, ...args),

            requestInitData: async () => {

                // This variable should be initialized on the page with the widget
                const initSourceDataLink = window.initSourceDataLink

                set({ loading: true })

                try {
                    if (!initSourceDataLink) console.error(
                        'There is no link window.initSourceDataLink on the page to request data.')

                    const res = await fetch(initSourceDataLink)

                    if (!res.ok) console.error(
                        'Failed to fetch json initial data! URL link is', initSourceDataLink)

                    const data = InitDataContractType.parse(await res.json())

                    // Push data to appropriate stores
                    get().setInitBackgroundsData(data.backgrounds)

                    set({ error: null })
                } catch (error: Error | unknown) {
                    set({error: error})
                } finally {
                    set({ loading: false })
                }
            }
        })
    )
)

export default useStore