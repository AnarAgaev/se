import { IntroJs } from 'intro.js/src/intro'
import { TAppStore } from '../types'

export const steps = [

// 1
	{
		element: '#step_0',
		title: 'Конфигуратор рамок и механизмов',
		intro: 'Здесь можно собрать конфигурацию, посмотреть как она будет выглядеть, сохранить в проект или сразу купить.',
	},

// 2
	{
		element: '#step_1',
		title: 'Рамки',
		intro: 'Кликните на Рамки и перейдите к выбору.',
	},

// 3
	{
		element: '#step_2',
		title: 'Список рамок и фильтры',
		intro: 'Выберите рамки для конфигурации, используя фильтры.',
	},

// 4
	{
		element: '#step_3',
		title: 'Механизмы',
		intro: 'Кликните на Механизмы и перейдите к выбору.',
	},

// 5
	{
		element: '#step_2',
		title: 'Список механизмов и фильтры',
		intro: 'Выберите один или несколько механизмов, используя фильтры.',
	},

// 6
	{
		element: '#step_4',
		title: 'Фон',
		intro: 'Выберите фон для холста или загрузить свою картинку для обоев.',
	},

// 7
	{
		element: '#step_2',
		title: 'Список обоев',
		intro: 'Выберите фон, кликнув по одному из рисунков. Чтобы добавить свой фон, выберите картинку на своем устройстве.',
	},

// 8
	{
		element: '#step_5',
		title: 'Холст',
		intro: 'Кликните по цифрам, чтобы изменить количество постов. Используйте дополнительные кнопки управления для изменения масштаба или удаления.',
	},

// 9
	{
		element: '#step_6',
		title: 'Сохранить проект',
		intro: 'Создайте проект и сохраните конфигурацию, выбрав помещение. Измените количество комплектов.',
	},

// 10
	{
		element: '#step_7',
		title: 'Состав комплекта',
		intro: 'Добавьте рамку, механизм или весь комплект в Корзину.',
	},

// 11
	{
		element: '#step_8',
		title: 'Мои проекты',
		intro: 'Список всех локальных проектов и проектов, сохраненных в вашем Личном кабинете.',
	},

// 12
	{
		element: '#step_9',
		title: 'Проект',
		intro: 'Название проекта и его уникальный идентификатор. Управление проектом с помощью кнопок.',
	},

// 13
	{
		element: '#step_10',
		intro: 'Редактировать проект',
	},

// 14
	{
		element: '#step_11',
		intro: 'Поделиться проектом',
	},

// 15
	{
		element: '#step_12',
		intro: 'Скачать в PDF',
	},

// 16
	{
		element: '#step_13',
		intro: 'Удалить проект.',
	},

// 17
	{
		element: '#step_14',
		title: 'Создать новый проект',
		intro: 'Введите имя проекта.',
	},

// 18
	{
		element: '#step_15',
		title: 'Загрузить по ссылке',
		intro: 'Добавьте ссылку на проект',
	},

// 19
	{
		element: '#step_16',
		title: 'Состав проекта',
		intro: 'Детальная информация по проекту: рамка или устройства, количество комплектов. Управление конфигурацией с помощью кнопок.',
	},

// 20
	{
		element: '#step_17',
		intro: 'Название проекта',
	},

// 21
	{
		element: '#step_18',
		title: 'Название помещения',
		intro: 'Помещение, в котором находится комплект. В одном проекте может быть несколько помещений.',
	},

// 22
	{
		element: '#step_19',
		title: 'Управление проектом',
		intro: 'Управление проектом с помощью кнопок.',
	},

// 23
	{
		element: '#step_20',
		title: 'Итого по проекту',
		intro: 'Итоговая стоимость всего проекта. Добавьте весь проект в корзину.',
	},

// 24
	{
		element: '#step_21',
		title: 'Комплект подробно',
		intro: 'Информация по комплекту. Состав комплектующих, их количество и стоимость. Управление комплектом с помощью кнопок.',
	},

// 25
	{
		element: '#step_22',
		title: 'Управление комплектом.',
		intro: 'С помощью кнопок редактируйте комплект, переносите, копируйте в другой проект или помещение, удаляйте комплект из проекта.',
	},

// 26
	{
		element: '#step_23',
		title: 'Количество комплектов',
		intro: 'Измените количество комплектов.',
	},

// 27
	{
		element: '#step_24',
		title: 'Обучение',
		intro: 'В любой момент запустите обучение.',
	},
]

type TOnSteps = {
	stepNumber: number
	htmlNode: HTMLElement
	setActiveViewportTab: TAppStore['setActiveViewportTab']
	setActiveCalcTab: TAppStore['setActiveCalcTab']
	updateStepElement: ((stepIndex: number) => void) | undefined,
	introJs: IntroJs
}

const scrollToStart = (htmlNode: HTMLElement | null) => {
	if (htmlNode) {
		htmlNode.scrollLeft = htmlNode.scrollWidth - htmlNode.clientWidth
	}
}

const scrollToEnd = (htmlNode: HTMLElement | null) => {
	if (htmlNode) {
		htmlNode.scrollTo({ left: 0 })
	}
}

export const onSteps = ({
	stepNumber,
	// htmlNode,
	setActiveViewportTab,
	setActiveCalcTab,
	updateStepElement,
	introJs
}: TOnSteps) => {

	// На каждом шаге с задержкой переинициализируем шаги
	if (updateStepElement) {
		setTimeout(() => {
			for (let i = 0; i < introJs._options.steps.length; i++) {
				updateStepElement(i)
			}
		}, 300)
	}

	if (introJs._direction === 'backward' && stepNumber === 9) {
		setActiveViewportTab('configurator')
		setActiveCalcTab('borders')

		setTimeout(() => {
			introJs.goToStep(1)
		}, 30)

		return
	}

	if (introJs._direction === 'backward' && stepNumber === 17) {
		setActiveViewportTab('hub')

		setTimeout(() => {
			introJs.goToStep(11)
		}, 30)

		return
	}

	if (stepNumber === 3) {
		setActiveCalcTab('devices')
		return
	}

	if (stepNumber === 5 || stepNumber === 6) {
		setActiveCalcTab('backgrounds')
		return
	}

	if (stepNumber === 7) {
		setActiveCalcTab('devices')
		return
	}

	if (stepNumber === 10) {
		setActiveViewportTab('hub')
		scrollToStart(document.getElementById('tabsPages'))
		return
	}

	if (stepNumber === 11 || stepNumber === 9 || stepNumber === 0) {
		scrollToEnd(document.getElementById('tabsPages'))
		return
	}

	if (stepNumber === 18) {
		setActiveViewportTab('project')
		return
	}

	if (stepNumber === 25) {
		scrollToStart(document.getElementById('step_21'))
		return
	}

	if (stepNumber === 26 || stepNumber === 24) {
		scrollToEnd(document.getElementById('step_21'))
		return
	}

}