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

        backgrounds.forEach(el => el.selected = el.id === backgroundId)

        set({ backgrounds: backgrounds })
    },

    getSelectedBackgroundId: () => {
        const activeBackground = [...get().backgrounds].filter(b => b.selected)[0]

        if (activeBackground) return activeBackground.id

        return null
    }
})

export default backgroundSlice
