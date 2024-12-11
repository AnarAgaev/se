import { useEffect } from 'react'
import useStore from '../../Store'
import style from './App.module.sass'
import '../../Sass/main.sass'

import { Loading, Loader, Tabs, Factory, Viewport, ModalSelect,
	ModalWarning, ModalMessage, ModalShare, ModalLoadProject } from '../../Components'

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
	] = useStore(state => [
		state.requestInitData,
		state.loading,
		state.error,
		state.modalSelectVisible,
		state.modalWarningVisible,
		state.modalMessageVisible,
		state.modalShareVisible,
		state.modalLoadProjectVisible,
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
			<ModalSelect visible={modalSelectVisible} />
			<ModalWarning visible={modalWarningVisible} />
			<ModalMessage visible={modalMessageVisible} />
			<ModalShare visible={modalShareVisible} />
			<ModalLoadProject visible={modalLoadProjectVisible} />
			<Loading />
		</section>
	)
}

export default App