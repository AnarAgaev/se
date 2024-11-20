import { StateCreator  } from 'zustand'
import { TSketchStore, TDefaultSketchProps, TSketchDeviceList, TNumberOfPosts } from '../types'

const defaultSketchProps:TDefaultSketchProps = {
    border: null,
    deviceList: { 1: null },
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

        const trimDeviceList = {...get().deviceList}

        for (const key in trimDeviceList) {
            const i = parseInt(key) as TNumberOfPosts

            if (i !== 1) delete trimDeviceList[i]
        }

        set({
            selectedPost: newSelectedPosts,
            postsCount: postsCount,
            border: border,
            deviceList: trimDeviceList,
            direction: 'horizontal'
        })
    },

    setBorder: (border, numberOfPosts) => {
        const newSelectedPosts = [...get().selectedPost]
            .map((_el, idx) => idx === numberOfPosts - 1)

        const fixedDeviceList = get().fixDeviceList(numberOfPosts as TNumberOfPosts)

        set({
            border: border,
            selectedPost: newSelectedPosts,
            deviceList: fixedDeviceList
        })
    },

    fixDeviceList: (numberOfPosts) => {
        const newDeviceList: TSketchDeviceList = {...get().deviceList}
        const to = Math.max(numberOfPosts, Object.keys(newDeviceList).length)
        const from = 1

        for (let i = from; i <= to; i++) {
            if (!( i === 1 || i === 2 || i === 3 || i === 4 || i === 5 )) return newDeviceList

            if (i > numberOfPosts) {
                delete newDeviceList[i]
            } else if (!newDeviceList[i]) {
                newDeviceList[i] = null
            }
        }

        return newDeviceList
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
        const newDeviceList: TSketchDeviceList = {...get().deviceList}

        for (const key in newDeviceList as TSketchDeviceList) {
            const i = parseInt(key)

            if (i === 1 || i === 2 || i === 3 || i === 4 || i === 5) {
                if (!newDeviceList[i]) {
                    newDeviceList[i] = d
                    break
                }
            }
        }

        set({ deviceList: newDeviceList })
    },

    removeDevice: (position) => {
        const newDeviceList = {...get().deviceList}

        for (const key in newDeviceList as TSketchDeviceList) {
            const i = parseInt(key)

            if (i === 1 || i === 2 || i === 3 || i === 4 || i === 5) {
                i === position && (newDeviceList[i] = null)
            }
        }

        set({ deviceList: newDeviceList })
    },

    checkDevices: () => {
        const devices = {...get().deviceList}

        for (const key in devices) {
            const i = parseInt(key)

            if (i === 1 || i === 2 || i === 3 || i === 4 || i === 5) {
                if (devices[i] === null) {
                    return false
                }
            }
        }

        return true
    }
})

export default sketchSlice
