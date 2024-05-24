import { StateCreator  } from 'zustand'

const createBackgroundSlice: StateCreator<BackgroundsStore> = (set, get) => ({
    backgrounds: [],

    setInitBackgroundsData: (data) => set({ backgrounds: data }),

    addUploadedBackground: (background) => {
        const backgrounds = [...get().backgrounds]

        // Reset previously selected background
        backgrounds.forEach(el => el.active = false)

        // Set received background as active
        if (!background.active) background.active = true

        backgrounds.unshift(background)
        set({ backgrounds: backgrounds })
    },

    setActiveBackground: (backgroundId) => {
        const backgrounds = [...get().backgrounds]
        backgrounds.forEach(el => el.active = el.id === backgroundId)
        set({ backgrounds: backgrounds })
    }
})

export default createBackgroundSlice
