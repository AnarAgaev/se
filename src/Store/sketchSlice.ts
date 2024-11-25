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
    visible: true
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

        set({visible: false})

        setTimeout(() => set({
            border: border,
            selectedPost: newSelectedPosts,
            deviceList: fixedDeviceList
        }), 700)

        setTimeout(() => set({visible: true}), 1000)
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
        set({visible: false})

        setTimeout(() => set({direction: d}), 700)

        setTimeout(() => set({visible: true}), 1000)
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

    removeDevice: (remoteDevicePosition, remoteDeviceId) => {
        const newDeviceList = {...get().deviceList}

        // Deleting by device position
        if (remoteDevicePosition) {
            for (const key in newDeviceList as TSketchDeviceList) {
                const i = parseInt(key)

                if (i === 1 || i === 2 || i === 3 || i === 4 || i === 5) {
                    i === remoteDevicePosition && (newDeviceList[i] = null)
                }
            }
        }

        // Deleting by device ID
        if (remoteDeviceId) {
            for (let i = 5; i > 0; i--) {
                if (i === 1 || i === 2 || i === 3 || i === 4 || i === 5) {
                    if (newDeviceList[i]?.id === remoteDeviceId) {
                        newDeviceList[i] = null
                        break
                    }
                }
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
