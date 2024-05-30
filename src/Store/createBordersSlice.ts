import { StateCreator  } from 'zustand'

const createBordersSlice: StateCreator<BordersStore> = (set, get) => ({
    borders: [],

    setInitBordersData: (data) => set({ borders: data }),

    getBordersColorsList: () => {
        const borders = [...get().borders]
        return [...new Set(borders.map(border => border.color))]
    },

    getBordersList: () => {
        const borders = [...get().borders]
        return borders
    },

    getBordersBrandsList: () => {

    },
})

export default createBordersSlice
