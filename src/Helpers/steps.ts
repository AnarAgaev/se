import { IntroJs } from 'intro.js/src/intro'
import { TAppStore } from '../types'

export const steps = [
	{
		element: '#step_0',
		title: '👋 Вкладка конфигуратора рамок и механизмов',
		intro: 'Здесь можно собрать нужную конфигурацию, посмотреть как она будет выглядеть, добавить ее в проект или в корзину.',
	},
	{
		element: '#step_1',
		title: 'Вкладка Рамки',
		intro: 'Клик по вкладке Рамки в Конфигураторе позволяет перейти к выбору рамки.',
	},
	{
		element: '#step_2',
		title: 'Список рамок и фильтры к ним',
		intro: 'В этом рабочем пространстве нужно выбрать рамки для конфигурации, а блок с фильтрами поможет сделать это быстрее.',
	},
	{
		element: '#step_3',
		title: 'Вкладка Механизмы',
		intro: 'Клик по вкладке Механизмы позволяет перейти к выбору одного или нескольких механизмов.',
	},
	{
		element: '#step_2',
		title: 'Список механизмов и фильтры к ним',
		intro: 'В этом рабочем пространстве нужно выбрать один или несколько механизмов. Для удобного поиска, можно воспользоваться фильтрами.',
	},
	{
		element: '#step_4',
		title: 'Вкладка Фон',
		intro: 'Во вкладке Фон можно выбрать фон для холста или загрузить свою картинку для обоев.',
	},
	{
		element: '#step_2',
		title: 'Список обоев',
		intro: 'Что бы выбрать один из рисунков, кликните по нему. Чтобы добавить свои обои, кликните Выбрать файл и выберите картинку на своем устройстве.',
	},
	{
		element: '#step_5',
		title: 'Эскиз',
		intro: 'В рабочей области Эскиза отображается текущая конфигурация для которой можно изменить масштаб, направление рамки или скачать. Клик по цифрам позволит изменить количество постов для рамки, а клик по устройству удалит его, что позволит заменить выбранное устройство на другое.',
	},
	{
		element: '#step_6',
		title: 'Сохранить конфигурацию',
		intro: 'В этой рабочей области можно изменить количество необходимых комплектов и добавить созданную конфигурацию в выбранный Проект и Помещение.',
	},
	{
		element: '#step_7',
		title: 'Состав комплекта',
		intro: 'В этой области можно добавить выбранную рамку, устройства или весь комплект в Корзину',
	},
	{
		element: '#step_8',
		title: 'Вкладка Мои проекты',
		intro: 'Во вкладке Мои проекты находится список всех локальных проектов и проектов, сохраненных в аккаунте.',
	},
	{
		element: '#step_9',
		title: 'Отдельный проект в списке',
		intro: 'Здесь краткая информация о проекте. Его имя и уникальный номер, а также кнопки быстрого управления проектом.',
	},
	{
		element: '#step_10',
		intro: 'Посмотреть проект детально.'
	},
	{
		element: '#step_11',
		intro: 'Получить ссылку на проект. Ссылкой можно поделиться в соц. сетях или отправить по почте.'
	},
	{
		element: '#step_12',
		intro: 'Скачать детальную информацию о проекте в PDF файле.'
	},
	{
		element: '#step_13',
		intro: 'Удалить проект.'
	},
	{
		element: '#step_14',
		title: 'Создать новый проект',
		intro: 'Для того чтобы создать новый проект, напишите его имя в поле ввода и кликните на галочку справа.'
	},
	{
		element: '#step_15',
		title: 'Загрузить чужой проект себе',
		intro: 'Для того чтобы добавить к себе в рабочее пространство сторонний проект, добавьте ссылку на проект в появившейся форме и кликните Применить.'
	},
	{
		element: '#step_16',
		title: 'Вкладка Состав проекта',
		intro: 'Во вкладке Состав проекта находится детальная информация по выбранному проекту. Выбранная рамка или устройства, количество комплектов и кнопки управления отдельной конфигурацией.',
	},
	{
		element: '#step_17',
		title: 'Наименование проекта',
		intro: 'Под этим именем текущий проект хранится в Базе данных и отражается в списке выбора проекта'
	},
	{
		element: '#step_18',
		title: 'Наименование помещения',
		intro: 'Имя помещения в котором находится конкретный комплект. В одном проекте может быть несколько помещений.'
	},
	{
		element: '#step_19',
		title: 'Управление проектом',
		intro: 'Функционал кнопок управления проектом идентичен кнопкам отдельного проекта в списке проектов на вкладке Мои проекты.'
	},
	{
		element: '#step_20',
		title: 'Итого по проекту',
		intro: 'В этом блоке можно посмотреть итоговую стоимость всего проекта и добавить сразу весь проект в корзину.'
	},
	{
		element: '#step_21',
		title: 'Комплект подробно',
		intro: 'В этом блоке находится вся информация по отдельному комплекту. Состав комплекта, входящие в его состав механизмы, их количество и стоимость. А также кнопки управления отдельной конфигурацией.'
	},
	{
		element: '#step_22',
		title: 'Управление комплектом',
		intro: 'Кнопки управления позволяют удалить комплект из текущего проекта, скопировать или перенести комплект в другой проект или другое помещение. Клик по кнопке изменить откроет текущий комплект в конфигураторе для редактирования.'
	},
	{
		element: '#step_23',
		title: 'Количество комплектов',
		intro: 'С помощью калькулятора можно быстро изменить количество комплектов в текущем помещении.'
	},
	{
		element: '#step_24',
		title: 'Показать обучение',
		intro: 'Если что-то забудете, всегда можно посмотреть обучение, кликнув по этой кнопке.'
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