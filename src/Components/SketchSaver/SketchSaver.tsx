import { calculateSketchBackgroundPosition } from '../../Helpers'
import style from './SketchSaver.module.sass'

const _DEFAULT_BACKGROUND_SRC = 'https://aws.massive.ru/sew/img/background-default.svg'

type TProps = {
    sketchRef: React.MutableRefObject<HTMLDivElement | null>
    backImgRef: React.MutableRefObject<HTMLImageElement | null>
}

type Canvas = {
	canvas: HTMLCanvasElement | null,
	context: CanvasRenderingContext2D,
	loaded: boolean
}

const SketchSaver = ({ sketchRef, backImgRef }: TProps) => {

    const sketchWorkspace: {
		background?: Canvas | null,
		[key: number]: Canvas
	} = {}

    const addBackToWorkspace = (width: number, height: number, back: HTMLImageElement | null) => {
		sketchWorkspace.background = createCanvas(width, height)

        const backImg = new Image()
        backImg.src = !back ? _DEFAULT_BACKGROUND_SRC : back.src
        backImg.crossOrigin = 'anonymous'

        backImg.onload = () => {
            if (!back) {
                if (sketchWorkspace.background?.canvas) {
                    for (let x = 0; x < width; x += 40) {
                        for (let y = 0; y < height; y += 40) {
                            sketchWorkspace.background.context.drawImage(backImg, x, y, 40, 40)
                        }
                    }
                    sketchWorkspace.background.loaded = true
                }
                return
            }

            // Если пользователь выбрал свою картинку фона
            let posSketchX: number, posSketchY: number, sketchWidth: number, sketchHeight: number

            if (sketchWorkspace.background?.canvas) {
                [
                    posSketchX, posSketchY, sketchWidth, sketchHeight
                ] = calculateSketchBackgroundPosition(
                    sketchWorkspace.background.canvas, backImg
                )

                sketchWorkspace.background?.context.drawImage(backImg, posSketchX, posSketchY, sketchWidth, sketchHeight)
                sketchWorkspace.background.loaded = true
            }
        }
	}

    const createCanvas = (width: number, height: number) => {
		const canvas = document.createElement('canvas')
		canvas.width = width
		canvas.height = height
		const ctx = canvas.getContext('2d')
		if (!ctx) return null
		return { canvas: canvas, context: ctx, loaded: false }
	}

    const handleSave = async () => {

        // Image sizes
		if (!sketchRef.current) return

		const resImgWidth = sketchRef.current.offsetWidth
		const resImgHeight = sketchRef.current.offsetHeight

		// Создаем canvas с картинкой фона
		addBackToWorkspace(resImgWidth, resImgHeight, backImgRef?.current)

		// Рисуем картинки продуктов, каждую на своем canvas
		// addPicCanvasesToWorkspace(resultImgWidth, resultImgHeight, imgRefs)

		// Циклически проверяем загрузку всех картинок. Если ок, то скачиваем примерку
		const intervalId = setInterval(() => {
            const isLoaded = checkLoadedWorkspace()
			if (isLoaded) {
				clearInterval(intervalId)
				downloadFinalPicture(resImgWidth, resImgHeight)
			}
		}, 100)
	}

    const checkLoadedWorkspace = () => {
		for (const key in sketchWorkspace) {
			if (!sketchWorkspace[key].loaded) return false
		}
		return true
	}

    const downloadFinalPicture = (width: number, height: number) => {

        // Объединяем все, созданные ранее, canvas в единый
		const combinedCanvas = document.createElement('canvas')
		combinedCanvas.width = width
		combinedCanvas.height = height
		const combinedCtx = combinedCanvas.getContext('2d')

        if (!combinedCtx) return

		// Добавляем картинку фона
		if (sketchWorkspace.background?.canvas) {
			combinedCtx.drawImage(sketchWorkspace.background.canvas, 0, 0)
		}

		// // Добавляем картинки продуктов
		// for (const idx in imgRefs) {
		// 	if (products[idx].visibility && canvasWorkspace[idx]?.canvas) {
		// 		combinedCtx.drawImage(canvasWorkspace[idx].canvas, 0, 0)
		// 	}
		// }

		// Сохраняем финальную картинку на клиенте
		const imgBase64 = combinedCanvas.toDataURL('image/png')
		const link = document.createElement('a')
		link.download = 'electric-config.png'
		link.href = "data:image/" + imgBase64
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}

    return (
        <button className={style.button} onClick={handleSave}>
            <i></i>
        </button>
    )
}

export default SketchSaver