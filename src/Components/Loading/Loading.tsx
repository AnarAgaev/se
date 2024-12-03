import { useState, useEffect } from 'react'
import useStore from '../../Store'
import style from './Loading.module.sass'

const { loading, visible, body } = style

const Loading = () => {
    const isVisible = useStore(state => state.dataLoading)

    const [show, setShow] = useState(false)

    useEffect(() => setShow(isVisible), [ isVisible ])

    return (
        <div className={`${loading} ${show ? visible : ''}`}>
            <div className={body}></div>
        </div>
    )
}

export default Loading