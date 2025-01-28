import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
// import { devtools, createJSONStorage } from 'zustand/middleware'
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
        persist(
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

                        const res = await fetch(apiLink, { method: 'POST', body: body })
                        // const res = await fetch(apiLink, { method: 'GET' })

                        if (!res.ok) {
                            get().modalMessageSet(true, 'Ошибка запроса!')
                            throw new Error(`Ошибка fetch запроса Получить инит данные! Запрос к URL ${apiLink}`)
                        }





    // const data = await res.json()

    // const borderSetBrand = new Set()
    // const borderSetCollection = new Set()
    // data.borders.forEach(b => {
    //     // if (!b.conf_color) borderSet.add(b.id)
    //     borderSetBrand.add(b.vendor)
    //     borderSetCollection.add(b.collection)

    //     // if (b.conf_orientation === 'horizontal') {
    //     //     console.log(b.id);
    //     // }
    // })
    // console.log('\x1b[34m%s\x1b[0m', 'Рамки')
    // console.log('Бренды', Array.from(borderSetBrand).join(', '))
    // console.log('Коллекции', Array.from(borderSetCollection).join(', '))

    // const devicesSetBrand = new Set()
    // const devicesSetCollection = new Set()
    // data.devices.forEach(d => {
    //     devicesSetBrand.add(d.vendor)
    //     devicesSetCollection.add(d.collection)
    //     // if (d.conf_product_group) devicesSet.add(d.conf_product_group)
    // })
    // console.log('\x1b[34m%s\x1b[0m', 'Устройства')
    // console.log('Бренды', Array.from(devicesSetBrand).join(', '))
    // console.log('Коллекции', Array.from(devicesSetCollection).join(', '))




                        const safeResponse = InitDataContract.passthrough().safeParse(await res.json())

                        if (!safeResponse.success) {
                            const errorMessage = generateErrorMessage(safeResponse.error.issues, zodErrorOptions)
                            console.log(errorMessage)

                            set({ error: "Нарушен Zod контракт для Инит данных", loading: false })
                            return
                        }

                        const functions = [...safeResponse.data.functions]

                        // Получаем данные для фильтра функциональностей в Девайсах
                        const filterFunctions = [
                            {
                                active: true,
                                name: 'Все функции',
                                props: {},
                                default: true
                            },
                            ...functions.map(fn => ({
                                active: false,
                                name: fn.name,
                                props: {}
                            }))
                        ]

                        set({
                            error: null,
                            loading: false,
                            userId: safeResponse.data.user_id,

                            // Pushing data to appropriate stores
                            backgrounds: safeResponse.data.backgrounds,
                            colors: safeResponse.data.colors,
                            borders: safeResponse.data.borders,
                            devices: safeResponse.data.devices,
                            vendors: safeResponse.data.vendors,
                            projects: safeResponse.data.projects,
                            rooms: safeResponse.data.rooms,
                            dictionary: safeResponse.data.lang,

                            functions: functions,
                            filtersDevices: {
                                ...get().filtersDevices,
                                functions: filterFunctions
                            }
                        })

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
        )
    )
)

export default useStore