import { useRef, useMemo, useCallback, useId, useState, useEffect } from 'react'
import { SketchBackground, DeviceList, SketchSaver } from '../../Components'
import { TDirections } from '../../types'
import useStore from '../../Store'
import style from './Sketch.module.sass'

type TOnSetPostsCount = (
    evt: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    newPostNumber: number
) => void

const { sketch, construction, posts, directions, horizontal, vertical, save,
    controllers, trash, minus, plus, disabled, set, wrap, placeholder,
    container, deviceContainer, postActive, directionActive, loader } = style

const createPosts = (
    id: string,
    postsCount: number,
    selectedPost: boolean[],
    onSetPostsCount: TOnSetPostsCount,
): JSX.Element[] => {

    const resultList: JSX.Element[] = []

    const wordForm: Record<number, string> = {
        1: 'пост',
        2: 'поста',
        3: 'поста',
        4: 'поста',
        5: 'постов',
    }

    for (let i = 1; i <= (!selectedPost.length ? 5 : postsCount); i++) {
        const jsxEl = !selectedPost.length
            ? <li key={`post-${id}-${i}`}><span>{i}</span></li>
            : <li key={`post-${id}-${i}`} className={selectedPost[i - 1] ? postActive : ''}>
                <span onClick={e => onSetPostsCount(e, i)} title={`Выбрать рамку на ${i} ${wordForm[i]}`}>{i}</span>
            </li>

        resultList.push(jsxEl)
    }

    return resultList
}

const Sketch = () => {
    const id = useId()

    // #region Variables
    const [
        scale,
        postsCount,
        resizeSketch,
        selectedPost,
        selectedBorder,
        setBorder,
        getSiblingBorder,
        fireError,
        resetSketch,
        deviceList,
        checkDevices,
        direction,
        setDirection,
        visible,
        setVisible,
        resetProject,
        resetRoom,
        resetCountOfSets,
        removeSingleBordersFilter,
        removeSingleDevicesFilter,
        resetEditConfiguration,
        resetBackground
    ] = useStore(state => [
        state.scale,
        state.postsCount,
        state.resizeSketch,
        state.selectedPost,
        state.border,
        state.setBorder,
        state.getSiblingBorder,
        state.fireError,
        state.resetSketch,
        state.deviceList,
        state.checkDevices,
        state.direction,
        state.setDirection,
        state.visible,
        state.setVisible,
        state.resetProject,
        state.resetRoom,
        state.resetCountOfSets,
        state.removeSingleBordersFilter,
        state.removeSingleDevicesFilter,
        state.resetEditConfiguration,
        state.resetBackground
    ])
    // #endregion

    const sketchRef = useRef<HTMLDivElement | null>(null)
    const backImgRef = useRef<HTMLImageElement | null>(null)
    const borderRef = useRef<HTMLImageElement | null>(null)
    const listRef = useRef<HTMLUListElement | null>(null)

    const postsListRef = useRef<HTMLUListElement | null>(null)
    const directionsRef = useRef<HTMLUListElement | null>(null)

    const isDeviceSelected = checkDevices()

    const transformStyle = {
        transform: `scale(${scale})`,
        transformOrigin: `${scale > 1 ? '0 0' : 'center'}`
    }

    const [shouldUpdate, setShouldUpdate] = useState(false)
    const [maxWidth, setMaxWidth] = useState('none')

    useEffect(
        () => {
            const updateMaxWidth = () => {
                if (!selectedBorder?.number_of_posts) {
                    setMaxWidth('none')
                    return
                }

                const calculatedHeight = selectedBorder?.number_of_posts[0] === '1'
                    ? sketchRef.current?.offsetHeight
                    : direction === 'horizontal'
                        ? sketchRef.current?.offsetWidth
                        : sketchRef.current?.offsetHeight

                const ration: number | undefined = selectedBorder?.number_of_posts[0] === '1'
                    ? 0.55
                    : 0.8

                if (calculatedHeight && ration) {
                    setMaxWidth(calculatedHeight * ration + 'px')
                }
            }

            updateMaxWidth()

            window.addEventListener('resize', updateMaxWidth)

            return () => window.removeEventListener('resize', updateMaxWidth)
        },
        [maxWidth, direction, selectedBorder]
    )

    const onInc = () => { // +
        if (scale >= 1.5) return
        resizeSketch(1)
    }

    const onDec = () => { // -
        if (scale <= 0.5) return
        resizeSketch(-1)
    }

    // const onSetDirection = useCallback((e: React.ChangeEvent<HTMLLIElement>) => {
    const onSetDirection = useCallback((d: TDirections) => {
        if (directionsRef.current?.classList.contains(disabled)) return

        if (direction === d) return

        setDirection(d)
    }, [direction, setDirection])

    const onSetPostsCount: TOnSetPostsCount = useCallback((evt, newPostNumber) => {
        // If parent Ul is disabled, return
        if (postsListRef.current?.classList.contains(disabled)) return

        const span = evt.target as HTMLSpanElement
        const li = span.parentNode as HTMLLIElement

        // If parent Li is active, return
        if (li.classList.contains(postActive)) return

        // Sent a new active post with count of posts as newPostNumber
        if (selectedBorder) {
            const newBorder = getSiblingBorder(selectedBorder, newPostNumber)

            if (!newBorder) {
                fireError(new Error(`Функция поиска соседних рамок [getSiblingBorder] с количеством постов ${newPostNumber} вернула пустой результат!`))
                return
            }

            if (newPostNumber === 1
                    || newPostNumber === 2
                    || newPostNumber === 3
                    || newPostNumber === 4
                    || newPostNumber === 5) {

                setBorder(newBorder, newPostNumber)
            }
        }
    }, [selectedBorder, setBorder, getSiblingBorder, fireError])

    const postList = useMemo(
        () => createPosts(id, postsCount, selectedPost, onSetPostsCount),
        [id, postsCount, selectedPost, onSetPostsCount]
    )

    const onLoad = () => {
        setShouldUpdate(!shouldUpdate)
        setTimeout(() => setVisible(true), 500)
    }

    const onReset = () => {
        resetSketch()
        resetProject()
        resetRoom()
        resetCountOfSets()

        // Reset selected Brand and Collection
        removeSingleBordersFilter('brand')
        removeSingleBordersFilter('collection')
        removeSingleDevicesFilter('brand')
        removeSingleDevicesFilter('collection')

        // Reset Edited configuration help text
        resetEditConfiguration()

        // Reset selected background
        resetBackground()
    }

    return (
        <div ref={sketchRef} className={sketch}>
            <SketchBackground backImgRef={backImgRef}/>
            <span className={loader} style={{opacity: visible ? 0 : 1}}></span>

            {/* Count of posts and Direction */}
            <div className={construction}>
                {/* Counts */}
                <ul ref={postsListRef}
                    className={selectedPost.length ? posts : `${posts} ${disabled}`}>
                    { postList }
                </ul>

                {/* Directions */}
                <ul ref={directionsRef} className={
                        selectedPost.length > 2 && !selectedPost[0]
                            ? directions
                            : `${directions} ${disabled}`
                        }>

                    <li title="Выбрать горизонтальное направление"
                        onClick={() => onSetDirection('horizontal')} className={
                        direction === 'horizontal' && selectedPost.length > 2 && !selectedPost[0]
                            ? directionActive
                            : ''
                    }>
                        <i className={horizontal}></i>
                    </li>

                    <li title="Выбрать вертикальное направление"
                        onClick={() => onSetDirection('vertical')} className={
                        direction === 'vertical' && selectedPost.length > 2 && !selectedPost[0]
                            ? directionActive
                            : ''
                    }>
                        <i className={vertical}></i>
                    </li>

                </ul>
            </div>


            {/* Save image */}
            <div className={`${save} ${!selectedBorder ? disabled : ''}`}
                title="Сохранить эскиз">
                <SketchSaver
                    sketchRef={sketchRef}
                    backImgRef={backImgRef}
                    borderRef={borderRef}
                    listRef={listRef} />
            </div>


            {/* Delete, Inc, Dec  */}
            <ul className={
                    selectedPost.length || Object.keys(deviceList).length
                        ? controllers
                        : `${controllers} ${disabled}`
                    }>
                <li className={trash} onClick={onReset} title="Очистить эскиз"></li>
                <li className={scale <= 0.5 ? `${minus} ${disabled}` : minus} onClick={onDec} title="Уменьшить масштаб"></li>
                <li className={scale >= 1.5 ? `${plus} ${disabled}` : plus} onClick={onInc} title="Увеличить масштаб"></li>
            </ul>


            {/* Image Border and Devices */}
            <div className={set}>
                <div className={wrap} style={transformStyle}>
                    {/* { !selectedBorder && !isDeviceSelected && visible && <span className={placeholder}></span> } */}
                    { !selectedBorder && visible && <span className={placeholder}></span> }

                    <div style={{
                            opacity: visible ? '1' : '0',
                            transform: `translate(-50%, -50%) rotate(${direction ==='horizontal' ? '0' : '90deg'})`
                        }} className={`${container} ${!selectedBorder && isDeviceSelected ? deviceContainer : ''}`} >
                        { selectedBorder && <img
                            ref={borderRef}
                            onLoad={onLoad}
                            style={{maxWidth: maxWidth}}
                            src={selectedBorder.image} alt={selectedBorder.name} />
                        }
                        { isDeviceSelected && <DeviceList shouldUpdate={shouldUpdate} listRef={listRef}/> }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sketch