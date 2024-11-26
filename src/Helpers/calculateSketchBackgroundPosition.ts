const calculateSketchBackgroundPosition = (canvas: HTMLCanvasElement, img: HTMLImageElement)
	: [number, number, number, number] => {

	const canvasRatio = canvas.width / canvas.height
	const imgRatio = img.width / img.height

	let posX = 0
	let posY = 0
	let imgWidth = 0
	let imgHeight = 0

	/*
	* Если соотношение сторон контейнера больше, чем соотношение сторон картинки,
	* то устанавливаем высоту картинки равной высоте контейнера и вычисляем
	* ширину картинки по соотношению сторон.
	*
	* Иначе устанавливаем ширину картинки равной ширине контейнера и
	* вычисляем высоту картинки по соотношению сторон.
	*
	* Позиции по оси X и Y рассчитываем, как половина дельты между
	* соответствующими сторонами канваса и картинки
	*/

	if (canvasRatio < imgRatio) {
		imgHeight = canvas.height
		imgWidth = imgHeight * imgRatio
		posX = (canvas.width - imgWidth) / 2
	} else {
		imgWidth = canvas.width
		imgHeight = imgWidth / imgRatio
		posY = (canvas.height - imgHeight) / 2
	}

	return [posX, posY, imgWidth, imgHeight]
}

export default calculateSketchBackgroundPosition
