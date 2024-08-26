import { StateCreator  } from 'zustand'

const createBordersSlice: StateCreator<BordersStore> = (set, get) => ({
    borders: [],

    setInitBordersData: (payload) => set({ borders: payload }),

    getBordersList: () => {
        return [...get().borders]
    },

    getBordersBrandsList: () => {
        const borders = [...get().borders]
        return [...new Set(borders.map(border => border.vendor))].sort()
    },

    getBordersCollectionsList: () => {
        const borders = [...get().borders]
        const collections = [...new Set(borders.map(border => border.collection))].sort()
        return collections.filter(collection => !!collection)
    },

    getBordersMaterialsList: () => {
        const borders = [...get().borders]
        return [...new Set(borders.map(border => border.material))].sort()
    }
})

export default createBordersSlice
