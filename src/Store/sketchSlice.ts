import { StateCreator  } from 'zustand'
import { TSketchStore } from '../types'

const sketchSlice: StateCreator<TSketchStore> = (set, get) => ({
    border: undefined,
    device: [],
    project: undefined,
    placement: undefined,
    count: 1,
    posts: [],
    view: 'horizontal',
    scale: 1,

    resize: (direction) => {
        const scale = get().scale
        set({
            scale: +(scale + 0.1 * direction).toFixed(1)
        })
    }
})

export default sketchSlice
