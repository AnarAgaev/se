import { useEffect, useState } from 'react'
import useStore from '../../Store'
import style from './BackgroundItemPicture.module.sass'

const { image, image_active, image_loaded } = style

interface Props {
    source: string
    id: string | number
    active: boolean
}

const BackgroundItemPicture: React.FC<Props> = ({source, id, active}) => {
    const setActiveBackground = useStore(state => state.setActiveBackground)
    const [loadedClass, setLoadedClass] = useState(false)

    useEffect(() => {
        const img = new Image()
        img.src = source
        img.onload = () => setLoadedClass(true)
    }, [])

    let clazz = image
    if (active) clazz += ` ${image_active}`
    if (loadedClass) clazz += ` ${image_loaded}`

    return ( <img
        className={clazz}
        src={`${source}`}
        alt='' loading='lazy'
        onClick={() => setActiveBackground(id)} />
    )
}

export default BackgroundItemPicture