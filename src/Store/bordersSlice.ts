import { StateCreator  } from 'zustand'
import { BordersStore } from './types'

const bordersSlice: StateCreator<BordersStore> = (set, get) => ({
    borders: [],

    setInitBordersData: (payload) => set({ borders: payload }),

    getBordersList: () => {
        const borders = [...get().borders]

        // For displaying filter only one border items
        return borders.filter(
            border => parseInt(border.number_of_posts) === 1
        )
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

export default bordersSlice
