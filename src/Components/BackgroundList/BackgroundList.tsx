import { ReactNode, useId, useRef, FC } from 'react'
import { z } from 'zod'
import { BackgroundsType } from '../../Store/zod-data-contracts'
import useStore from '../../Store'
import style from './BackgroundList.module.sass'

const { backgroundList, caption, list, item, item_active, picLoaded } = style

const Picture: FC = (props) => {
    const picRef = useRef(null)


    const setLoaded = () => {
        if (picRef && picRef.current) {
            const img: HTMLImageElement = picRef.current
            img.classList.add(`${picLoaded}`)
        }
    }

    return ( <img ref={picRef}
        src={`${props.source}`}
        onLoad={setLoaded}
        alt='' loading='lazy' />
    )
}

const itemList = (backgrounds: z.infer<typeof BackgroundsType>, id: string): ReactNode[] => {
    return backgrounds.map((el) => {

        const clazz = el.active
            ? `${item} ${item_active}`
            : `${item}`

        return <li key={`${id}-${el.id}`} className={`${clazz}`}>
                    <Picture source={el.preview} active={el.active} />
                </li>
    })
}

const BackgroundList = () => {
    const backgrounds = useStore(state => state.backgrounds)
    const id = useId()

    return (
        <div className={backgroundList}>
            <h2 className={caption}>Выберите фон:</h2>
            <ul className={list}>
                { itemList(backgrounds, id) }
            </ul>
        </div>
    )
}

export default BackgroundList