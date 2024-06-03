import { StateCreator } from 'zustand'

const createAppSlice: StateCreator<AppStore> = (set) => ({
    loading: false,
    error: null,

    colors: {},
    setAppColors: (colors: Record<string, string>) => set({colors: colors}),

    activeCalcTab: 'borders',
    setActiveCalcTab: (tab) => set({activeCalcTab: tab}),

    activeViewportTab: 'configurator',
    setActiveViewportTab: (tab) => set({activeViewportTab: tab}),

    vendors: {},
    setAppVendors: (vendors) => set({vendors: vendors})
})

export default createAppSlice