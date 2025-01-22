import { TProject } from '../types';

export const getTotalProjectCost = (project: TProject): number => {
    let total = 0

    if (!project) return total

    const rooms = project.rooms

    if (!rooms) return 0

    for (const r of rooms) {
        const configurations = r.configurations

        for (const c of configurations) {

            let totalConfigurationsCost = !c.border
                ? 0
                : typeof c.border.price === 'string'
                    ? parseFloat(c.border.price)
                    : c.border.price

            if (c.devices) {
                for (const d of c.devices) {
                    if (d) {
                        totalConfigurationsCost += typeof d.price === 'string'
                            ? parseFloat(d.price)
                            : d.price
                    }
                }
            }

            total += (totalConfigurationsCost * c.count)
        }
    }

    return total
}