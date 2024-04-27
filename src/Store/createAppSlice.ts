import { StateCreator } from 'zustand'

const createAppSlice: StateCreator<AppStore> = (set) => ({
    loading: false,
    error: null,

    activeCalcTab: 'backgrounds',
    setActiveCalcTab: (tab) => set({activeCalcTab: tab}),

    activeScreenTab: 'configurator',
    setActiveScreenTab: (tab) => set({activeScreenTab: tab}),
})

export default createAppSlice