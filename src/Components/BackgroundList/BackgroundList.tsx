import { useId, useMemo } from 'react'
import { z } from 'zod'
import { BackgroundsTypeList } from '../../Store/zod-data-contracts'
import useStore from '../../Store'
import { BackgroundItemPicture } from '..'
import style from './BackgroundList.module.sass'

const { backgroundList, caption, list, item, item_active } = style

const itemList = (
    backgrounds: z.infer<typeof BackgroundsTypeList>,
    id: string
): JSX.Element[] =>  backgrounds.map((el) => {
        const clazz = el.active
            ? `${item} ${item_active}`
            : `${item}`

        return <li key={`${id}-${el.id}`} className={`${clazz}`}>
                    <BackgroundItemPicture source={el.preview}
                        id={el.id} active={el.active} />
                </li>
    })

const BackgroundList = () => {
    const backgrounds = useStore(state => state.backgrounds)
    const id = useId()

    const elements = useMemo(
        () => itemList(backgrounds, id),
        [backgrounds, id]
    )

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