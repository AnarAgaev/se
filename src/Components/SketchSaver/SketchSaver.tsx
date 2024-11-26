import { calculateSketchBackgroundPosition } from '../../Helpers'
import useStore from '../../Store'
import style from './SketchSaver.module.sass'

const _DEFAULT_BACKGROUND_SRC = 'https://aws.massive.ru/sew/img/background-default.svg'

type TProps = {
    sketchRef: React.MutableRefObject<HTMLDivElement | null>
    backImgRef: React.MutableRefObject<HTMLImageElement | null>
    borderRef: React.MutableRefObject<HTMLImageElement | null>
}

type TCanvas = {
	canvas: HTMLCanvasElement | null,
	context: CanvasRenderingContext2D,
	loaded: boolean
}

const sketchWorkspace: {
    background?: TCanvas | null,
    border?: TCanvas | null,
    [key: number]: TCanvas
} = {}

const createCanvas = (width: number, height: number) => {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    return { canvas: canvas, context: ctx, loaded: false }
}

const checkLoadedWorkspace = () => {
    for (const key in sketchWorkspace) {
        if (!sketchWorkspace[key].loaded) return false
    }
    return true
}

const SketchSaver = ({ sketchRef, backImgRef, borderRef }: TProps) => {

    const direction = useStore(state => state.direction)

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

                sketchWorkspace.background.context.drawImage(backImg, posSketchX, posSketchY, sketchWidth, sketchHeight)
                sketchWorkspace.background.loaded = true
            }
        }
	}

    const addBorderToWorkspace = (width: number, height: number, border: HTMLImageElement | null) => {

        if (!border) return

        // Создаем канвас для видимой картинки
        sketchWorkspace.border = createCanvas(width, height)

        const pic = new Image()
        pic.src = border.src
        pic.crossOrigin = 'anonymous'

        pic.onload = () => {
            const computedStyle = window.getComputedStyle(border)
            const picWidth = parseFloat(computedStyle.width) // ширина рамки
            const picHeight = parseFloat(computedStyle.height) // высота рамки

            // Рисуем рамку на canvas
            if (sketchWorkspace.border?.canvas) {

                // Поворачиваем рамку
                if (direction === 'vertical') {
                    // Смещаем начальную точку в центр изображения
                    sketchWorkspace.border.context.translate(width / 2, height / 2)

                    // Поворачиваем на 90 градусов
                    sketchWorkspace.border.context.rotate(Math.PI / 2)

                    // Рисуем изображение
                    sketchWorkspace.border.context.drawImage(pic, -picWidth / 2, -picHeight / 2, picWidth, picHeight)

                } else {
                    sketchWorkspace.border.context.drawImage(pic, (width - picWidth) / 2, (height - picHeight) / 2, picWidth, picHeight)
                }

                sketchWorkspace.border.loaded = true
            }
        }
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

        // Добавляем картинку рамки
        if (sketchWorkspace.border?.canvas) {
			combinedCtx.drawImage(sketchWorkspace.border.canvas, 0, 0)
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

    const handleSave = async () => {

        // Image sizes
		if (!sketchRef.current) return

		const resImgWidth = sketchRef.current.offsetWidth
		const resImgHeight = sketchRef.current.offsetHeight

		// Создаем canvas с картинкой фона
		addBackToWorkspace(resImgWidth, resImgHeight, backImgRef?.current)

        // Добавляем рамку на canvas
        addBorderToWorkspace(resImgWidth, resImgHeight, borderRef?.current)

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

    return (
        <button className={style.button} onClick={handleSave}>
            <i></i>
        </button>
    )
}

export default SketchSaver