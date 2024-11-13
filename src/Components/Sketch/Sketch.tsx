import { useRef, useMemo, useCallback, useId } from 'react'
import { SketchBackground } from '../../Components'
import useStore from '../../Store'
import style from './Sketch.module.sass'

type TOnSetPostsCount = (
    evt: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    newPostNumber: number
) => void

const { sketch, construction, posts, directions, horizontal, vertical, cloud,
    controllers, cart, minus, plus, disabled, set, wrap, border, device, postActive } = style

const createPosts = (
    id: string,
    postsCount: number,
    selectedPost: boolean[],
    onSetPostsCount: TOnSetPostsCount
): JSX.Element[] => {

    const resultList: JSX.Element[] = []

    for (let i = 1; i <= (!selectedPost.length ? 5 : postsCount); i++) {
        const jsxEl = !selectedPost.length
            ? <li key={`post-${id}-${i}`}><span>{i}</span></li>
            : <li key={`post-${id}-${i}`} className={selectedPost[i - 1] ? postActive : ''}>
                <span onClick={e => onSetPostsCount(e, i)}>{i}</span>
            </li>

        resultList.push(jsxEl)
    }

    return resultList
}

const Sketch = () => {
    const id = useId()

    const [
        scale,
        postsCount,
        resizeSketch,
        selectedPost,
        currentBorder,
        setBorder,
        getSiblingBorder,
        fireError
    ] = useStore(state => [
        state.scale,
        state.postsCount,
        state.resizeSketch,
        state.selectedPost,
        state.border,
        state.setBorder,
        state.getSiblingBorder,
        state.fireError
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

    const onSetPostsCount: TOnSetPostsCount = useCallback((evt, newPostNumber) => {
        // If parent Ul is disabled, return
        if (postsListRef.current?.classList.contains(disabled)) return

        const span = evt.target as HTMLSpanElement
        const li = span.parentNode as HTMLLIElement

        // If parent Li is active, return
        if (li.classList.contains(postActive)) return

        // Sent new active post with count of posts as newPostNumber
        if (currentBorder) {
            const newBorder = getSiblingBorder(currentBorder, newPostNumber)

            if (!newBorder) {
                fireError(new Error(`Функция поиска соседних рамок [getSiblingBorder] с количеством постов ${newPostNumber} вернула пустой результат!`))
                return
            }

            setBorder(newBorder, newPostNumber)
        }

    }, [currentBorder, setBorder, getSiblingBorder, fireError])

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