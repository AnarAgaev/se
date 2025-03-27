import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { appSlice, bordersSlice, devicesSlice, backgroundSlice, sketchSlice } from './'
import { TAppStore, TDevicesStore, TBordersStore, TBackgroundsStore, TSketchStore, TStore, TBorder, TDevice, TColorPalette, TProjectList, TRooms, TNumberOfPosts } from '../types'
import { InitDataContract, zodErrorOptions } from '../zod'
import { generateErrorMessage } from 'zod-error'
import { defaultFetchHeaders, copyLocalProjectToAccount, getParameterByNameFromUrlLink } from '../Helpers'

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

                        set({ loading: true, loadingMassage: 'Загружаем конфигуратор' })

                        const headers: HeadersInit = defaultFetchHeaders
                        if (token) headers['Token'] = token

                        const body = { domain: 'fandeco' }

                        const res = await fetch(apiLink, {
                            method: 'POST',
                            headers,
                            body: JSON.stringify(body)
                        })

                        if (!res.ok) {
                            get().modalMessageSet(true, 'Ошибка запроса загрузки данных конфигуратора!')
                            throw new Error(`Ошибка fetch запроса Получить инит данные! Запрос к URL ${apiLink}`)
                        }

                        const data = await res.json()

    // console.log('Init data', data)


    // const bordersSet = new Set()
    // // const borderSetBrand = new Set()
    // // const borderSetCollection = new Set()
    // data.borders.forEach(b => {

    //     if (b.collection === "GLOSSA") bordersSet.add(b.number_of_posts[0])

    //     // borderSetBrand.add(b.vendor)
    //     // borderSetCollection.add(b.collection)
    // })
    // console.log('\x1b[34m%s\x1b[0m', 'Рамки')
    // // console.log('Бренды', Array.from(borderSetBrand).join(', '))
    // // console.log('Коллекции', Array.from(borderSetCollection).join(', '))
    // console.log('Посты Glossa', Array.from(bordersSet).join(', '))


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
                        const backgrounds = get().backgrounds
                        const colors = get().colors
                        const vendors = get().vendors
                        const rooms = get().rooms

                        // Копируем локальные проекты в аккаунт
                        let projectsHydrated: TProjectList = []
                        let projectsCopied: TProjectList = []

                        const projectsCurrentInStore = get().projects
                        const projectsLocal = projectsCurrentInStore.filter(p => p.localProject) // локальные проекта
                        let projectsShared = get().projects.filter(p => p.shared) // проекты загруженные по ссылке
                        projectsShared = projectsShared.filter(p => {
                            if (!token) return p

                            // исключаем саморасшаренные проекты. Когда пользователь будучи залогиненным в одном проекта,
                            // загрузил себе Шаре проект из своего другого аккаунта, а потом перелогинился во второй.
                            return p.token !== token
                        })

                        if (projectsLocal.length && token) {
                            // Устанавливаем сообщение о загрузке
                            set({ loadingMassage: 'Копируем проекты в аккаунт' });

                            try {
                                projectsCopied = await copyLocalProjectToAccount(
                                    projectsLocal,
                                    token,
                                    get().modalMessageSet
                                )

                            } catch (error) {
                                console.error('Ошибка:', error);
                            }
                        }

                        if (projectsLocal.length && !token) {
                            projectsCopied = [...projectsLocal]
                        }

                        projectsHydrated = [
                            ...safeResponse.data.projects.filter(p => p.token && token && (p.token === token)), // проекты из аккаунта Проверяем token на случай если пользователь перелогинился из одного существующего аккаунта в другой
                            ...projectsCopied, // скопированные в аккаунт локальные проекты
                            ...projectsShared // чужие проекты (добавили по ссылке поделиться, но не скопировали себе в аккаунт)
                        ]

                        // console.log('projectsHydrated', projectsHydrated)

                        // по всем проектам сбрасываем выбранный, чтобы очистить Состав проекта при смене пользователя

                        projectsHydrated = projectsHydrated.map(p => {
                            const temp = p
                            temp.selected = false
                            temp.edit = false
                            return temp
                        })

                        set({
                            error: null,
                            loading: false,
                            loadingMassage: null,

                            // Pushing data to appropriate stores
                            backgrounds: backgrounds.length ? backgrounds : safeResponse.data.backgrounds,
                            colors: colors ? colors : safeResponse.data.colors,
                            vendors: vendors.length ? vendors : safeResponse.data.vendors,
                            projects: projectsHydrated,
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


                        // #region Set default item from URL GET param
                        const urlArticle = getParameterByNameFromUrlLink('article')
                        if (urlArticle) {

                            const border = safeResponse.data.borders.find(border =>
                                border.article.toLocaleUpperCase() === urlArticle.toLocaleUpperCase())

                            const device = safeResponse.data.devices.find(device =>
                                device.article.toLocaleUpperCase() === urlArticle.toLocaleUpperCase())

                            let brand: string | undefined
                            let collection: string | undefined

                            if (border) {
                                console.log('Border preset', border)

                                const countOfPosts = get().getCountOfPosts(border)
                                const numberOfPosts = border.number_of_posts ? parseInt(border.number_of_posts[0]) : 1
                                const orientation = border.conf_orientation === 'vertical'
                                    ? 'vertical'
                                    : 'horizontal'

                                if ([1, 2, 3, 4, 5].includes(numberOfPosts)) {
                                    get().resetSketch()
                                    get().setBorder(border, numberOfPosts as TNumberOfPosts, countOfPosts, orientation)
                                }

                                if (!brand) brand = border.vendor
                                if (!collection) collection = border.collection
                            }

                            if (device) {
                                console.log('Device preset', device)

                                get().resetSketch()
                                get().setDevice(device as TDevice)

                                if (!brand) brand = device.vendor
                                if (!collection) collection = device.collection
                            }

                            if ((border || device) && brand && collection) {
                                get().setSingleBordersFilter('brand', brand)
                                get().setSingleBordersFilter('collection', collection)

                                get().setSingleDevicesFilter('brand', brand)
                                get().setSingleDevicesFilter('collection', collection)
                            }

                            if (!border && !device && urlArticle) {
                                console.log('\x1b[31m%s\x1b[0m', 'В данных конфигуратора не артикула из GET параметра', urlArticle)
                            }
                        }
                        // #endregion


                        // #region Learning
                        const isLearningShown = get().isLearningShown

                        if (!isLearningShown) {

                            // Выставляем дефолтные рамку и устройство для обучения
                            setTimeout(() => get().setLearningConfiguration(), 1000)

                            // Запускаем обучение
                            setTimeout(() => set({
                                showLearning: true,
                                isLearningShown: true
                            }), 3000)
                        }

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
                },

                useBorderForLearning: false,
                useDeviceForLearning: false,
                useProjectForLearning: false,

                setLearningConfiguration: () => {

                    const border = get().borders[0]
                    if (!get().border && border) {
                        set({
                            border: border,
                            useBorderForLearning: true
                        })
                    }

                    const device = get().devices[0]
                    if (!get().deviceList[1] && device) {
                        set({
                            deviceList: {
                                '1': device as TDevice
                            },
                            useDeviceForLearning: true
                        })
                    }

                    const rooms: TRooms = [
                        {
                            id: 'room-id',
                            name: 'Гостиная',
                            configurations: [
                                {
                                    id: 'configuration-id',
                                    count: 1,
                                    direction: 'universal',
                                    background: get().backgrounds[0].id,
                                    border: { ...border },
                                    devices: [{ ...device }]
                                }
                            ]
                        }
                    ]

                    if (!get().projects.length) {
                        set({
                            projects: [
                                {
                                    id: 'demo-project',
                                    name: 'Демонстрационный проект',
                                    selected: true,
                                    edit: true,
                                    localProject: true,
                                    rooms: [...rooms]
                                }
                            ],
                            useProjectForLearning: true
                        })
                    } else {
                        if (!get().projects[0].rooms) {
                            const newProjects = [...get().projects]
                            newProjects[0].rooms = [...rooms]
                            newProjects[0].edit = true

                            set({
                                projects: [...newProjects],
                                useProjectForLearning: true
                            })
                        } else {
                            const newProjects = [...get().projects]
                            newProjects[0].edit = true
                            set({ projects: [...newProjects] })
                        }
                    }
                },

                resetLearningConfiguration: () => {
                    get().setActiveViewportTab('configurator')
                    get().setActiveCalcTab('borders')

                    if (get().useBorderForLearning) {
                        set({
                            border: null,
                            useBorderForLearning: false
                        })
                    }

                    if (get().useDeviceForLearning) {
                        set({
                            deviceList: {
                                '1': null
                            },
                            useDeviceForLearning: false
                        })
                    }

                    if (get().useProjectForLearning) {
                        if (get().projects[0].id === 'demo-project') {
                            set({
                                projects: [],
                                useProjectForLearning: false
                            })

                            return
                        }

                        const newProjects = [...get().projects]
                        delete newProjects[0].rooms
                        newProjects[0].edit = false
                        set({
                            projects: [...newProjects],
                            useProjectForLearning: false
                        })
                    }
                },

            }),
            {
                name: 'configurator-storage',
                storage: createJSONStorage(() => localStorage),
            }
        )
    )
)

export default useStore