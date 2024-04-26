import { StateCreator  } from 'zustand'

const createBackgroundSlice: StateCreator<BackgroundsStore> = (set) => ({
    backgrounds: [],
    setInitBackgroundsData: (data) => set({ backgrounds: data })
})

export default createBackgroundSlice
