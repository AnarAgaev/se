import { SketchBackground } from '../../Components'
import style from './Sketch.module.sass'

const { sketch, construction, posts, directions, horizontal, vertical, cloud,
    controllers, cart, minus, plus, device } = style

const Sketch = () => {
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
                <li className={minus}></li>
                <li className={plus}></li>
            </ul>
            <div className={device}></div>
        </div>
    )
}

export default Sketch