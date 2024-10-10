import { StateCreator } from 'zustand'
import { TAppStore } from '../types'

const appSlice: StateCreator<TAppStore> = (set, get) => ({
    loading: true,
    error: null,

    colors: undefined,
    setAppColors: (colors) => set({ colors: colors }),

    vendors: undefined,
    setAppVendors: (vendors) => set({vendors: vendors}),
    getVendorByName: (vendorName) => {
        const vendors = get().vendors || []

        const vendor = vendors.find(vendor =>
            vendor.name.toLowerCase() === vendorName.toLowerCase())

        return vendor
    },

    activeCalcTab: 'devices',
    setActiveCalcTab: (tab) => set({activeCalcTab: tab}),

    activeViewportTab: 'configurator',
    setActiveViewportTab: (tab) => set({activeViewportTab: tab}),

    functions: null,
    setFunctions: (functions) => set({functions: functions}),
    // getAppFunctionsKinds: () => {
    //     const functionsKinds = { ...get().functions }

    //     // Здесь написать логику по отбору только нужных типов финкциональностей
    //     // и отдавать только те, которые нужно выводить с учетом
    //     // выбранных фильтров и выбранного параметра Function

    //     return functionsKinds

    // },

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
    }
})

export default appSlice