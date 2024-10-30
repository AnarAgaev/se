import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { generateErrorMessage, ErrorMessageOptions } from 'zod-error'
import { appSlice, bordersSlice, devicesSlice, backgroundSlice } from './'
import { TAppStore, TDevicesStore, TBordersStore, TBackgroundsStore, TStore, TBorder, TDevice } from '../types'
import { InitDataContract } from '../zod'

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

                    const safeResponse = InitDataContract.passthrough().safeParse(await res.json())

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
                    get().setDictionary(safeResponse.data.lang)

                    set({ error: null, loading: false })
                } catch (error: Error | unknown) {
                    set({ error: error, loading: false })
                }
            },

            getFilteredItems: () => {
                const activeTab = get().activeCalcTab

                if (activeTab === 'backgrounds') return []

                const {
                    brand,
                    collection,
                    colors,
                    materials
                } = activeTab === 'borders'
                    ? get().filtersBorders
                    : get().filtersDevices

                let items = activeTab === 'borders'
                    ? get().borders
                    : get().devices

                // Type guards
                function isDevice(item: TBorder | TDevice): item is TDevice {
                    return (item as TBorder).number_of_posts === undefined
                }

                // One border count Only for borders
                if (activeTab === 'borders') {
                    items = items.filter(
                        i => {
                            if (isDevice(i)) return false

                            const value = Array.isArray(i.number_of_posts)
                                ? parseInt(i.number_of_posts[0])
                                : NaN

                            return value === 1
                        }
                    )
                }

                // Brand
                if (brand && brand !== '') {
                    items = items.filter(i =>
                        i.vendor.toLocaleLowerCase() === brand.toLocaleLowerCase())

                    // console.log('Brand', items);
                }

                // Collection
                if (collection && collection !== '') {
                    items = items.filter(i =>
                        i.collection.toLocaleLowerCase() === collection.toLocaleLowerCase())

                    // console.log('Collection', items);
                }

                // Colors
                if (colors.length) {
                    items = items.filter(i => {
                        const idx = colors.findIndex(
                            c => c.toLocaleLowerCase() === i.color.toLocaleLowerCase()
                        )
                        return idx !== -1
                    })

                    // console.log('Colors', items);
                }

                // Materials
                if (materials.length) {
                    items = items.filter(i => {
                        const idx = materials.findIndex(
                            m => m.toLocaleLowerCase() === i.armature_material?.join('-').toLocaleLowerCase()
                        )
                        return idx !== -1
                    })

                    // console.log('Materials', items);
                }

                // Functionality
                if (activeTab === 'devices') {
                    const filter = get().filtersDevices
                        .functions.filter(fn => fn.active)[0].props

                    if (!Object.keys(filter).length) return items

                    console.log(filter);
                    


                    items = items.filter(
                        i => {

                            console.log(i);
                            



                            return true
                        }
                    )
                }



                return items
            }
        })
    )
)

export default useStore