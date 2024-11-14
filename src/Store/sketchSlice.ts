import { StateCreator  } from 'zustand'
import { TSketchStore, TDefaultSketchProps, TSketchDeviceList } from '../types'

const defaultSketchProps:TDefaultSketchProps = {
    border: undefined,
    deviceList: { 1: undefined },
    project: undefined,
    placement: undefined,
    postsCount: 1,
    selectedPost: [],
    direction: 'horizontal',
    scale: 1,
}

const sketchSlice: StateCreator<TSketchStore> = (set, get) => ({
    ...defaultSketchProps,

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
    },

    resetSketch: () => {
        set({
            ...defaultSketchProps
        })
    },

    setDirection: (d) => {
        set({direction: d})
    },

    setDevice: (d) => {


        console.log(d);


        const newDeviceList: TSketchDeviceList = {...get().deviceList}

        for (const i in newDeviceList as TSketchDeviceList) {
            if (i === '1' || i === '2' || i === '3' || i === '4' || i === '5') {
                const val = newDeviceList[i]

                if (val === undefined ) {
                    newDeviceList[i] = d
                    break
                }
            }
        }
    }
})

export default sketchSlice
