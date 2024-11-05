import { useRef, useMemo, useCallback, useId } from 'react'
import { SketchBackground } from '../../Components'
import useStore from '../../Store'
import style from './Sketch.module.sass'

const { sketch, construction, posts, directions, horizontal, vertical, cloud,
    controllers, cart, minus, plus, disabled, set, wrap, border, device, postActive } = style

const createPosts = (
    id: string,
    postsCount: number,
    selectedPost: boolean[],
    onSetPostsCount: (evt: React.MouseEvent<HTMLSpanElement, MouseEvent>, newPostNumber: number) => void
): JSX.Element[] => {

    const resultList: JSX.Element[] = []

    // Default posts
    if (!selectedPost.length) {
        for (let i = 1; i <= 5; i++) {
            resultList.push(<li key={`post-${id}-${i}`}><span>{i}</span></li>)
        }
        return resultList
    }

    for (let i = 1; i <= postsCount; i++) {
        resultList.push(
            <li key={`post-${id}-${i}`} className={selectedPost[i - 1] ? postActive : ''}>
                <span onClick={e => onSetPostsCount(e, i)}>{i}</span>
            </li>
        )
    }

    return resultList
}

const Sketch = () => {
    const id = useId()

    const [
        scale,
        postsCount,
        resizeSketch,
        selectedPost
    ] = useStore(state => [
        state.scale,
        state.postsCount,
        state.resizeSketch,
        state.selectedPost
    ])

    const postsListRef = useRef<HTMLUListElement | null>(null)
    const directionsRef = useRef<HTMLUListElement | null>(null)

    const transformStyle = {
        transform: `scale(${scale})`,
        transformOrigin: `${scale > 1 ? '0 0' : 'center'}`
    }

    const onInc = () => { // +
        if (scale >= 1.5) return
        resizeSketch(1)
    }

    const onDec = () => { // -
        if (scale <= 0.5) return
        resizeSketch(-1)
    }

    // const onSetDirection = useCallback((e: React.ChangeEvent<HTMLLIElement>) => {
    const onSetDirection = useCallback(() => {
        if (directionsRef.current?.classList.contains(disabled)) return
    }, [])

    const onSetPostsCount = useCallback((evt: React.MouseEvent<HTMLSpanElement, MouseEvent>, newPostNumber: number) => {
        // If parent Ul is disabled, return
        if (postsListRef.current?.classList.contains(disabled)) return

        const span = evt.target as HTMLSpanElement
        const li = span.parentNode as HTMLLIElement

        // If parent Li is active, return
        if (li.classList.contains(postActive)) return

        // Sent new active post count

        console.log('Sent new active post count', newPostNumber);

















    }, [])

    const postList = useMemo(
        () => createPosts(id, postsCount, selectedPost, onSetPostsCount),
        [id, postsCount, selectedPost, onSetPostsCount]
    )

    return (
        <div className={sketch}>
            <SketchBackground />

            <div className={construction}>
                <ul ref={postsListRef}
                    className={selectedPost.length ? posts : `${posts} ${disabled}`}>
                    {postList}
                </ul>
                <ul ref={directionsRef}
                    className={selectedPost.length ? directions : `${directions} ${disabled}`}>
                    <li onClick={onSetDirection}><i className={horizontal}></i></li>
                    <li onClick={onSetDirection}><i className={vertical}></i></li>
                </ul>
            </div>

            <div className={cloud}>
                <button><i></i></button>
            </div>

            <ul className={controllers}>
                <li className={cart}></li>
                <li className={scale <= 0.5 ? `${minus} ${disabled}` : minus} onClick={onDec}></li>
                <li className={scale >= 1.5 ? `${plus} ${disabled}` : plus} onClick={onInc}></li>
            </ul>

            <div className={set}>
                <div className={wrap} style={transformStyle}>
                    <div className={device}></div>
                    <div className={border}></div>
                </div>
            </div>
        </div>
    )
}

export default Sketch