import { StateCreator } from 'zustand'

const createAppSlice: StateCreator<AppStore> = (set, get) => ({
    loading: false,
    error: null,

    colors: {},
    setAppColors: (colors: Record<string, string>) => set({colors: colors}),

    vendors: {},
    setAppVendors: (vendors) => set({vendors: vendors}),

    activeCalcTab: 'borders',
    setActiveCalcTab: (tab) => set({activeCalcTab: tab}),

    activeViewportTab: 'configurator',
    setActiveViewportTab: (tab) => set({activeViewportTab: tab}),

    functions: {},
    setAppFunctionsKinds: (functions) => set({functions: functions}),
    getAppFunctionsKinds: () => {
        const functionsKinds = { ...get().functions }

        // Здесь написать логику по отбору только нужных типов финкциональностей
        // и отдавать только те, которые нужно выводить с учетом
        // выбранных фильтров и выбранного параметра Function

        return functionsKinds

    },

    projects: {},
    setAppProjects: (projects: Record<string, unknown>) => set({projects: projects}),
    addProject: (project) => {
        const newProjects: Record<string, unknown> = {}
        newProjects[project] = {}

        for (const key in get().projects)
            newProjects[key] = get().projects[key]

        set({ projects: newProjects })
    },

    rooms: {},
    setAppRooms: (rooms: Record<string, unknown>) => set({rooms: rooms}),
    addRoom: (room) => {
        const newRooms: Record<string, unknown> = {}
        newRooms[room] = {}

        for (const key in get().rooms)
            newRooms[key] = get().rooms[key]

        set({ rooms: newRooms })
    }

})

export default createAppSlice