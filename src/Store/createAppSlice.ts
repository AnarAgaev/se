import { StateCreator } from 'zustand'

const createAppSlice: StateCreator<AppStore> = (set) => ({
    loading: false,
    error: null,

    activeCalcTab: 'borders',
    setActiveCalcTab: (tab) => set({activeCalcTab: tab}),

    activeScreenTab: 'configurator',
    setActiveScreenTab: (tab) => set({activeScreenTab: tab}),
})

export default createAppSlice