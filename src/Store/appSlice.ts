import { StateCreator } from 'zustand'
import { TAppStore, TRequestAddConfiguration, TRequestSaveConfiguration, TRequestUpdateConfigurationCount,
    TRequestRemoveConfiguration, TRequestCopyReplaceConfiguration, TConfiguration } from '../types'

const appSlice: StateCreator<TAppStore> = (set, get) => ({
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

        if (!apiLink) {
            get().modalMessageSet(true, 'Ошибка запроса!')
            throw new Error(`На странице не указана ссылка на API Add Project window.addProjectLink`)
        }

        set({ dataLoading: true })

        // const requestLink = `${apiLink}?name=${project}`

        const body = new FormData()
        body.append('domain', 'fandeco')
        body.append('name', project)

        try {
            const res = await fetch(apiLink, {
                method: 'POST',
                body
            })

            if (!res.ok) {

                const errData = await res.json();
                const errObj = JSON.parse(errData.errors.error[0])
                console.log('\x1b[31m%s\x1b[0m', 'Error Object:')
                console.error(errObj)

                get().modalMessageSet(true, 'Ошибка запроса!')
                throw new Error(`Ошибка fetch запроса Добавить проект! Запрос к URL ${apiLink}`)
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

        if (!apiLink) {
            get().modalMessageSet(true, 'Ошибка запроса!')
            throw new Error(`На странице не указана ссылка на API Share Project window.shareProjectLink`)
        }

        set({ dataLoading: true })

        const requestLink = `${apiLink}?share=${id}`

        try {
            const res = await fetch(requestLink)

            if (!res.ok) {
                get().modalMessageSet(true, 'Ошибка запроса!')
                throw new Error(`Ошибка fetch запроса Поделиться проектом! Запрос к URL ${requestLink}`)
            }

            const data = await res.json()

            if (data.status === 'error') {
                get().modalMessageSet(true, 'Ошибка запроса!')
                throw new Error(data.error)
            }

            setTimeout(() => set({
                dataLoading: false,
                modalShareVisible: true,
                modalShareValue: data.link,
            }), 500)

        } catch (error) {
            console.error(error)
        }
    },
    loadProject: async (id) => {

        const apiLink = window.loadProjectLink

        if (!apiLink) {
            get().modalMessageSet(true, 'Ошибка запроса!')
            throw new Error(`На странице не указана ссылка на API Load Project window.loadProjectLink`)
        }

        set({ dataLoading: true })

        const requestLink = `${apiLink}?load=${id}`

        try {
            const res = await fetch(requestLink)

            if (!res.ok) {
                get().modalMessageSet(true, 'Ошибка запроса!')
                throw new Error(`Ошибка fetch запроса Загрузить проект! Запрос к URL ${requestLink}`)
            }

            const data = await res.json()

            if (data.status === 'error') {
                get().modalMessageSet(true, 'Ошибка запроса!')
                throw new Error(data.error)
            }

            setTimeout(() => {
                set({
                    dataLoading: false
                })


                alert('Добавляем проект в конфигуратор. Добавить логику когда будет ясна сигнатура Проекта.')




            }, 500)

        } catch (error) {
            console.error(error)
        }
    },
    removeProject: async (id, name) => {
        const apiLink = window.removeProjectLink

        if (!apiLink) {
            get().modalMessageSet(true, 'Ошибка запроса!')
            throw new Error(`На странице не указана ссылка на API Remove Project window.removeProjectLink`)
        }

        set({ dataLoading: true })

        const requestLink = `${apiLink}?remove=${id}`

        try {
            const res = await fetch(requestLink)

            if (!res.ok) {
                get().modalMessageSet(true, 'Ошибка запроса!')
                throw new Error(`Ошибка fetch запроса Удалить проект! Запрос к URL ${requestLink}`)
            }

            const data = await res.json()

            if (data.status === 'error') {
                get().modalMessageSet(true, 'Ошибка запроса!')
                throw new Error(data.error)
            }

            // Remove project
            const newProjects = [...get().projects].filter(p => p.id !== id)

            setTimeout(() => set({
                dataLoading: false,
                modalMessageVisible: true,
                modalMessageCaption: `Проект #${id} ${name} удален`,
                projects: newProjects
            }), 500)

        } catch (error) {
            console.error(error)
        }
    },
    // #endregion


    // #region Rooms
    rooms: [],
    addRoom: async (room) => {
        const apiLink = window.addRoomLink

        if (!apiLink) {
            get().modalMessageSet(true, 'Ошибка запроса!')
            throw new Error(`На странице не указана ссылка на API Add Room window.addRoomLink`)
        }

        set({ dataLoading: true })

        const requestLink = `${apiLink}?name=${room}`

        try {
            const res = await fetch(requestLink)

            if (!res.ok) {
                get().modalMessageSet(true, 'Ошибка запроса!')
                throw new Error(`Ошибка fetch запроса Добавить помещение! Запрос к URL ${requestLink}`)
            }

            const data = await res.json()

            if (data.status === 'error') {
                get().modalMessageSet(true, 'Ошибка запроса!')
                throw new Error(data.error)
            }

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
        const to = { projectId: projectId, roomId: roomId, roomName: roomName}

        if ( from.projectId === null
            || from.roomId === null
            || from.configurationId === null
            || from.type === null
        ) return

        const data: TRequestCopyReplaceConfiguration = {
            // from
            projectIdFrom: from.projectId,
            roomIdFrom: from.roomId,
            configurationId: from.configurationId,
            requestType: from.type,

            // to
            projectIdTo: to.projectId,
            roomIdTo: to.roomId
        }

        const JSONRequestData = JSON.stringify(data)

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

        if (!apiLink) {
            get().modalMessageSet(true, 'Ошибка запроса!')
            throw new Error(`На странице не указана ссылка на API Copy or Replace Configuration window.copyReplaceConfigurationLink`)
        }

        set({ dataLoading: true })

        const requestLink = `${apiLink}?data=${JSONRequestData}`

        try {
            const res = await fetch(requestLink)

            if (!res.ok) {
                get().modalMessageSet(true, 'Ошибка запроса!')
                throw new Error(`Ошибка fetch запроса ${from.type === 'copy' ? "копировать" : "перенести"} комплект! Запрос к URL ${requestLink}`)
            }

            const data = await res.json()

            if (data.status === 'error') {
                get().modalMessageSet(true, 'Ошибка запроса!')
                throw new Error(data.error)
            }

            // 1. Получаем копию комплекта
            // 2. Создаем новый комплект
            // 3. Если тип запроса Перенести (replace), то удаляем референс

            const newConfigurationId: string | number = data.id
            const newProjects = [...get().projects]

            // 1. Получаем копию комплекта
            let configurationCopy: TConfiguration = {} as TConfiguration

            for (const p of newProjects) {

                if (p.id === from.projectId && p.rooms) {
                    for (const r of p.rooms) {

                        if (r.id === from.roomId) {
                            for (const c of r.configurations) {

                                if (c.id === from.configurationId) {
                                    configurationCopy = {
                                        ...c,
                                        id: newConfigurationId,
                                        edit: false
                                    }
                                }
                            }
                        }
                    }
                }
            }


            // 2. Создаем новый комплект
            const toProjectIdx = newProjects.findIndex(p => p.id === to.projectId)
            const rooms = newProjects[toProjectIdx].rooms

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
                } else {
                    const fromConfigurations = rooms[toRoomId].configurations
                    rooms[toRoomId].configurations = [
                        ...fromConfigurations,
                        { ...configurationCopy }
                    ]
                }

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

                // Projects
                for (let pIdx = 0; pIdx < newProjects.length; pIdx++) {

                    const project = newProjects[pIdx]

                    if (project.id === from.projectId) {

                        const rooms = project.rooms

                        if (rooms) {

                            // Rooms
                            for (let rIdx = 0; rIdx < rooms.length; rIdx++) {

                                const room = rooms[rIdx]

                                if (room.id === from.roomId) {

                                    // Configurations
                                    for (let cIdx = 0; cIdx < room.configurations.length; cIdx++) {

                                        const configuration = room.configurations[cIdx]

                                        if (configuration.id === from.configurationId) {
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
            }

            setTimeout(() => set({
                dataLoading: false,
                modalMessageVisible: true,
                modalMessageCaption: `Комплект ${from.type === 'copy' ? 'скопирован' : 'перенесен'}`,
                projects: [...newProjects]
            }), 500)

        } catch (error) {
            console.error(error)
        }
    },

    addConfiguration: async (projectId, roomId, roomName, backgroundId, border, devices, counts, direction) => {

        const configuration: TRequestAddConfiguration = {
            projectId,
            roomId,
            border,
            devices,
            counts,
            direction
        }

        if (backgroundId) configuration.backgroundId = backgroundId

        const JSONRequestData = JSON.stringify(configuration)
        const apiLink = window.addConfigurationLink

        if (!apiLink) {
            get().modalMessageSet(true, 'Ошибка запроса!')
            throw new Error(`На странице не указана ссылка на API Add Configuration window.addConfigurationLink`)
        }

        set({ dataLoading: true })

        const requestLink = `${apiLink}?configuration=${JSONRequestData}`

        try {
            const res = await fetch(requestLink)

            if (!res.ok) {
                get().modalMessageSet(true, 'Ошибка запроса!')
                throw new Error(`Ошибка fetch запроса Добавить проект! Запрос к URL ${requestLink}`)
            }

            const data = await res.json()

            if (data.status === 'error') {
                get().modalMessageSet(true, 'Ошибка запроса!')
                throw new Error(data.error)
            }

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

            // Если уже добавляли комплект
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

    updateRemoteConfigurationCount: async (projectId, roomId, configurationId, count) => {

        const requestData: TRequestUpdateConfigurationCount = {
            projectId: projectId,
            roomId: roomId,
            configurationId: configurationId,
            count: count,
        }

        const JSONRequestData = JSON.stringify(requestData)
        const apiLink = window.updateConfigurationCountLink

        if (!apiLink) {
            // В случае ошибки, сбрасываем счетчик в изначальное значение
            get().resetConfigurationCountToStart(projectId, roomId, configurationId)

            get().modalMessageSet(true, 'Ошибка запроса!')
            throw new Error(`На странице не указана ссылка на API Update Configuration Count window.updateConfigurationCountLink`)
        }

        set({ dataLoading: true })

        const requestLink = `${apiLink}?data=${JSONRequestData}`

        try {
            const res = await fetch(requestLink)

            if (!res.ok) {
                get().modalMessageSet(true, 'Ошибка запроса!')
                throw new Error(`Ошибка fetch запроса Обновить Количество Комплектов! Запрос к URL ${requestLink}`)
            }

            const data = await res.json()

            if (data.status === 'error') {
                get().modalMessageSet(true, 'Ошибка запроса!')
                throw new Error(data.error)
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

        const requestData: TRequestRemoveConfiguration = {
            projectId: projectId,
            roomId: roomId,
            configurationId: configurationId
        }

        const JSONRequestData = JSON.stringify(requestData)
        const apiLink = window.removeConfigurationLink


        if (!apiLink) {
            get().modalMessageSet(true, 'Ошибка запроса!')
            throw new Error(`На странице не указана ссылка на API Remove Configuration window.removeConfigurationLink`)
        }

        set({ dataLoading: true })

        const requestLink = `${apiLink}?data=${JSONRequestData}`

        try {
            const res = await fetch(requestLink)

            if (!res.ok) {
                get().modalMessageSet(true, 'Ошибка запроса!')
                throw new Error(`Ошибка fetch запроса Удалить Комплект! Запрос к URL ${requestLink}`)
            }

            const data = await res.json()

            if (data.status === 'error') {
                get().modalMessageSet(true, 'Ошибка запроса!')
                throw new Error(data.error)
            }


            // Если успешно удалил в БД, удаляем из Стора
            setTimeout(removeConfiguration, 500)


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


        const fetchConfiguration: TRequestSaveConfiguration = {
            projectId,
            roomId,
            configurationId,
            border: selectedBorder,
            devices,
            counts: countOfSets,
            direction
        }

        if (backgroundId) fetchConfiguration.backgroundId = backgroundId

        const JSONRequestData = JSON.stringify(fetchConfiguration)
        const apiLink = window.saveConfigurationLink

        if (!apiLink) {
            get().modalMessageSet(true, 'Ошибка запроса!')
            throw new Error(`На странице не указана ссылка на API Save Configuration window.saveConfigurationLink`)
        }

        set({ dataLoading: true })

        const requestLink = `${apiLink}?configuration=${JSONRequestData}`

        try {
            const res = await fetch(requestLink)

            if (!res.ok) {
                get().modalMessageSet(true, 'Ошибка запроса!')
                throw new Error(`Ошибка fetch запроса Сохранить измененный проект! Запрос к URL ${requestLink}`)
            }

            const data = await res.json()

            if (data.status === 'error') {
                get().modalMessageSet(true, 'Ошибка запроса!')
                throw new Error(data.error)
            }

            // Add configuration to selected project

            // --- Configuration
            const changedConfiguration: TConfiguration = {
                id: fetchConfiguration.configurationId,
                count: fetchConfiguration.counts,
                direction: fetchConfiguration.direction,
            }
            if (fetchConfiguration.border !== null) {
                changedConfiguration.border = fetchConfiguration.border
            }
            if (fetchConfiguration.devices) {
                changedConfiguration.devices = fetchConfiguration.devices
            }
            if (backgroundId) changedConfiguration.background = fetchConfiguration.backgroundId


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
                throw new Error(`Ошибка fetch запроса Добавить товар/товары в Корзину! Запрос к URL ${requestLink}`)
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