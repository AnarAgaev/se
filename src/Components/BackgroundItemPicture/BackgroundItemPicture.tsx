import { useEffect, useState } from 'react'
import style from './BackgroundItemPicture.module.sass'

const { image, loaded } = style

interface Props {
    source: string
    active: boolean
}

const BackgroundItemPicture: React.FC<Props> = (props) => {
    const [loadedClass, setLoadedClass] = useState(false)

    useEffect(() => {
        const img = new Image()
        img.src = props.source
        img.onload = () => setLoadedClass(true)
    }, [])

    const clazz = !loadedClass
        ? image
        : `${image} ${loaded}`

    return ( <img className={clazz}
        src={`${props.source}`}
        alt='' loading='lazy' />
    )
}

export default BackgroundItemPicture