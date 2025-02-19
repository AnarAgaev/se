import { StateCreator } from 'zustand'
import { collapseDevices, defaultFetchHeaders } from '../Helpers'
import { TAppStore, TConfiguration, TBorder, TDevice } from '../types'
import { Project, zodErrorOptions } from '../zod'
import { generateErrorMessage } from 'zod-error'

const appSlice: StateCreator<TAppStore> = (set, get) => ({
    logWarningShown: false,
    setLogWarningShown: () => set({ logWarningShown: true }),

    loading: true,
    dataLoading: false,


    error: null,
    fireError: (error) => {
        set({ error: error })
    },


    setCountTimeoutId: undefined,
    startValueConfigurationCount: null,


    downloadProjectAsPdf: null,
    downloadProjectFilename: null,
    downloadProjectBlobUrl: null,
    setDownloadProjectBlobUrl: (blobUrl) => set({
        downloadProjectBlobUrl: blobUrl
    }),
    setDownloadProject: (payload) => {

        const blobUrl = get().downloadProjectBlobUrl

        if (blobUrl) {
            URL.revokeObjectURL(blobUrl)
        }

        set({
            downloadProjectAsPdf: payload.project,
            downloadProjectFilename: payload.filename,
            downloadProjectBlobUrl: null
        })
    },
    resetDownloadProject: () => set({
        downloadProjectAsPdf: null
    }),


    // #region Colors
    colors: undefined,
    // #endregion


    // #region Vendors
    vendors: [],
    getVendorByName: (vendorName) => {
        const vendors = get().vendors || []

        const vendor = vendors.find(vendor =>
            vendor.name.toLowerCase() === vendorName.toLowerCase())

        return vendor
    },
    getBrandByCollection: (collectionName) => {
        const vendors = [...get().vendors]

        const vendor = vendors.filter(v => {
            let isMatch

            for (const c of v.collections) {
                if (c.name === collectionName) {
                    isMatch = true
                    break
                }
            }

            return isMatch
        })

        if (vendor.length === 0) {
            throw new Error(`Отсутствует бренд для коллекции ${collectionName}!`)
        }

        return vendor[0].name
    },
    // #endregion


    // #region Tabs and Pages
    activeCalcTab: 'borders',
    setActiveCalcTab: (tab) => set({activeCalcTab: tab}),

    activeViewportTab: 'configurator',
    setActiveViewportTab: (tab) => set({activeViewportTab: tab}),
    // #endregion


    // #region Projects
    projects: [],
    addProject: async (project) => {

        const apiLink = window.addProjectLink
        const token = window.userToken

        if (!apiLink) {
            get().modalMessageSet(true, 'Ошибка запроса!')
            throw new Error(`На странице не указана ссылка на API Add Project window.addProjectLink`)
        }

        set({ dataLoading: true })

        const headers: HeadersInit = defaultFetchHeaders
        if (token) headers['Token'] = token

        const body = {
            domain: 'fandeco',
            name: project
        }

        try {
            const res = await fetch(apiLink, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            })

            if (!res.ok) {
                const errData = await res.json();
                const errObj = JSON.parse(errData.errors.error[0])
                console.log('\x1b[31m%s\x1b[0m', 'Error Object:')
                console.error(errObj)

                get().modalMessageSet(true, 'Ошибка запроса!')
                throw new Error(`Ошибка запроса Добавить проект! Запрос к URL ${apiLink}`)
            }

            const data = await res.json()

            // Adding project
            const newProjects = [...get().projects]

            let addedProjectId = data.id
            addedProjectId = typeof addedProjectId === 'string'
                ? addedProjectId
                : addedProjectId.toString()

            newProjects.unshift({
                id: addedProjectId,
                name: project,
                selected: false,
                edit: false
            })

            setTimeout(() => set({
                dataLoading: false,
                modalMessageVisible: true,
                modalMessageCaption: `Проект #${addedProjectId} ${project} добавлен`,
                projects: newProjects
            }), 500)

        } catch (error) {
            console.error(error)
        }
    },
    setProject: (id) => {
        const newProjects = [...get().projects]

        newProjects.forEach(p => p.selected = p.id === id)

        set({ projects: newProjects })
    },
    checkProject: () => {
        for (const p of get().projects) {
            if (p.selected) return true
        }

        return false
    },
    resetProject: () => {
        const newProjects = [...get().projects]

        newProjects.forEach(p => p.selected = false)

        set({ projects: newProjects })
    },
    editProject: (id) => {
        const newProjects = [...get().projects]

        newProjects.forEach(p => p.edit = p.id === id)

        set({
            projects: newProjects,
            activeViewportTab: 'project'
        })
    },
    shareProject: async (id) => {
        const apiLink = window.shareProjectLink
        const token = window.userToken

        if (!apiLink) {
            get().modalMessageSet(true, 'Ошибка запроса!')
            throw new Error(`На странице не указана ссылка на API Share Project window.shareProjectLink`)
        }

        set({ dataLoading: true })

        const headers: HeadersInit = defaultFetchHeaders
        if (token) headers['Token'] = token

        const body = {
            domain: 'fandeco',
            project_id: id.toString()
        }

        try {
            const res = await fetch(apiLink, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            })

            if (!res.ok) {

                const errData = await res.json();
                const errObj = JSON.parse(errData.errors.error[0])
                console.log('\x1b[31m%s\x1b[0m', 'Error Object:')
                console.error(errObj)

                get().modalMessageSet(true, 'Ошибка запроса!')
                throw new Error(`Ошибка запроса Поделиться проектом! Запрос к URL ${apiLink}`)
            }

            const data = await res.json()

            setTimeout(() => set({
                dataLoading: false,
                modalShareVisible: true,
                modalShareValue: data.link,
            }), 500)

        } catch (error) {
            console.error(error)
        }
    },
    loadProject: async (link) => {

        const apiLink = window.loadProjectLink
        const token = window.userToken

        if (!apiLink) {
            get().modalMessageSet(true, 'Ошибка запроса!')
            throw new Error(`На странице не указана ссылка на API Load Project window.loadProjectLink`)
        }

        set({ dataLoading: true })

        const headers: HeadersInit = defaultFetchHeaders
        if (token) headers['Token'] = token

        const body = {
            domain: 'fandeco',
            link: link
        }

        try {
            const res = await fetch(apiLink, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            })

            if (!res.ok) {
                const errData = await res.json();
                const errObj = JSON.parse(errData.errors.error[0])
                console.log('\x1b[31m%s\x1b[0m', 'Error Object:')
                console.error(errObj)

                get().modalMessageSet(true, 'Ошибка запроса! Возможно проект был удален.')
                throw new Error(`Ошибка запроса Загрузить проект по ссылке! Запрос к URL ${apiLink}`)
            }

            const data = await res.json()
            // console.log(data);
            // return

            const safeResponse = Project.passthrough().safeParse(data)

            if (!safeResponse.success) {
                const errorMessage = generateErrorMessage(safeResponse.error.issues, zodErrorOptions)

                console.log(errorMessage)

                set({ error: `Нарушен Zod контракт для Загрузки проекта по ссылке! Ссылка на проект: ${link}`, loading: false })
                return
            }

            // Add project to configurator

            const activeTab = get().activeViewportTab
            const currentProjects = get().projects
            const loadedProject = safeResponse.data
            let isProjectInConfiguratorProjects = false

            if (activeTab !== 'hub') {
                loadedProject.edit = true
            }

            // #region Проверяем есть ли проект в конфигураторе
            currentProjects.forEach(p => {
                if (p.id.toString() === loadedProject.id.toString()) {
                    isProjectInConfiguratorProjects = true
                    return
                }
            })

            if (isProjectInConfiguratorProjects) {
                setTimeout(() => set({
                    dataLoading: false,
                    modalMessageVisible: true,
                    modalMessageCaption: `Проект #${loadedProject.id} уже есть в конфигураторе`,
                }), 500)
                return
            }
            // #endregion

            // #region Добавляем проект в Store
            const newProjects = [
                { ...loadedProject },
                ...get().projects
            ]

            setTimeout(() => set({
                dataLoading: false,
                modalMessageVisible: true,
                modalMessageCaption: `Проект #${loadedProject.id} ${loadedProject.name} добавлен`,
                projects: newProjects,
                activeViewportTab: activeTab === 'hub' ? 'hub' : 'project'
            }), 500)
            // #endregion

        } catch (error) {
            console.error(error)
        }
    },
    removeProject: async (id, name) => {
        const apiLink = window.removeProjectLink
        const token = window.userToken

        if (!apiLink) {
            get().modalMessageSet(true, 'Ошибка запроса!')
            throw new Error(`На странице не указана ссылка на API Remove Project window.removeProjectLink`)
        }

        set({ dataLoading: true })

        const headers: HeadersInit = defaultFetchHeaders
        if (token) headers['Token'] = token

        const body = {
            domain: 'fandeco',
            project_id: id.toString()
        }

        try {
            const res = await fetch(apiLink, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            })

            if (!res.ok) {
                const errData = await res.json();
                const errObj = JSON.parse(errData.errors.error[0])
                console.log('\x1b[31m%s\x1b[0m', 'Error Object:')
                console.error(errObj)

                get().modalMessageSet(true, 'Ошибка запроса!')
                throw new Error(`Ошибка запроса Удалить проект! Запрос к URL ${apiLink}`)
            }

            const data = await res.json()

            if (data.success) {

                // Remove project
                const newProjects = [...get().projects].filter(p => p.id !== id)

                setTimeout(() => set({
                    dataLoading: false,
                    modalMessageVisible: true,
                    modalMessageCaption: `Проект #${id} ${name} удален`,
                    projects: newProjects
                }), 500)
            }

        } catch (error) {
            console.error(error)
        }
    },
    // #endregion


    // #region Rooms
    rooms: [],
    addRoom: async (room) => {

        const apiLink = window.addRoomLink
        const token = window.userToken

        if (!apiLink) {
            get().modalMessageSet(true, 'Ошибка запроса!')
            throw new Error(`На странице не указана ссылка на API Add Room window.addRoomLink`)
        }

        set({ dataLoading: true })

        const headers: HeadersInit = defaultFetchHeaders
        if (token) headers['Token'] = token

        const body = {
            domain: 'fandeco',
            name: room
        }

        try {
            const res = await fetch(apiLink, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            })

            if (!res.ok) {

                const errData = await res.json();
                const errObj = JSON.parse(errData.errors.error[0])
                console.log('\x1b[31m%s\x1b[0m', 'Error Object:')
                console.error(errObj)

                get().modalMessageSet(true, 'Ошибка запроса!')
                throw new Error(`Ошибка запроса Добавить помещение! Запрос к URL ${apiLink}`)
            }

            const data = await res.json()

            // Add room
            const newRooms = [...get().rooms]

            let addedRoomId = data.id
            addedRoomId = typeof addedRoomId === 'string'
                ? addedRoomId
                : addedRoomId.toString()

            newRooms.unshift({
                id: addedRoomId,
                name: room,
                selected: false,
            })

            setTimeout(() => set({
                dataLoading: false,
                modalMessageVisible: true,
                modalMessageCaption: `Помещение #${addedRoomId} ${room} добавлено`,
                rooms: newRooms
            }), 500)

        } catch (error) {
            console.error(error)
        }
    },
    setRoom: (id) => {
        const newRooms = [...get().rooms]

        newRooms.forEach(r => r.selected = r.id === id)

        set({ rooms: newRooms })
    },
    checkRoom: () => {
        for (const r of get().rooms) {
            if (r.selected) return true
        }

        return false
    },
    resetRoom: () => {
        const newRooms = [...get().rooms]

        newRooms.forEach(r => r.selected = false)

        set({ rooms: newRooms })
    },
    // #endregion


    // #region Configuration Actions
    currentConfiguration: {
        projectId: null,
        roomId: null,
        configurationId: null,
        type: null
    },

    setCurrentConfiguration: (configuration) => {
        set({currentConfiguration: configuration})
    },

    resetCurrentConfiguration: () => {
        set({currentConfiguration: {
            projectId: null,
            roomId: null,
            configurationId: null,
            type: null
        }})
    },

    copyReplaceConfiguration: async (projectId, roomId, roomName) => {

        const from = { ...get().currentConfiguration }
        const to = { projectId: projectId, roomId: roomId, roomName: roomName }

        // Type guards
        if ( from.projectId === null || from.roomId === null ||
                from.configurationId === null || from.type === null ) return

        // Скрываем и очищаем модальное окно Копирования/Переноса конфигурации
        set({
            modalCopyConfigurationType: null,
            modalCopyConfigurationVisible: false,
            modalCopyConfigurationCaption: '',
            currentConfiguration: {
                projectId: null,
                roomId: null,
                configurationId: null,
                type: null
            }
        })

        const apiLink = window.copyReplaceConfigurationLink
        const token = window.userToken

        if (!apiLink) {
            get().modalMessageSet(true, 'Ошибка запроса!')
            throw new Error(`На странице не указана ссылка на API Copy or Replace Configuration window.copyReplaceConfigurationLink`)
        }

        set({ dataLoading: true })

        const headers: HeadersInit = defaultFetchHeaders
        if (token) headers['Token'] = token

        const body = {
            domain: 'fandeco',
            project_id: to.projectId,
            room_id: to.roomId,
            configuration_id: from.configurationId,
            copy: from.type === 'copy'
        }

        try {
            const res = await fetch(apiLink, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            })

            if (!res.ok) {
                const errData = await res.json();
                const errObj = JSON.parse(errData.errors.error[0])
                console.log('\x1b[31m%s\x1b[0m', 'Error Object:')
                console.error(errObj)

                get().modalMessageSet(true, 'Ошибка запроса!')
                throw new Error(`Ошибка запроса ${from.type === 'copy' ? "копировать" : "перенести"} комплект! Запрос к URL ${apiLink}`)
            }

            const data: { id: number } = await res.json()

            if (data.id) {

                // 1. Получаем копию комплекта/конфигурации
                // 2. Создаем новый комплект/конфигурацию
                // 3. Если тип запроса Перенести (replace), то удаляем референс

                const newConfigurationId: string | number = data.id
                const newProjects = [...get().projects]

                // 1. Получаем копию комплекта/конфигурации
                let configurationCopy: TConfiguration = {} as TConfiguration

                const project = newProjects.find(p => p.id === from.projectId)

                if (project && project.rooms) {
                    const room = project.rooms.find(r => r.id === from.roomId)

                    if (room) {
                        const configuration = room.configurations.find(c => c.id === from.configurationId)

                        if (configuration) {
                            configurationCopy = {
                                ...configuration,
                                id: newConfigurationId,
                                edit: false
                            };
                        }
                    }
                }

                // 2. Создаем новый комплект/конфигурацию
                const toProjectIdx = newProjects.findIndex(p => p.id === to.projectId)
                const rooms = newProjects[toProjectIdx].rooms

                // Если в проекте уже есть добавленные комнаты
                if (rooms) {
                    const toRoomId = rooms.findIndex(r => r.id === to.roomId)

                    // Если такой комнаты нет
                    if (toRoomId === -1) {
                        newProjects[toProjectIdx].rooms = [
                            ...rooms,
                            {
                                id: to.roomId,
                                name: to.roomName,
                                configurations: [
                                    { ...configurationCopy }
                                ]
                            }
                        ]

                    // Если такая комната в целевом проекте уже есть
                    } else {
                        const fromConfigurations = rooms[toRoomId].configurations
                        rooms[toRoomId].configurations = [
                            ...fromConfigurations,
                            { ...configurationCopy }
                        ]
                    }

                // Если в проекте еще нет добавленных комнат
                } else {
                    newProjects[toProjectIdx].rooms = [
                        {
                            id: to.roomId,
                            name: to.roomName,
                            configurations: [
                                { ...configurationCopy }
                            ]
                        }
                    ]
                }


                // 3. Если тип запроса Перенести (replace), то удаляем референс
                if (from.type === 'replace') {

                    // Находим проект
                    const projectIndex = newProjects.findIndex(p => p.id === from.projectId)

                    if (projectIndex !== -1) {
                        const project = newProjects[projectIndex]

                        // Находим комнату
                        const roomIndex = project.rooms?.findIndex(r => r.id === from.roomId) ?? -1;

                        if (project.rooms && roomIndex !== -1) {
                            const room = project.rooms[roomIndex]

                            // Находим конфигурацию
                            const configIndex = room.configurations.findIndex(c => c.id === from.configurationId)

                            if (configIndex !== -1) {

                                // Удаляем конфигурацию
                                room.configurations.splice(configIndex, 1)

                                // Если конфигураций больше нет, удаляем комнату
                                if (room.configurations.length === 0) {
                                    project.rooms.splice(roomIndex, 1)

                                    // Если комнат больше нет, удаляем rooms из проекта
                                    if (project.rooms.length === 0) {
                                        delete project.rooms
                                    }
                                }
                            }
                        }
                    }
                }

                setTimeout(() => set({
                    dataLoading: false,
                    modalMessageVisible: true,
                    modalMessageCaption: `Комплект ${from.type === 'copy' ? 'скопирован' : 'перенесен'}`,
                    projects: [...newProjects]
                }), 500)

            } else throw new Error('В ответе на копирование/перенос конфигурации нет id!')

        } catch (error) {
            console.error(error)
        }
    },

    addConfiguration: async (projectId, roomId, roomName, backgroundId, border, devices, count, direction) => {

        const apiLink = window.addConfigurationLink
        const token = window.userToken

        if (!apiLink) {
            get().modalMessageSet(true, 'Ошибка запроса!')
            throw new Error(`На странице не указана ссылка на API Add Configuration window.addConfigurationLink`)
        }

        set({ dataLoading: true })

        const headers: HeadersInit = defaultFetchHeaders
        if (token) headers['Token'] = token

        // #region Add products
        const products: {
            [key: string]: number
        } = {}

        if (border) products[`${border.id}`] = 1

        const collapsedDevices = collapseDevices(devices)
        collapsedDevices.forEach(device =>
            products[`${device.id}`] = device.selectedCount)
        // #endregion

        const body = {
            domain: 'fandeco',
            project_id: projectId,
            room_id: roomId,
            direction: direction === 'horizontal' ? 'universal' : direction,
            file_id: backgroundId,
            count: count,
            products: products
        }

        try {
            const res = await fetch(apiLink, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            })

            if (!res.ok) {
                const errData = await res.json();
                const errObj = JSON.parse(errData.errors.error[0])
                console.log('\x1b[31m%s\x1b[0m', 'Error Object:')
                console.error(errObj)

                get().modalMessageSet(true, 'Ошибка запроса!')
                throw new Error(`Ошибка запроса Добавить конфигурацию в проект! Запрос к URL ${apiLink}`)
            }

            const data = await res.json()

            // Add configuration to selected project
            const newProjects = [...get().projects]
            const editProjectKey = newProjects.findIndex(p => p.selected)

            const configuration: TConfiguration = {
                id: data.id,
                count: get().countOfSets,
                direction: direction
            }

            if (border !== null) {
                configuration.border = border
            }

            if (devices.length) {
                configuration.devices = devices
            }

            if (backgroundId) configuration.background = backgroundId

            const newRooms = newProjects[editProjectKey].rooms

            // Если уже добавляли комплект и Rooms не пустые
            if (newRooms) {
                const editRoomKey = newRooms.findIndex(r => r.id === roomId)

                if (editRoomKey !== -1) {
                    newRooms[editRoomKey].configurations.push(configuration)
                } else {
                    newRooms.push({
                        id: roomId,
                        name: roomName,
                        configurations: [ configuration ]
                    })
                }

                newProjects[editProjectKey].rooms = [...newRooms]
            }
            // Если еще не добавляли ни один комплект
            else {
                newProjects[editProjectKey].rooms = [{
                    id: roomId,
                    name: roomName,
                    configurations: [ configuration ]
                }]
            }

            setTimeout(() => set({
                dataLoading: false,
                modalAddConfigurationVisible: true,
                projects: newProjects
            }), 500)

        } catch (error) {
            console.error(error)
        }
    },

    setConfigurationCount: (projectId, roomId, configurationId, direction) => {

        const newProjects = [...get().projects]

        let count: number

        for (const p of newProjects) {

            if (p.id === projectId && p.rooms) {
                for (const r of p.rooms) {

                    if (r.id === roomId) {
                        for (const c of r.configurations) {

                            if (c.id === configurationId) {

                                if (!get().startValueConfigurationCount) {
                                    set({startValueConfigurationCount: c.count})
                                }

                                const newCount = c.count + direction

                                c.count = newCount
                                count = newCount
                            }
                        }
                    }
                }
            }
        }

        set({ projects: [...newProjects] });

        // Обновляем значение в БД с таймаутом в 500 мс.
        (() => {
            clearTimeout(get().setCountTimeoutId)

            const timeoutId = setTimeout(() => {
                get().updateRemoteConfigurationCount(
                    projectId,
                    roomId,
                    configurationId,
                    count
                )
            }, 500)

            set({setCountTimeoutId: timeoutId})
        })()
    },

    updateRemoteConfigurationCount: async (projectId, roomId, configurationId, newCount) => {

        let border: TBorder | undefined
        let devices: (TDevice | null)[] | undefined

        const project = get().projects.find(p => p.id === projectId)

        if (project) {
            const room = project.rooms?.find(r => r.id === roomId)

            if (room) {
                const configuration = room.configurations.find(c => c.id === configurationId)

                if (configuration) {
                    if (configuration.border) border = configuration.border
                    if (configuration.devices) devices = configuration.devices as (TDevice | null)[]
                }
            }
        }

        const apiLink = window.updateConfigurationCountLink
        const token = window.userToken

        if (!apiLink) {
            // В случае ошибки, сбрасываем счетчик в изначальное значение
            get().resetConfigurationCountToStart(projectId, roomId, configurationId)

            get().modalMessageSet(true, 'Ошибка запроса!')
            throw new Error(`На странице не указана ссылка на API Update Configuration Count window.updateConfigurationCountLink`)
        }

        set({ dataLoading: true })

        const headers: HeadersInit = defaultFetchHeaders
        if (token) headers['Token'] = token

        // #region Add products
        const products: {
            [key: string]: number
        } = {}

        if (border) products[`${border.id}`] = newCount

        if (devices) {
            const collapsedDevices = collapseDevices(devices)
            collapsedDevices.forEach(device =>
                products[`${device.id}`] = device.selectedCount * newCount)
        }
        // #endregion

        const body = {
            domain: 'fandeco',
            'project_id': projectId,
            'room_id': roomId,
            'configuration_id': configurationId,
            'products': products,
        }

        try {
            const res = await fetch(apiLink, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            })

            if (!res.ok) {
                const errData = await res.json();
                const errObj = JSON.parse(errData.errors.error[0])
                console.log('\x1b[31m%s\x1b[0m', 'Error Object:')
                console.error(errObj)

                get().modalMessageSet(true, 'Ошибка запроса!')
                throw new Error(`Ошибка запроса Обновить количество Конфигураций! Запрос к URL ${apiLink}`)
            }

            const data: { success: boolean } = await res.json()

            if (!data.success) {
                throw new Error(`Ошибка обновления количества конфигураций! ИД проекта: ${projectId}, ИД комнаты: ${roomId}, ИД конфигурации: ${configurationId}!`)
            }

            setTimeout(() => set({
                dataLoading: false,
                modalMessageVisible: true,
                modalMessageCaption: `Количество изменено`,
            }), 500)

        } catch (error) {
            console.error(error)

            // В случае ошибки, сбрасываем счетчик в изначальное значение
            get().resetConfigurationCountToStart(projectId, roomId, configurationId)
        }
    },

    resetConfigurationCountToStart: (projectId, roomId, configurationId) => {

        const newProjects = [...get().projects]
        const startCount = get().startValueConfigurationCount

        if (!startCount) return

        for (const p of newProjects) {

            if (p.id === projectId && p.rooms) {
                for (const r of p.rooms) {

                    if (r.id === roomId) {
                        for (const c of r.configurations) {

                            if (c.id === configurationId) {
                                c.count = startCount
                            }
                        }
                    }
                }
            }
        }

        set({
            projects: [...newProjects],
            startValueConfigurationCount: null
        })
    },

    removeConfiguration: async (projectId, roomId, configurationId) => {

        const removeConfiguration = () => {
            const newProjects = [...get().projects]

            // Projects
            for (let pIdx = 0; pIdx < newProjects.length; pIdx++) {

                const project = newProjects[pIdx]

                if (project.id === projectId) {

                    const rooms = project.rooms

                    if (rooms) {

                        // Rooms
                        for (let rIdx = 0; rIdx < rooms.length; rIdx++) {

                            const room = rooms[rIdx]

                            if (room.id === roomId) {

                                // Configurations
                                for (let cIdx = 0; cIdx < room.configurations.length; cIdx++) {

                                    const configuration = room.configurations[cIdx]

                                    if (configuration.id === configurationId) {
                                        room.configurations.splice(cIdx, 1)
                                    }
                                }
                            }

                            if (rooms[rIdx].configurations.length === 0) {
                                rooms.splice(rIdx, 1)
                            }
                        }
                    }

                    if (rooms?.length === 0) {
                        delete newProjects[pIdx].rooms
                    }
                }
            }

            set({
                dataLoading: false,
                modalMessageVisible: true,
                modalMessageCaption: `Комплект удален`,
                projects: [...newProjects]
            })
        }

        const apiLink = window.removeConfigurationLink
        const token = window.userToken

        if (!apiLink) {
            get().modalMessageSet(true, 'Ошибка запроса!')
            throw new Error(`На странице не указана ссылка на API Remove Configuration window.removeConfigurationLink`)
        }

        set({ dataLoading: true })

        const headers: HeadersInit = defaultFetchHeaders
        if (token) headers['Token'] = token

        const body = {
            domain: 'fandeco',
            configuration_id: configurationId
        }

        try {
            const res = await fetch(apiLink, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            })

            if (!res.ok) {
                const errData = await res.json();
                const errObj = JSON.parse(errData.errors.error[0])
                console.log('\x1b[31m%s\x1b[0m', 'Error Object:')
                console.error(errObj)

                get().modalMessageSet(true, 'Ошибка запроса!')
                throw new Error(`Ошибка запроса Удалить Конфигурацию! Запрос к URL ${apiLink}, ИД проекта: ${projectId}, ИД комнаты: ${roomId}, ИД конфигурации: ${configurationId}`)
            }

            const data = await res.json()
            if (data.success) setTimeout(removeConfiguration, 500)
            else throw new Error(`Ошибка запроса Удалить Конфигурацию! Запрос к URL ${apiLink}, ИД проекта: ${projectId}, ИД комнаты: ${roomId}, ИД конфигурации: ${configurationId}`)

        } catch (error) {
            console.error(error)
        }
    },
    // #endregion


    // #region Edit Configuration
    editConfiguration: null,

    setEditConfiguration: (projectId, roomId, configurationId) => {
        const projects = get().projects
        let count: number = 1

        projects.forEach(project => {
            if (project.id === projectId) {
                project.rooms?.forEach(room => {
                    if (room.id === roomId) {
                        room.configurations.forEach(conf => {
                            if (conf.id === configurationId) count = conf.count
                        })
                    }
                })
            }
        })


        set({
            editConfiguration: {
                projectId, roomId, configurationId
            },

            countOfSets: count,

            activeViewportTab: 'configurator',
            activeCalcTab: 'borders'
        })
    },

    resetEditConfiguration: () => {
        set({editConfiguration: null})
    },

    saveConfiguration: async (backgroundId, selectedBorder, devices, direction) => {
        const editedData = get().editConfiguration

        if (!editedData) return

        const projectId = editedData.projectId
        const roomId = editedData.roomId
        const configurationId = editedData.configurationId
        const countOfSets = get().countOfSets

        const apiLink = window.saveConfigurationLink
        const token = window.userToken

        if (!apiLink) {
            get().modalMessageSet(true, 'Ошибка запроса!')
            throw new Error(`На странице не указана ссылка на API Save Configuration window.saveConfigurationLink`)
        }

        set({ dataLoading: true })

        const headers: HeadersInit = defaultFetchHeaders
        if (token) headers['Token'] = token

        // #region Add products
        const products: {
            [key: string]: number
        } = {}

        if (selectedBorder) products[`${selectedBorder.id}`] = countOfSets

        const collapsedDevices = collapseDevices(devices)
        collapsedDevices.forEach(device =>
            products[`${device.id}`] = device.selectedCount * countOfSets)
        // #endregion

        const body = {
            domain: 'fandeco',
            project_id: projectId,
            room_id: roomId,
            configuration_id: configurationId,
            direction: direction === 'horizontal' ? 'universal' : direction,
            products: products,
            file_id: backgroundId,
        }

        try {
            const res = await fetch(apiLink, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            })

            if (!res.ok) {
                const errData = await res.json();
                const errObj = JSON.parse(errData.errors.error[0])
                console.log('\x1b[31m%s\x1b[0m', 'Error Object:')
                console.error(errObj)

                get().modalMessageSet(true, 'Ошибка запроса!')
                throw new Error(`Ошибка запроса Сохранить измененный проект! Запрос к URL ${apiLink}`)
            }

            const data: { success: boolean } = await res.json()

            if (!data.success) {
                throw new Error(`Ошибка сохранения конфигурации с ИД: ${configurationId}!`)
            }

            // Add configuration to selected project

            // --- Configuration
            const changedConfiguration: TConfiguration = {
                id: configurationId,
                count: countOfSets,
                direction: direction,
            }
            if (selectedBorder !== null) {
                changedConfiguration.border = selectedBorder
            }
            if (devices.length) {
                changedConfiguration.devices = devices
            }
            if (backgroundId) {
                changedConfiguration.background = backgroundId
            }


            // --- Update configuration
            const newProjects = [...get().projects]

            newProjects.forEach(p => {
                if (p.id === projectId) {
                    p.rooms?.forEach(r => {
                        if (r.id === roomId) {
                            r.configurations.forEach((c, idx) => {
                                if (c.id === configurationId) {
                                    r.configurations[idx] = changedConfiguration
                                }
                            })
                        }
                    })
                }
            })

            setTimeout(() => set({
                dataLoading: false,
                modalSaveConfigurationVisible: true,
                projects: newProjects
            }), 500)

        } catch (error) {
            console.error(error)
        }
    },
    // #endregion


    // #region Dictionary
    dictionary: {
        ru: {}
    },
    // #endregion


    // #region Counter
    countOfSets: 1,
    setCountOfSets: (direction) => {
        let newCount = get().countOfSets + 1 * direction

        if (newCount === 0) newCount = 1

        set({ countOfSets: newCount })
    },
    resetCountOfSets: () => set({countOfSets: 1}),
    // #endregion


    // #region ModalSelect
    modalSelectVisible: false,
    modalSelectCaption: '',
    modalSelectButtonApproveText: '',
    modalSelectButtonRejectText: '',
    modalSelectPayload: {
        brandName: '',
        collectionName: ''
    },

    setModalSelect: (caption, approveText, rejectText, payload) => {
        set({
            loading: false,
            dataLoading: false,
            modalSelectVisible: true,
            modalSelectCaption: caption,
            modalSelectButtonApproveText: approveText,
            modalSelectButtonRejectText: rejectText,
            modalSelectPayload: payload
        })
    },

    resetModalSelect: () => {
        set({
            modalSelectVisible: false,
            modalSelectCaption: '',
            modalSelectButtonApproveText: '',
            modalSelectButtonRejectText: '',
            modalSelectPayload: {
                brandName: '',
                collectionName: ''
            }
        })
    },
    // #endregion


    // #region ModalWarning
    modalWarningVisible: false,
    modalWarningCaption: '',
    modalWarningEnabled: true,
    modalWarningSet: (visible, caption, enabled) => {
        set({
            loading: false,
            dataLoading: false,
            modalWarningVisible: visible,
            modalWarningCaption: caption,

            modalWarningEnabled: typeof enabled === 'undefined'
                ? get().modalWarningEnabled
                : enabled,
        })
    },
    // #endregion


    // #region ModalMessage
    modalMessageVisible: false,
    modalMessageCaption: '',
    modalMessageSet: (visible, caption) => {
        set({
            loading: false,
            dataLoading: false,
            modalMessageVisible: visible,
            modalMessageCaption: caption
        })
    },
    // #endregion


    // #region ModalAddConfiguration
    modalAddConfigurationVisible: false,
    modalAddConfigurationSet: (visible) => {
        set({
            loading: false,
            dataLoading: false,
            modalAddConfigurationVisible: visible,
        })
    },
    // #endregion


    // #region ModalSaveConfiguration
    modalSaveConfigurationVisible: false,
    modalSaveConfigurationSet: (visible) => {
        set({
            loading: false,
            dataLoading: false,
            modalSaveConfigurationVisible: visible,
        })
    },
    // #endregion


    // #region ModalCopyConfiguration
    modalCopyConfigurationType: null,
    modalCopyConfigurationVisible: false,
    modalCopyConfigurationCaption: '',
    modalCopyConfigurationSet: (type, visible: boolean, caption: string) => {
        set({
            modalCopyConfigurationType: type,
            modalCopyConfigurationVisible: visible,
            modalCopyConfigurationCaption: caption
        })
    },
    // #endregion


    // #region ModalShare
    modalShareVisible: false,
    modalShareValue: null,
    modalShareSet: (visible, value) => {
        set({
            loading: false,
            dataLoading: false,
            modalShareVisible: visible,
            modalShareValue: value
        })
    },
    // #endregion


    // #region ModalLoadProject
    modalLoadProjectVisible: false,
    modalLoadProjectValue: '',
    modalLoadProjectSetValue: (value) => set({ modalLoadProjectValue: value }),
    modalLoadProjectSet: (visible, value) => {
        set({
            modalLoadProjectVisible: visible,
            modalLoadProjectValue: value
        })
    },
    // #endregion


    // #region ModalResetSketch
    modalResetSketchVisible: false,
    modalResetSketchCaption: '',
    modalResetSketchButtonApproveText: '',
    modalResetSketchButtonRejectText: '',
    setModalResetSketch: ( visible, initializer, caption, approveText, rejectText ) => {
        set({
            modalResetSketchVisible: visible,
            modalResetSketchInitializer: initializer,
            modalResetSketchCaption: caption,
            modalResetSketchButtonApproveText: approveText,
            modalResetSketchButtonRejectText: rejectText
        })
    },
    // #endregion


    // #region AddProductsToCart
    addProductsToCart: async (payload) => {

        const productsAsQueryString = payload.map(product => `${product.article}=${product.count}`).join('&');

        const apiLink = window.addProductsToCartLink

        if (!apiLink) {
            get().modalMessageSet(true, 'Ошибка запроса!')
            throw new Error(`На странице не указана ссылка на API Добавить товар в корзину window.addProductsToCartLink`)
        }

        set({ dataLoading: true })

        const requestLink = `${apiLink}?${productsAsQueryString}`

        try {
            const res = await fetch(requestLink)

            if (!res.ok) {
                get().modalMessageSet(true, 'Ошибка запроса!')
                throw new Error(`Ошибка запроса Добавить товар/товары в Корзину! Запрос к URL ${requestLink}`)
            }

            const data = await res.json()

            if (!data.success) {
                get().modalMessageSet(true, data.message)
                throw new Error(data.message)
            }

            // Add project
            setTimeout(() => set({
                dataLoading: false,
                modalMessageVisible: true,
                modalMessageCaption: data.message,
            }), 500)

        } catch (error) {
            console.error(error)
        }
    }
    // #endregion
})

export default appSlice