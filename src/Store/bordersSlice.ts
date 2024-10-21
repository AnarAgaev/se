import { StateCreator  } from 'zustand'
import { TBordersStore } from '../types'

const bordersSlice: StateCreator<TBordersStore> = (set, get) => ({
    borders: [],

    setInitBordersData: (payload) => set({ borders: payload }),

    getBordersList: () => {
        const borders = [...get().borders]

        // borders.forEach(border => {
        //     if (!border.number_of_posts) {
        //         console.log('\x1b[31m%s\x1b[0m', `У рамки ID:${border['id']} не указано свойство Количество постов! [number_of_posts]`)
        //     }
        // })

        // For displaying filter only one border items
        return borders.filter(
            border => {
                const value = typeof border.number_of_posts === 'string'
                    ? parseInt(border.number_of_posts)
                    : NaN

                return value === 1
            }
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
        const materials: string[] = []

        borders.forEach(border => {
            if (!border.armature_material) {
                // console.log('\x1b[31m%s\x1b[0m', `У рамки ID:${border['id']} не указан свойство Материал! [armature_material]`)
                return
            }

            materials.push(border.armature_material.join('-'))
        })

        return [...new Set(materials)].sort()
    },

    filtersBorders: {},

    setBordersFilterBrand: (brandName) => {
        const newFilters = {...get().filtersBorders}
        newFilters.brand = brandName
        set({filtersBorders: newFilters})
    },

    checkBordersBrandSelected: (brandName) => {
        const selectedBrand = get().filtersBorders?.brand
        return selectedBrand === brandName
    }
})

export default bordersSlice
