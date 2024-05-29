import { StateCreator  } from 'zustand'

const createDevicesSlice: StateCreator<DevicesStore> = (set, get) => ({
    devices: [],

    setInitDevicesData: (data) => set({ devices: data }),

    getDevicesColorsList: () => {
        const devices = [...get().devices]
        return [...new Set(devices.map(device => device.color))]
    },

    getDevicesList: () => {
        const devices = [...get().devices]
        return devices
    },
})

export default createDevicesSlice
