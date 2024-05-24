import { SketchBackground } from '../../Components'
import style from './Sketch.module.sass'

const Sketch = () => {
    return (
        <div className={style.sketch}>
            <SketchBackground />
        </div>
    )
}

export default Sketch