import { TDevice, TDeviceList } from '../types'

export const collapseDevices = (devices: TDeviceList): (TDevice & { selectedCount: number })[]  => {
    const devicesMap = new Map()

    for (const d of devices) {
        if (devicesMap.has(d.id)) {
            const existingDevice = devicesMap.get(d.id)
            existingDevice.selectedCount++
        } else {
            devicesMap.set(d.id, { ...d, selectedCount: 1 })
        }
    }

    return Array.from(devicesMap.values())
}