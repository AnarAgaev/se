import { StateCreator } from 'zustand'
import { TAppStore } from '../types'

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
    addRoom: (room) => {
        const newRooms = [...get().rooms]

        newRooms.forEach(room => room.selected = false)

        newRooms.unshift({
            id: Math.floor(Math.random() * Date.now()),
            name: room,
            selected: true
        })

        set({ rooms: newRooms })
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


    // #region ModalMessage
    modalShareVisible: false,
    modalShareValue: null,
    modalShareSet: (visible, value) => {
        set({
            loading: false,
            dataLoading: false,
            modalShareVisible: visible,
            modalShareValue: value
        })
    }
    // #endregion

})

export default appSlice