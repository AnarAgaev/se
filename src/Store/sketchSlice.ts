import { StateCreator  } from 'zustand'
import { TSketchStore } from '../types'

const sketchSlice: StateCreator<TSketchStore> = () => ({
    border: undefined,
    device: [],
    project: undefined,
    placement: undefined,
    count: 1,
    posts: [],
    view: 'horizontal',
    scale: 0
})

export default sketchSlice
