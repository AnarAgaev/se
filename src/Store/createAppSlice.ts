import { z } from 'zod'
import { ColorsType, ProjectListType } from './zod-data-contracts'
import { StateCreator } from 'zustand'

const createAppSlice: StateCreator<AppStore> = (set, get) => ({
    loading: true,
    error: null,

    colors: {},
    setAppColors: (colors: z.infer<typeof ColorsType>) => set({ colors: colors }),

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
    setAppProjects: (projects: z.infer<typeof ProjectListType>) => set({ projects: projects }),
    addProject: (project) => {

        const newProjects: z.infer<typeof ProjectListType> = [...get().projects]

        newProjects.forEach(project => project.selected = false)

        newProjects.unshift({
            id: Math.floor(Math.random() * Date.now()),
            name: project,
            selected: true
        })

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