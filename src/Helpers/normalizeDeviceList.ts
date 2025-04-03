import { TDevice } from '../types'

const getIdAsNumber = (id: string | number): number => {
    return typeof id === 'string' ? parseInt(id) : id
}

export const normalizeDeviceList = (fromDevices: Array<TDevice>): Array<TDevice | null> => {

    // Создаем карту устройств для быстрого доступа к устройствам по id
    const deviceMap = new Map<number, TDevice>()
    fromDevices.forEach(device => {

        // Сразу вырезаем из устройств в мапе rank
        if (device.rank) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { rank, ...deviceWithoutRank } = device
            deviceMap.set(getIdAsNumber(device.id), deviceWithoutRank)
        } else {
            deviceMap.set(getIdAsNumber(device.id), device)
        }
    })


    // Собираем все позиции из всех rank в мапу
    const allPositions = new Map<number, number>()
    fromDevices.forEach(device => {
        try {
            if (device.rank) {

                const positionArray: number[] = JSON.parse(device.rank)

                positionArray.forEach(position => {
                    allPositions.set(position, getIdAsNumber(device.id))
                })
            }
        } catch (e) {
            throw new Error(`Ошибка JSON parse значения rank у устройства с id: ${device.id}`);
        }
    })


    // Получаем количество постов для длинны массива устройств
    const positionsMapKeys = Array.from(allPositions.keys())
    const devicesArrLength = positionsMapKeys.sort((a, b) => a - b)[positionsMapKeys.length - 1]

    // Собираем результирующий массив устройств
    const devices: Array<TDevice | null> = []

    for (let i = 1; i <= devicesArrLength; i++) {
        const deviceId = allPositions.get(i)
        devices.push(deviceId ? deviceMap.get(deviceId) || null : null)
    }

    return devices
}