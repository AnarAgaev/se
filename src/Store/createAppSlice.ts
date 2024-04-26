import { StateCreator } from 'zustand'

const createAppSlice: StateCreator<AppStore> = () => ({
    loading: false,
    error: null
})

export default createAppSlice