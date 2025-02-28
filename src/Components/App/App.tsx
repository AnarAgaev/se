import { useEffect, Suspense, lazy } from 'react'
import { getParameterByNameFromUrlLink } from '../../Helpers'
import useStore from '../../Store'
import style from './App.module.sass'
import '../../Sass/main.sass'

// Learning imports
import { Steps } from 'intro.js-react'
import { steps } from '../../Helpers'
import 'intro.js/introjs.css'

import { Loading, Loader, Tabs, Factory, Viewport, ModalResetBrandOrCollection,
	ModalWarning, ModalMessage, ModalShare, ModalLoadProject, ModalCopyConfiguration,
	ModalAddConfiguration, ModalSaveConfiguration, ModalResetSketch, ModalSavePDF,
	Warning } from '../../Components'

const PdfDocument = lazy(() => import('../PdfDocument/PdfDocument'))

const { app, caption, body } = style

const App = () => {

	// #region Variables
	const [
		requestInitData,
		loading,
		error,
		modalSelectVisible,
		modalWarningVisible,
		modalMessageVisible,
		modalShareVisible,
		modalLoadProjectVisible,
		modalCopyConfigurationVisible,
		modalAddConfigurationVisible,
		modalSaveConfigurationVisible,
		modalResetSketchVisible,
		downloadProjectAsPdf,
		downloadProjectBlobUrl,
		loadProject,
		showLearning,
		setShowLearning,
	] = useStore(state => [
		state.requestInitData,
		state.loading,
		state.error,
		state.modalSelectVisible,
		state.modalWarningVisible,
		state.modalMessageVisible,
		state.modalShareVisible,
		state.modalLoadProjectVisible,
		state.modalCopyConfigurationVisible,
		state.modalAddConfigurationVisible,
		state.modalSaveConfigurationVisible,
		state.modalResetSketchVisible,
		state.downloadProjectAsPdf,
		state.downloadProjectBlobUrl,
		state.loadProject,
		state.showLearning,
		state.setShowLearning,
	])
	// #endregion

	if (error !== null) {
		throw new Error(`${error ? error : ''}`)
	}

	useEffect(() => {
		requestInitData()

		// Если в url есть токе проекта, сразу после инициализации загружаем проект
		const projectToken = getParameterByNameFromUrlLink('share')

		if (projectToken) {
			loadProject(projectToken)
		}

	}, [requestInitData, loadProject])

	return (
		<>
			<Steps
				enabled={showLearning} // показываем обучалку или нет

				steps={steps}

				initialStep={0} // с какого шага начинаем

				onExit={() => { // коллбэк стреляет при завершении обучения
					setShowLearning(false)
				}}

				options={{
					prevLabel: 'Назад',
					nextLabel: 'Вперед',
					doneLabel: 'Закрыть',
					hidePrev: true,
				}}
			/>

			<section className={`se-app ${app}`}>
				{ loading
					? <Loader text='Загружаем конфигуратор' />
					: <>
						<Warning />
						<h1 className={caption}>
							Конфигуратор
							<button onClick={() => setShowLearning(true)}>Запустить обучалку</button>
						</h1>
						<Tabs />
						<div className={body}>
							<Factory />
							<Viewport />
						</div>
					</>
				}
				<ModalResetBrandOrCollection visible={modalSelectVisible} />
				<ModalWarning visible={modalWarningVisible} />
				<ModalMessage visible={modalMessageVisible} />
				<ModalShare visible={modalShareVisible} />
				<ModalLoadProject visible={modalLoadProjectVisible} />
				<ModalCopyConfiguration visible={modalCopyConfigurationVisible} />
				<ModalAddConfiguration visible={modalAddConfigurationVisible} />
				<ModalSaveConfiguration visible={modalSaveConfigurationVisible} />
				<ModalResetSketch visible={modalResetSketchVisible} />
				<ModalSavePDF visible={Boolean(downloadProjectAsPdf) && Boolean(downloadProjectBlobUrl)} />

				<Loading />

				<Suspense fallback={
					<Loader text={'Загружаем библиотеку'}
						styles={{
							position: 'fixed',
							top: '50%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
						}} />
					}>
					{ downloadProjectAsPdf && !downloadProjectBlobUrl && <PdfDocument /> }
				</Suspense>
			</section>
		</>
	)
}

export default App