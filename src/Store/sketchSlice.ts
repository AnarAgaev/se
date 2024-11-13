import { StateCreator  } from 'zustand'
import { TSketchStore } from '../types'

const sketchSlice: StateCreator<TSketchStore> = (set, get) => ({
    border: undefined,
    deviceList: {},
    project: undefined,
    placement: undefined,
    postsCount: 1,
    selectedPost: [],
    view: 'horizontal',
    scale: 1,

    resizeSketch: (direction) => {
        const scale = get().scale
        set({
            scale: +(scale + 0.1 * direction).toFixed(1)
        })
    },

    setFirstBorder: (border, postsCount) => {
        const newSelectedPosts = [...new Array(postsCount)].fill(false)
        newSelectedPosts[0] = true

        set({
            selectedPost: newSelectedPosts,
            postsCount: postsCount,
            border: border
        })
    },

    setBorder: (border, numberOfPost) => {
        const newSelectedPosts = [...get().selectedPost]
            .map((_el, idx) => idx === numberOfPost - 1)

        set({
            border: border,
            selectedPost: newSelectedPosts,
        })
    }
})

export default sketchSlice
