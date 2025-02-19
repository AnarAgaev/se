import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { appSlice, bordersSlice, devicesSlice, backgroundSlice, sketchSlice } from './'
import { TAppStore, TDevicesStore, TBordersStore, TBackgroundsStore, TSketchStore, TStore, TBorder, TDevice, TColorPalette } from '../types'
import { InitDataContract, zodErrorOptions } from '../zod'
import { generateErrorMessage } from 'zod-error'
import { defaultFetchHeaders } from '../Helpers'

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
                        const token = window.userToken

                        if (!apiLink) {
                            get().modalMessageSet(true, 'Ошибка запроса!')
                            throw new Error(`На странице не указана ссылка на API Getting Init Data window.initSourceDataLink`)
                        }

                        set({ loading: true })

                        const headers: HeadersInit = defaultFetchHeaders
                        if (token) headers['Token'] = token

                        const body = { domain: 'fandeco' }

                        const res = await fetch(apiLink, {
                            method: 'POST',
                            headers,
                            body: JSON.stringify(body)
                        })

                        if (!res.ok) {
                            get().modalMessageSet(true, 'Ошибка запроса!')
                            throw new Error(`Ошибка fetch запроса Получить инит данные! Запрос к URL ${apiLink}`)
                        }

                        const data = await res.json()
                        console.log(data)
                        // return

    // const bordersSet = new Set()
    // // const borderSetBrand = new Set()
    // // const borderSetCollection = new Set()
    // data.borders.forEach(b => {

    //     b.number_of_posts.forEach(n => bordersSet.add(typeof n))

    // //     // if (!b.conf_color) borderSet.add(b.id)
    // //     borderSetBrand.add(b.vendor)
    // //     borderSetCollection.add(b.collection)

    // //     // if (b.conf_orientation === 'horizontal') {
    // //     //     console.log(b.id);
    // //     // }
    // })
    // // console.log('\x1b[34m%s\x1b[0m', 'Рамки')
    // // console.log('Бренды', Array.from(borderSetBrand).join(', '))
    // // console.log('Коллекции', Array.from(borderSetCollection).join(', '))
    // console.log(Array.from(bordersSet))



    // const devicesSet = new Set()
    // data.devices.forEach(d => {
    //     if (!d.ip_class) devicesSet.add(d.article)
    // })
    // console.log('\x1b[34m%s\x1b[0m', 'Устройства')
    // console.log(Array.from(devicesSet).join(', '))



                        const safeResponse = InitDataContract.passthrough().safeParse(data)

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

                        // Проверяем данные перед добавлением в Store, чтобы регидратация прошла корректно
                        // Для корректной регидратации, здесь можно написать проекты
                        const backgrounds = get().backgrounds
                        const colors = get().colors
                        const vendors = get().vendors
                        const projects = get().projects
                        const rooms = get().rooms

                        set({
                            error: null,
                            loading: false,
                            userId: safeResponse.data.user_id,

                            // Pushing data to appropriate stores
                            backgrounds: backgrounds.length ? backgrounds : safeResponse.data.backgrounds,
                            colors: colors ? colors : safeResponse.data.colors,
                            vendors: vendors.length ? vendors : safeResponse.data.vendors,
                            projects: projects.length ? projects : safeResponse.data.projects,
                            rooms: rooms.length ? rooms : safeResponse.data.rooms,

                            // Словарь всегда обновляем, так как он не должен уменьшаться.
                            // Возможно появление новых слов, но не удаление старых.
                            dictionary: safeResponse.data.lang,

                            // Рамки и устройства всегда обновляем
                            borders: safeResponse.data.borders,
                            devices: safeResponse.data.devices,

                            // Функциональности также всегда перезаписываем, так они строятся
                            // на текущих devices, а devices всегда перезаписываются
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
                                // if (!isBorder(i)) return false

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

                                if (!i) return false

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

                            return items.filter(i => {

                                const prop = i[property] as string | number | string[] | undefined

                                if (prop === undefined) return false

                                if (typeof prop === 'string' || typeof prop === 'number') {
                                    return prop.toString().toLocaleLowerCase() === value.toString().toLocaleLowerCase()
                                }

                                return prop.includes(value.toString())
                            })
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
                name: 'configurator-storage',
                storage: createJSONStorage(() => sessionStorage),
            }
        )
    )
)

export default useStore