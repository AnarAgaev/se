import { StateCreator  } from 'zustand'
import { TBackgroundsStore } from '../types'

const backgroundSlice: StateCreator<TBackgroundsStore> = (set, get) => ({
    backgrounds: [],

    setInitBackgroundsData: (data) => set({ backgrounds: data }),

    addUploadedBackground: (background) => {
        const backgrounds = [...get().backgrounds]

        // Reset previously selected background
        backgrounds.forEach(el => el.selected = false)

        // Set received background as active
        if (!background.selected) background.selected = true

        backgrounds.unshift(background)

        set({ backgrounds: backgrounds })
    },

    setActiveBackground: (backgroundId) => {
        const backgrounds = [...get().backgrounds]

        backgrounds.forEach(b => b.selected = b.id === backgroundId)

        set({ backgrounds: backgrounds })
    },

    getSelectedBackgroundId: () => {
        const activeBackground = [...get().backgrounds].filter(b => b.selected)[0]

        if (activeBackground) return activeBackground.id

        return null
    },

    resetBackground: () => {
        const backgrounds = [...get().backgrounds]

        backgrounds.forEach(b => b.selected = !!b.default)

        set({ backgrounds: backgrounds })
    },

    setEditBackground: (bcgId) => {

        if (!bcgId) {
            get().resetBackground()
            return
        }

        const backgrounds = [...get().backgrounds]

        backgrounds.forEach(b => b.selected = b.id === bcgId)

        set({ backgrounds: backgrounds })
    }
})

export default backgroundSlice
