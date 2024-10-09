import { StateCreator  } from 'zustand'
import { TBordersStore } from '../types'
import { z } from 'zod'
import { BordersList } from '../zod'

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
        const borders: z.infer<typeof BordersList> = [...get().borders]
        const materials: string[] = []

        borders.forEach(border => {
            if (!border.armature_material) {
                // console.log('\x1b[31m%s\x1b[0m', `У рамки ID:${border['id']} не указан свойство Материал! [armature_material]`)
                return
            }

            materials.push(border.armature_material.join('-'))
        })

        return [...new Set(materials)].sort()
    }
})

export default bordersSlice
