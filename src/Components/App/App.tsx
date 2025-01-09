import { useEffect } from 'react'
import useStore from '../../Store'
import style from './App.module.sass'
import '../../Sass/main.sass'

import { Loading, Loader, Tabs, Factory, Viewport, ModalResetBrandOrCollection,
	ModalWarning, ModalMessage, ModalShare, ModalLoadProject,
	ModalCopyConfiguration, ModalAddConfiguration } from '../../Components'

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
		modalAddConfigurationVisible
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
		state.modalAddConfigurationVisible
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
				? <Loader />
				: <>
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
			<Loading />
		</section>
	)
}

export default App