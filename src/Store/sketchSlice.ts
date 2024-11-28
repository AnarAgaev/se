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

    setBorder: (border, numberOfPost, countOfPosts) => {

        const newDirection = numberOfPost === 1
            ? 'horizontal'
            : get().direction

        let newSelectedPosts = countOfPosts !== undefined
            ? [...new Array(countOfPosts)].fill(false)
            : [...get().selectedPost]

        newSelectedPosts = newSelectedPosts.map((_el, idx) => idx === numberOfPost - 1)

        const fixedDeviceList = get().fixDeviceList(numberOfPost as TNumberOfPosts)

        set({visible: false})

        setTimeout(() => set({
            direction: newDirection,
            border: border,
            selectedPost: newSelectedPosts,
            deviceList: fixedDeviceList,
            postsCount: newSelectedPosts.length
        }), 300)
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
        set({ visible: false })
        setTimeout(() => set({ direction: d }), 100)
        setTimeout(() => set({ visible: true }), 600)
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
        const deviceList = {...get().deviceList}

        for (const i in deviceList) {
            if (deviceList[parseInt(i) as TNumberOfPosts] !== null ) return true
        }

        return false
    },

    setVisible: (direction) => set({visible: direction})
})

export default sketchSlice
