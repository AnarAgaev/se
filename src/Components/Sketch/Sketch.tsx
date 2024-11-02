import { SketchBackground } from '../../Components'
import useStore from '../../Store'
import style from './Sketch.module.sass'

const { sketch, construction, posts, directions, horizontal, vertical, cloud,
    controllers, cart, minus, plus, disabled, set, wrap, border, device } = style

const Sketch = () => {
    const [
        scale,
        resize
    ] = useStore(state => [
        state.scale,
        state.resize
    ])


    const transformStyle = {
        transform: `scale(${scale})`,
        transformOrigin: `${scale > 1 ? '0 0' : 'center'}`
    }

    const onInc = () => { // +
        if (scale >= 1.5) return
        resize(1)
    }

    const onDec = () => { // -
        if (scale <= 0.5) return
        resize(-1)
    }

    return (
        <div className={sketch}>
            <SketchBackground />
            <div className={construction}>
                <ul className={posts}>
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                    <li>4</li>
                    <li>5</li>
                </ul>
                <ul className={directions}>
                    <li><i className={horizontal}></i></li>
                    <li><i className={vertical}></i></li>
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