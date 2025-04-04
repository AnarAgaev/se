import { StateCreator } from "zustand"
import { TDevicesStore } from "../types"

const devicesSlice: StateCreator<TDevicesStore> = (set, get) => ({
	devices: [],

	getDevicesList: () => {
		return [...get().devices]
	},

	getDevicesBrandsList: () => {
		const devices = [...get().devices]
		return [...new Set(devices.map((device) => device.vendor))].sort()
	},

	getDevicesCollectionsList: () => {
		const devices = [...get().devices]
		const collections = [
			...new Set(devices.map((device) => device.collection)),
		]
		return collections.filter((collection) => !!collection)
	},

	getDevicesMaterialList: () => {
		const devices = [...get().devices]
		const materials: string[] = []

		devices.forEach((device) => {
			if (!device.armature_material) {
				// console.log('\x1b[31m%s\x1b[0m', `У устройства ID:${device['id']} не указан свойство Материал! [armature_material]`)
				return
			}

			materials.push(device.armature_material.join("-"))
		})

		return [...new Set(materials)].sort()
	},

	functions: [],

	getFunctions: () => {
		return [...get().filtersDevices.functions].map((fn) => ({
			name: fn.name,
			active: fn.active ? true : false,
		}))
	},

	updateActiveFunction: (functionName) => {
		const newFilterDevices = { ...get().filtersDevices }

		newFilterDevices.functions.forEach((fn) => {
			fn.active = fn.name === functionName
		})

		set({ filtersDevices: newFilterDevices })
	},

	getFunctionsKinds: () => {
		const activeFunctionality = [...get().filtersDevices.functions].find(
			(el) => el.active
		)

		if (activeFunctionality?.name === "Все функции") return

		return [
			...get().functions.filter(
				(fn) => fn.name === activeFunctionality?.name
			),
		][0]
	},

	// #region Filters
	filtersDevices: {
		brand: "",
		collection: "",
		colors: [],
		materials: [],
		activeFunction: "",
		functions: [],
	},

	checkSelectedDeviceFilters: () => {
		const { functions, ...withoutFilters } = get().filtersDevices

		const values = Object.values(withoutFilters)

		let isSomeSelected = false

		for (const v of values) {
			if (typeof v === "string" && v) isSomeSelected = true
			if (Array.isArray(v) && v.length !== 0) isSomeSelected = true
		}

		if (!functions[0].active) isSomeSelected = true // В нулевом элементе всегда лежит пункт Все функции (так добавляем при инициализации)

		return isSomeSelected
	},

	resetAllDeviceFilters: () => {
		const funcs = [...get().filtersDevices.functions].map((f, idx) => {
			return {
				...f,
				active: idx === 0, // В нулевом элементе всегда лежит пункт Все функции (так добавляем при инициализации)
				props: {},
			}
		})

		set({
			filtersDevices: {
				brand: "",
				collection: "",
				colors: [],
				materials: [],
				functions: [...funcs],
			},
		})
	},

	setSingleDevicesFilter: (prop, value) => {
		const newFilters = { ...get().filtersDevices }

		if (prop === "brand" || prop === "collection") {
			newFilters[prop] = value.toString()
		}

		set({ filtersDevices: newFilters })
	},

	removeSingleDevicesFilter: (prop) => {
		const newFilters = { ...get().filtersDevices }
		delete newFilters[prop]
		set({ filtersDevices: newFilters })
	},

	checkSingleDevicesFilter: (prop, value) => {
		const selectedProp = get().filtersDevices[prop]
		return selectedProp === value
	},

	setPluralDevicesFilter: (prop, value) => {
		const newFilters = { ...get().filtersDevices }

		if (
			(prop === "colors" || prop === "materials") &&
			typeof value === "string"
		) {
			newFilters[prop].push(value)
			newFilters[prop] = [...new Set(newFilters[prop])]
		}

		set({ filtersDevices: newFilters })
	},

	removePluralDevicesFilter: (prop, value) => {
		const newFilters = { ...get().filtersDevices }

		if (
			(prop === "colors" || prop === "materials") &&
			typeof value === "string"
		) {
			newFilters[prop] = newFilters[prop].filter((v) => v !== value)
		}

		set({ filtersDevices: newFilters })
	},

	checkPluralDevicesFilter: (prop, value) => {
		const filters = { ...get().filtersDevices }

		if (
			(prop === "colors" || prop === "materials") &&
			typeof value === "string"
		) {
			return !!filters[prop].find((v) => v === value)
		}

		return false
	},

	setFunctionProp: (groupName, propName, value) => {
		const newFiltersDevices = { ...get().filtersDevices }

		const activeFunctionIdx = newFiltersDevices.functions.findIndex(
			(fn) => fn.name === groupName
		)

		if (
			newFiltersDevices.functions[activeFunctionIdx].props[propName] !==
			value
		) {
			newFiltersDevices.functions[activeFunctionIdx].props[propName] =
				value
		} else {
			delete newFiltersDevices.functions[activeFunctionIdx].props[
				propName
			]
		}

		set({ filtersDevices: newFiltersDevices })
	},

	checkSelectedFunction: (groupName, propName, value) => {
		const functionalityProps = {
			...get().filtersDevices.functions.find(
				(fn) => fn.name === groupName
			)?.props,
		}

		return functionalityProps[propName] === value
	},
	// #endregion
})

export default devicesSlice
