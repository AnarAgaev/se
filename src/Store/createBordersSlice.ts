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
        return [...new Set(borders.map(border => border.vendor))]
    },
})

export default createBordersSlice
