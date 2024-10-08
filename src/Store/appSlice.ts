import { z } from 'zod'
import { ColorsType, ProjectsList, RoomsList } from './zod-data-contracts'
import { StateCreator } from 'zustand'

const appSlice: StateCreator<AppStore> = (set, get) => ({
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

    projects: [],
    setAppProjects: (projects: z.infer<typeof ProjectsList>) => set({ projects: projects }),
    addProject: (project) => {
        const newProjects: z.infer<typeof ProjectsList> = [...get().projects]

        newProjects.forEach(project => project.selected = false)

        newProjects.unshift({
            id: Math.floor(Math.random() * Date.now()),
            name: project,
            selected: true
        })

        set({ projects: newProjects })
    },

    rooms: [],
    setAppRooms: (rooms: z.infer<typeof RoomsList>) => set({ rooms: rooms }),
    addRoom: (room) => {
        const newRooms: z.infer<typeof RoomsList> = [...get().rooms]

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