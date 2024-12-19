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
                console.log('\x1b[31m%s\x1b[0m', `У рамки ID:${border['id']} не указан свойство Материал! [armature_material]`)
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

    checkSelectedBorderFilters: () => {
        const filters = get().filtersBorders
        const values = Object.values(filters)

        let isSomeSelected = false

        for (const v of values) {
            if (typeof v === 'string' && v) isSomeSelected = true
            if (Array.isArray(v) && v.length !== 0) isSomeSelected = true
        }

        return isSomeSelected
    },

    resetAllBorderFilters: () => {
        set({
            filtersBorders: {
                brand: '',
                collection: '',
                colors: [],
                materials: []
        }})
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
    // #endregion

    // #region Actions for Sketch

    // "f" is first border for matching and "s" is second border for matching
    checkSiblingBorder: (f, s) => {
        const getNoramalVars = (...args: (string | string[] | undefined)[]) => {
            return args.map(el => {
                if (Array.isArray(el)) return el.join('-')

                if (typeof el === 'string') {
                    return el.toLocaleLowerCase()
                }
            })
        }

        const [fVendor, fCollection, fConfColor, fMaterial] = getNoramalVars (
            f.vendor,
            f.collection,
            f.conf_color,
            f.armature_material
        )

        const [sVendor, sCollection, sConfColor, sMaterial] = getNoramalVars (
            s.vendor,
            s.collection,
            s.conf_color,
            s.armature_material
        )

        const isSameVendor = fVendor === sVendor
        const isSameCollection = fCollection === sCollection
        const isSameConfColor = fConfColor === sConfColor
        const isSameMaterial = fMaterial === sMaterial

        return isSameVendor && isSameCollection && isSameConfColor && isSameMaterial
    },

    getCountOfPosts: (border) => {
        let defaultCount = 1
        const borders = [...get().borders]

        borders.forEach(el => {
            const isSiblingBorders = get().checkSiblingBorder(border, el)

            if (isSiblingBorders) {
                const postsCount = el.number_of_posts

                if (!postsCount) return

                const currentCount = Math.max(...postsCount.map(Number))

                defaultCount = currentCount > defaultCount
                    ? currentCount
                    : defaultCount
            }
        })

        return defaultCount
    },

    getSiblingBorder: (border, numberOfPost) => {
        const borders = [...get().borders]
            .filter(el => get().checkSiblingBorder(border, el)
                && el.number_of_posts
                && el.number_of_posts.includes(String(numberOfPost)))

        if (!borders.length) {
            return undefined
        }

        if (borders.length > 1) {
            console.log('\x1b[31m%s\x1b[0m', `Функция поиска соседних рамок [getSiblingBorder] с количеством постов __${numberOfPost}__ вернула несколько результатов!`, borders)
            console.log('\x1b[31m%s\x1b[0m', '__Референс__', border)
        }

        console.log('Полученные соседние рамки', borders);

        return borders[0]
    }
    // #endregion
})

export default bordersSlice
