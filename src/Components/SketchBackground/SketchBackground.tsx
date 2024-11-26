import useStore from '../../Store'
import style from './SketchBackground.module.sass'

type TProps = {
    backImgRef: React.MutableRefObject<HTMLImageElement | null>
}

const SketchBackground = ({ backImgRef }: TProps ) => {
    const backgrounds = useStore(state => state.backgrounds)
    const activeBackground = backgrounds.filter((background) => background.selected)

    return (
        <span className={style.sketchBackground}>
            { activeBackground.length > 0 &&
                <img ref={backImgRef} src={activeBackground[0].image} alt="" />
            }
        </span>
    )
}

export default SketchBackground