import { StateCreator } from 'zustand'
import { TAppStore } from '../types'

const appSlice: StateCreator<TAppStore> = (set, get) => ({
    loading: true,

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

    activeViewportTab: 'configurator',
    setActiveViewportTab: (tab) => set({activeViewportTab: tab}),
    // #endregion


    // #region Projects
    projects: [],
    setAppProjects: (projects) => set({ projects: projects }),
    addProject: (project) => {
        const newProjects = [...get().projects]

        newProjects.forEach(project => project.selected = false)

        newProjects.unshift({
            id: Math.floor(Math.random() * Date.now()),
            name: project,
            selected: true
        })

        set({ projects: newProjects })
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
            modalMessageVisible: visible,
            modalMessageCaption: caption
        })
    }
    // #endregion

})

export default appSlice