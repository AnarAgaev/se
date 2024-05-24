import useStore from '../../Store'
import { z } from 'zod'
import { BackgroundsType } from '../../Store/zod-data-contracts'
import style from './SketchBackground.module.sass'

const SketchBackground = () => {
    const backgrounds = useStore(state => state.backgrounds)
    const activeBackground = backgrounds.filter((background: z.infer<typeof BackgroundsType>) => background.active)

    return (
        <span className={style.sketchBackground}>
            { activeBackground.length > 0 &&
                <img src={activeBackground[0].image} alt="" />
            }
        </span>
    )
}

export default SketchBackground