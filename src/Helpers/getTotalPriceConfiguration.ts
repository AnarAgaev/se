import { TConfiguration } from '../types'
import { formatNumber } from './'

export const getTotalPriceConfiguration = (conf: TConfiguration): string => {

    const count = conf.count

    const borderPrice = !conf.border
        ? 0
        : typeof conf.border.price === 'string'
            ? parseFloat(conf.border.price)
            : conf.border.price

    const devicesPrice: number = !conf.devices
        ? 0
        : conf.devices.reduce((acc, device) => {
            if (device && typeof device.price === 'string') {
                return acc + parseFloat(device.price)
            } else if (device && typeof device.price === 'number') {
                return acc + device.price
            } else {
                return acc
            }
        }, 0)

    return formatNumber((borderPrice + devicesPrice) * count)
}