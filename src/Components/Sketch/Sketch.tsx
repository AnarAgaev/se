import { useRef, useMemo, useCallback, useId } from 'react'
import { SketchBackground, DeviceList, SketchSaver } from '../../Components'
import { TDirections, TBorder, TNumberOfPosts, TGetFamilyBorders } from '../../types'
import useStore from '../../Store'
import style from './Sketch.module.sass'

type TOnSetPostsCount = (
    evt: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    newPostNumber: number,
    direction: TDirections
) => void

const { sketch, construction, posts, directions, horizontal, vertical, save,
    controllers, trash, minus, plus, disabled, set, wrap, placeholder,
    container, postActive, directionActive, loader, containerVertical,
    post_1, post_2, post_3, post_4, post_5, borderImg } = style

const createPosts = (
    id: string,
    postsCount: number,
    selectedPost: boolean[],
    onSetPostsCount: TOnSetPostsCount,
    direction: TDirections,
    selectedBorder: TBorder | null,
    getFamilyBorders: TGetFamilyBorders
): JSX.Element[] => {

    const resultList: JSX.Element[] = []

    const wordForm: Record<number, string> = {
        1: 'пост',
        2: 'поста',
        3: 'поста',
        4: 'поста',
        5: 'постов',
    }

    const familyBordersSpots = selectedBorder
        ? Array.from(new Set(getFamilyBorders(selectedBorder).flatMap(b => b.number_of_posts)))
        : []

    for (let i = 1; i <= (!selectedBorder ? 5 : postsCount); i++) {
        const jsxEl = !selectedPost.length
            ? <li key={`post-${id}-${i}`}><span>{i}</span></li>
            : <li key={`post-${id}-${i}`} className={selectedPost[i - 1] ? postActive : ''}>
                <span onClick={e => onSetPostsCount(e, i, direction)} title={`Выбрать рамку на ${i} ${wordForm[i]}`}>{i}</span>
            </li>

        if (selectedBorder) {
            if (familyBordersSpots.includes(i.toString())) resultList.push(jsxEl)
        } else {
            resultList.push(jsxEl)
        }
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
        visible,
        resetProject,
        resetRoom,
        resetCountOfSets,
        removeSingleBordersFilter,
        removeSingleDevicesFilter,
        resetEditConfiguration,
        resetBackground,
        getFamilyBorders
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
        state.visible,
        state.resetProject,
        state.resetRoom,
        state.resetCountOfSets,
        state.removeSingleBordersFilter,
        state.removeSingleDevicesFilter,
        state.resetEditConfiguration,
        state.resetBackground,
        state.getFamilyBorders
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

    const onInc = () => { // +
        if (scale >= 1.5) return
        resizeSketch(1)
    }

    const onDec = () => { // -
        if (scale <= 0.5) return
        resizeSketch(-1)
    }

    const onSetDirection = useCallback((d: TDirections) => {
        // Если еще не выбирали ни одной рамки, то direction равно disabled - выходим
        if (directionsRef.current?.classList.contains(disabled)) return

        // Если полученное функцией ориентация равна текущей - выходим
        if (direction === d) return

        // При изменении ориентации, проверяем есть ли для выбранной
        // рамки соседняя, но в новой (выбранной) ориентации

        let currentPostNumber = selectedPost.findIndex(Boolean)
        currentPostNumber = currentPostNumber === -1 ? 1 : currentPostNumber + 1

        if (selectedBorder) {
            const newBorder = getSiblingBorder(selectedBorder, currentPostNumber, d)

            setBorder(newBorder as TBorder, currentPostNumber as TNumberOfPosts, postsCount, d )
        }
    }, [direction, selectedBorder, selectedPost, postsCount, getSiblingBorder, setBorder])

    const onSetPostsCount: TOnSetPostsCount = useCallback((evt, newPostNumber, direction) => {
        // Если у родителя есть класс disabled (еще не выбрали ни одной рамки), выходим
        if (postsListRef.current?.classList.contains(disabled)) return

        const span = evt.target as HTMLSpanElement
        const li = span.parentNode as HTMLLIElement

        // Если кликнули по активному количеству постов (у родителя есть класс postActive), выходим
        if (li.classList.contains(postActive)) return

        // Выставляем новое количество постов с учетом ориентации
        if (selectedBorder) {
            // getSiblingBorder отдает пост с учетом ориентации
            const newBorder = getSiblingBorder(selectedBorder, newPostNumber, direction)

            console.log('newBorder', newBorder)

            // if (!newBorder) {
            //     fireError(new Error(`Функция поиска соседних рамок [getSiblingBorder] с количеством постов ${newPostNumber} вернула пустой результат!`))
            //     return
            // }

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
        () => createPosts(id, postsCount, selectedPost, onSetPostsCount, direction, selectedBorder, getFamilyBorders),
        [id, postsCount, selectedPost, onSetPostsCount, direction, selectedBorder, getFamilyBorders]
    )

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

    const containerClassMap: {
        [key: number]: string
    } = {
        0: '',
        1: post_1,
        2: post_2,
        3: post_3,
        4: post_4,
        5: post_5,
    }
    const countOfPost: number = selectedPost.findIndex(Boolean) + 1
    const containerClass = `${container}${countOfPost === 0 ? ` ${post_1}` : ` ${containerClassMap[countOfPost]}`}${direction === 'horizontal' ? '' : ` ${containerVertical}`}`

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
                    { !selectedBorder && visible && <span className={placeholder}></span> }

                    <div className={containerClass}
                        style={{
                            opacity: visible ? '1' : '0',
                            transform: `translate(-50%, -50%) rotate(${direction ==='horizontal' ? '0' : '90deg'})`
                        }}>
                        { selectedBorder && <img
                            className={borderImg}
                            ref={borderRef}
                            src={selectedBorder.image} alt={selectedBorder.name} />
                        }
                        { isDeviceSelected && <DeviceList listRef={listRef}/> }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sketch