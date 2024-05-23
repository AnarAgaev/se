import { StateCreator } from 'zustand'

const createAppSlice: StateCreator<AppStore> = (set) => ({
    loading: false,
    error: null,

    activeCalcTab: 'backgrounds',
    setActiveCalcTab: (tab) => set({activeCalcTab: tab}),

    activeViewportTab: 'configurator',
    setActiveViewportTab: (tab) => set({activeViewportTab: tab}),
})

export default createAppSlice