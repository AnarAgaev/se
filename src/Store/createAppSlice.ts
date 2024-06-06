import { StateCreator } from 'zustand'

const createAppSlice: StateCreator<AppStore> = (set) => ({
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
})

export default createAppSlice