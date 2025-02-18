import { useEffect, Suspense, lazy } from 'react'
import useStore from '../../Store'
import style from './App.module.sass'
import '../../Sass/main.sass'

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
		downloadProjectBlobUrl
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
		state.downloadProjectBlobUrl
	])
	// #endregion

	if (error !== null) {
		throw new Error(`${error ? error : ''}`)
	}

	useEffect(() => {
		requestInitData()
	}, [requestInitData])

	return (
		<section className={`se-app ${app}`}>
			{ loading
				? <Loader text='Загружаем конфигуратор' />
				: <>
					<Warning />
					<h1 className={caption}>
						Конфигуратор
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
	)
}

export default App