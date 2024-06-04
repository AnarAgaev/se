import { StateCreator  } from 'zustand'

const createBordersSlice: StateCreator<BordersStore> = (set, get) => ({
    borders: [],

    setInitBordersData: (data) => set({ borders: data }),

    getBordersList: () => {
        const borders = [...get().borders]
        return borders
    },

    getBordersColorsList: () => {
        const borders = [...get().borders]
        return [...new Set(borders.map(border => border.color))]
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
