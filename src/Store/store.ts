import { create } from 'zustand'
// import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { devtools, createJSONStorage } from 'zustand/middleware'
import { generateErrorMessage, ErrorMessageOptions } from 'zod-error'
import { appSlice, bordersSlice, devicesSlice, backgroundSlice, sketchSlice } from './'
import { TAppStore, TDevicesStore, TBordersStore, TBackgroundsStore, TSketchStore, TStore, TBorder, TDevice, TColorPalette } from '../types'
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

const useStore = create<TDevicesStore & TBordersStore & TBackgroundsStore & TSketchStore & TAppStore & TStore>()(
    devtools(
        // persist(
            (set, get, ...args) => ({
                ...appSlice(set, get, ...args),
                ...backgroundSlice(set, get, ...args),
                ...bordersSlice(set, get, ...args),
                ...devicesSlice(set, get, ...args),
                ...sketchSlice(set, get, ...args),

                requestInitData: async () => {

                    try {

                        const apiLink = window.initSourceDataLink

                        if (!apiLink) {
                            get().modalMessageSet(true, 'Ошибка запроса!')
                            throw new Error(`На странице не указана ссылка на API Getting Init Data window.initSourceDataLink`)
                        }

                        set({ loading: true })

                        const body = new FormData()
                        body.append('domain', 'fandeco')

                        // const res = await fetch(apiLink, { method: 'POST', body: body })
                        const res = await fetch(apiLink, { method: 'GET' })

                        if (!res.ok) {
                            get().modalMessageSet(true, 'Ошибка запроса!')
                            throw new Error(`Ошибка fetch запроса Получить инит данные! Запрос к URL ${apiLink}`)
                        }






    // const data = await res.json()

    // const borderSet = new Set()
    // data.borders.forEach(b => {
    //     // if (!b.conf_color) borderSet.add(b.id)
    //     borderSet.add(b.vendor)
    // })
    // console.log('Рамки')
    // console.log(Array.from(borderSet).join(', '))

    // const devicesSet = new Set()
    // data.devices.forEach(d => {
    //     if (d.conf_product_group) devicesSet.add(d.conf_product_group)
    // })
    // console.log('Устройства')
    // console.log(Array.from(devicesSet).join(', '))






                        const safeResponse = InitDataContract.passthrough().safeParse(await res.json())

                        if (!safeResponse.success) {
                            const errorMessage = generateErrorMessage(safeResponse.error.issues, zodErrorOptions)
                            console.log(errorMessage)

                            set({ error: "Нарушен Zod контракт для Инит данных", loading: false })
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

                        set({ error: null, loading: false, visible: false, userId: safeResponse.data.user_id })

                        setTimeout(() => set({visible: true}), 1000)

                    } catch (error: Error | unknown) {
                        console.error(error)
                        set({ loading: false })
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

                    // #region Type guards for Devices and Borders
                    function isBorder(item: TBorder | TDevice): item is TBorder {
                        return (item as TBorder).number_of_posts !== undefined
                    }

                    function isDevice(item: TBorder | TDevice): item is TDevice {
                        return (item as TDevice).conf_product_group !== undefined
                    }

                    function isDeviceArray(arr: TBorder[] | TDevice[]): arr is TDevice[] {
                        return arr.every(item => isDevice(item))
                    }
                    // #endregion

                    // #region One border count (Only for borders)
                    if (activeTab === 'borders') {
                        items = items.filter(
                            i => {
                                if (!isBorder(i)) return false

                                const value = Array.isArray(i.number_of_posts)
                                    ? parseInt(i.number_of_posts[0])
                                    : NaN

                                return value === 1
                            }
                        )
                    }
                    // #endregion

                    // #region  Brand
                    if (brand && brand !== '') {
                        items = items.filter(i =>
                            i.vendor.toLocaleLowerCase() === brand.toLocaleLowerCase())
                    }
                    // #endregion

                    // #region  Collection
                    if (collection && collection !== '') {
                        items = items.filter(i =>
                            i.collection.toLocaleLowerCase() === collection.toLocaleLowerCase())
                    }
                    // #endregion

                    // #region  Colors
                    if (colors.length) {
                        items = items.filter(i => {
                            const idx = colors.findIndex(
                                c => c.toLocaleLowerCase() === i.conf_color.toLocaleLowerCase()
                            )
                            return idx !== -1
                        })

                        // console.log('Colors', items);
                    }
                    // #endregion

                    // #region  Materials
                    if (materials.length) {
                        items = items.filter(i => {
                            const idx = materials.findIndex(
                                m => m.toLocaleLowerCase() === i.armature_material?.join('-').toLocaleLowerCase()
                            )
                            return idx !== -1
                        })

                        // console.log('Materials', items);
                    }
                    // #endregion

                    // #region  Functionality (Only for devices)
                    if (activeTab === 'devices') {
                        const filter = get().filtersDevices
                            .functions.filter(fn => fn.active)[0]

                        if (filter.default) return items

                        // Type
                        items = items.filter(
                            i => {

                                if (isDevice(i)) {
                                    return i['conf_product_group']?.toLocaleLowerCase() === filter.name.toLocaleLowerCase()
                                }

                                return false
                            }
                        )

                        // Property
                        const selectedProps = Object.keys(filter.props)

                        if (!selectedProps.length) return items

                        type FilterFunc<T> = (items: T[], property: string, value: string | number) => T[]

                        const filteringItemsByFunctionalityProp: FilterFunc<TDevice> = (items, property, value) => {
                            return items.filter(i => i[property] === value)
                        }

                        for (const prop in filter.props) {
                            const val = filter.props[prop]

                            if (isDeviceArray(items)) {
                                items = filteringItemsByFunctionalityProp(items, prop, val)
                            }
                        }
                    }
                    // #endregion

                    return items
                },

                getColorPallette: (type) => {

                    const pallette: TColorPalette = {}

                    const items = type === 'borders'
                        ? [...get().borders]
                        : [...get().devices]

                    for (const i of items) {
                        pallette[`${i.conf_color}`] = i.image
                    }

                    return pallette
                }
            }),
            {
                name: 'food-storage',
                storage: createJSONStorage(() => sessionStorage),
            }
        // )
    )
)

export default useStore