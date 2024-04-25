import { z } from 'zod'

const initDataTypes = z.object({
    backgrounds: z.array(
        z.object({
            id: z.string(),
            active: z.boolean(),
            image: z.string(),
            preview: z.string()
        }))
})

export default initDataTypes