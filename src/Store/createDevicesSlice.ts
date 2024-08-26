import { StateCreator  } from 'zustand'

const createDevicesSlice: StateCreator<DevicesStore> = (set, get) => ({
    devices: [],

    setInitDevicesData: (payload) => set({ devices: payload }),

    getDevicesList: () => {
        return [...get().devices]
    },

    getDevicesBrandsList: () => {
        const devices = [...get().devices]
        return [...new Set(devices.map(device => device.vendor))].sort()
    },

    getDevicesCollectionsList: () => {
        const devices = [...get().devices]
        const collections = [...new Set(devices.map(device => device.collection))].sort()
        return collections.filter(collection => !!collection)
    },

    getDevicesMaterialsList: () => {
        const devices = [...get().devices]
        return [...new Set(devices.map(device => device.material))].sort()
    },

    getDevicesFunctionsList: () => {
        const devices = [...get().devices]
        return [...new Set(devices.map(device => device.function))].sort()
    },

    getDevicesFunctionsOptions: (deviceFuncProp) => {
        const devices = [...get().devices]
        return [...new Set(devices.map(device => device[deviceFuncProp]))].sort()
    }
})

export default createDevicesSlice
