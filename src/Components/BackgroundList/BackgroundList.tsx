import { useId, useEffect, useState, useMemo } from 'react'
import { z } from 'zod'
import { BackgroundsType } from '../../Store/zod-data-contracts'
import useStore from '../../Store'
import style from './BackgroundList.module.sass'

const { backgroundList, caption, list, item, item_active, picLoaded } = style

interface Props {
    source: string
    active: boolean
}

const Picture: React.FC<Props> = (props) => {
    const [clazz, setClazz] = useState('')

    useEffect(() => {
        const img = new Image()
        img.src = props.source
        img.onload = () => setClazz(picLoaded)
    }, [])

    return ( <img className={clazz}
        src={`${props.source}`}
        alt='' loading='lazy' />
    )
}

const itemList = (backgrounds: z.infer<typeof BackgroundsType>, id: string): JSX.Element[] => {
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

    const elements = useMemo(() => {
        return itemList(backgrounds, id)
    }, [backgrounds, id])

    return (
        <div className={backgroundList}>
            <h2 className={caption}>Выберите фон:</h2>
            <ul className={list}>
                { elements }
            </ul>
        </div>
    )
}

export default BackgroundList