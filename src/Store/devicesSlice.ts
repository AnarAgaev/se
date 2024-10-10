import { StateCreator  } from 'zustand'
import { TDevicesStore } from '../types'

const devicesSlice: StateCreator<TDevicesStore> = (set, get) => ({
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
        const materials: string[] = []

        devices.forEach(device => {
            if (!device.armature_material) {
                // console.log('\x1b[31m%s\x1b[0m', `У устройства ID:${device['id']} не указан свойство Материал! [armature_material]`)
                return
            }

            materials.push(device.armature_material.join('-'))
        })

        return [...new Set(materials)].sort()
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

export default devicesSlice
