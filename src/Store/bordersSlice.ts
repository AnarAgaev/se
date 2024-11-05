import { StateCreator  } from 'zustand'
import { TBordersStore } from '../types'

const bordersSlice: StateCreator<TBordersStore> = (set, get) => ({
    borders: [],

    setInitBordersData: (payload) => set({ borders: payload }),

    getBordersBrandsList: () => {
        const borders = [...get().borders]
        return [...new Set(borders.map(border => border.vendor))].sort()
    },

    getBordersCollectionsList: () => {
        const borders = [...get().borders]
        const collections = [...new Set(borders.map(border => border.collection))]
        return collections.filter(collection => !!collection)
    },

    getBordersMaterialList: () => {
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

    // #region Filters
    filtersBorders: {
        brand: '',
        collection: '',
        colors: [],
        materials: []
    },

    setSingleBordersFilter: (prop, value) => {
        const newFilters = {...get().filtersBorders}

        if (prop === 'brand' || prop === 'collection') {
            newFilters[prop] = value.toString()
        }

        set({filtersBorders: newFilters})
    },

    removeSingleBordersFilter: (prop) => {
        const newFilters = {...get().filtersBorders}
        delete newFilters[prop]
        set({filtersBorders: newFilters})
    },

    checkSingleBordersFilter: (prop, value) => {
        const selectedProp = get().filtersBorders[prop]
        return selectedProp === value
    },

    setPluralBordersFilter: (prop, value) => {
        const newFilters = {...get().filtersBorders}

        if ((prop === 'colors' || prop === 'materials') && typeof value === 'string') {
            newFilters[prop].push(value)
            newFilters[prop] = [...new Set(newFilters[prop])]
        }

        set({filtersBorders: newFilters})
    },

    removePluralBordersFilter: (prop, value) => {
        const newFilters = {...get().filtersBorders}

        if ((prop === 'colors' || prop === 'materials') && typeof value === 'string') {
            newFilters[prop] = newFilters[prop].filter(v => v !== value)
        }

        set({filtersBorders: newFilters})
    },

    checkPluralBordersFilter: (prop, value) => {
        const filters = {...get().filtersBorders}

        if ((prop === 'colors' || prop === 'materials') && typeof value === 'string') {
            return !!filters[prop].find(v => v === value)
        }

        return false
    },

    getCountOfPosts: (border) => {
        let defaultCount = 1
        const borders = [...get().borders]

        borders.forEach(el => {
            const isSameVendor = border.vendor.toLocaleLowerCase() === el.vendor.toLocaleLowerCase()
            const isSameCollection = border.collection.toLocaleLowerCase() === el.collection.toLocaleLowerCase()
            const isSameColor = border.color.toLocaleLowerCase() === el.color.toLocaleLowerCase()

            if (isSameVendor && isSameCollection && isSameColor) {
                const postsCount = el.number_of_posts

                if (!postsCount) return

                const currentCount = Math.max(...postsCount.map(Number))

                defaultCount = currentCount > defaultCount
                    ? currentCount
                    : defaultCount
            }
        })

        return defaultCount
    }
    // #endregion
})

export default bordersSlice
