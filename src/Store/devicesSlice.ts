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

    getDevicesMaterialList: () => {
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

    functions: [],

    setFunctions: (functions) => {
        set({functions: [
            {
                name: 'Все функции',
                props: [],
                active: true
            },
            ...functions
        ]})
    },

    getFunctions: () => {
        return [...get().functions].map(fn => ({
            name: fn.name,
            active: fn.active ? true : false
        }))
    },

    updateActiveFunction: (functionName) => {
        const newFuncs = [...get().functions].map(fn => ({
            ...fn,
            active: fn.name === functionName
        }))

        set({ functions: [ ...newFuncs ] })
    },

    getFunctionsKinds: () => {
        const activeFunctions = [...get().functions.filter(
            fn => fn.active
        )]

        return activeFunctions.length !== 0
            ? activeFunctions[0].props
            : []
    },

    filtersDevices: {
        brand: '',
        colors: [],
        materials: []
    },

    setDevicesFilter: (prop, value) => {
        const newFilters = {...get().filtersDevices}
        newFilters[prop] = value.toString()
        set({filtersDevices: newFilters})
    },

    removeDevicesFilter: (prop) => {
        const newFilters = {...get().filtersDevices}
        delete newFilters[prop]
        set({filtersDevices: newFilters})
    },

    checkDevicesFilter: (prop, value) => {
        const selectedProp = get().filtersDevices[prop]
        return selectedProp === value
    },





    setPluralDevicesFilter: (prop, value) => {
        const newFilters = {...get().filtersDevices}

        if ((prop === 'colors' || prop === 'materials') && typeof value === 'string') {
            newFilters[prop].push(value)
            newFilters[prop] = [...new Set(newFilters[prop])]
        }

        set({filtersDevices: newFilters})
    },

    removePluralDevicesFilter: (prop, value) => {
        const newFilters = {...get().filtersDevices}

        if ((prop === 'colors' || prop === 'materials') && typeof value === 'string') {
            newFilters[prop] = newFilters[prop].filter(v => v !== value)
        }

        set({filtersDevices: newFilters})
    },

    checkPluralDevicesFilter: (prop, value) => {
        const filters = {...get().filtersDevices}

        if ((prop === 'colors' || prop === 'materials') && typeof value === 'string') {
            return !!filters[prop].find(v => v === value)
        }

        return false
    },
})

export default devicesSlice
