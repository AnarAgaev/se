import { StateCreator } from 'zustand'
import { TAppStore, TRequestAddConfiguration, TConfiguration } from '../types'

const appSlice: StateCreator<TAppStore> = (set, get) => ({
    loading: true,
    dataLoading: false,


    error: null,
    fireError: (error) => {
        set({ error: error })
    },


    // #region Colors
    colors: undefined,
    setAppColors: (colors) => set({ colors: colors }),
    // #endregion


    // #region Vendors
    vendors: [],
    setAppVendors: (vendors) => set({vendors: vendors}),
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

    activeViewportTab: 'hub',
    setActiveViewportTab: (tab) => set({activeViewportTab: tab}),
    // #endregion


    // #region Projects
    projects: [],
    setAppProjects: (projects) => set({ projects: projects }),
    addProject: async (project) => {

        const apiLink = window.addProjectLink

        if (!apiLink) {
            get().modalMessageSet(true, 'Ошибка запроса!')
            throw new Error(`На странице не указана ссылка на API Add Project window.addProjectLink`)
        }

        set({ dataLoading: true })

        const requestLink = `${apiLink}?name=${project}`

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

            // Add project
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
    setAppRooms: (rooms) => set({ rooms: rooms }),
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


    // #region Adding Configuration
    addConfiguration: async (projectId, roomId, roomName, backgroundId, border, devices, counts) => {

        if (border === null) return

        const configuration: TRequestAddConfiguration = {
            projectId: projectId,
            roomId: roomId,
            border: border,
            devices: [...devices],
            counts: counts,
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

            // debugger

            // Add configuration to selected project
            const newProjects = [...get().projects]
            const editProjectKey = newProjects.findIndex(p => p.selected)

            const configuration: TConfiguration = {
                id: data.id,
                border: border,
                devices: [...devices],
                count: get().countOfSets
            }

            if (backgroundId) configuration.background = backgroundId

            const newRooms = newProjects[editProjectKey].rooms

            // Если уже добавляли ни одной конфигурации
            if (newRooms) {
                const editRoomKey = newRooms.findIndex(r => r.id === roomId)

                if (editRoomKey !== -1) {
                    newRooms[editRoomKey].configurations.push(configuration)
                } else {
                    newRooms.push({
                        id: roomId,
                        name: roomName,
                        configurations: [configuration]
                    })
                }

                newProjects[editProjectKey].rooms = [...newRooms]
            }
            // Если еще не добавляли ни одной конфигурации
            else {
                newProjects[editProjectKey].rooms = [{
                    id: roomId,
                    name: roomName,
                    configurations: [configuration]
                }]
            }

            setTimeout(() => set({
                dataLoading: false,
                modalMessageVisible: true,
                modalMessageCaption: `Конфигурация добавлена`,
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
    setDictionary: (dictionary) => {
        set({ dictionary: dictionary})
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

})

export default appSlice