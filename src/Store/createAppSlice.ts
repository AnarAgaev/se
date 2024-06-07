import { StateCreator } from 'zustand'

const createAppSlice: StateCreator<AppStore> = (set, get) => ({
    loading: false,
    error: null,

    colors: {},
    setAppColors: (colors: Record<string, string>) => set({colors: colors}),

    vendors: {},
    setAppVendors: (vendors) => set({vendors: vendors}),

    activeCalcTab: 'devices',
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

    }
})

export default createAppSlice