import { useEffect } from 'react'
import useStore from '../../Store'
import style from './App.module.sass'
import '../../Sass/main.sass'

import { Loading, Loader, Tabs, Factory, Viewport, ModalSelect,
	ModalWarning, ModalMessage, ModalShare } from '../../Components'

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
		dataLoading
	] = useStore(state => [
		state.requestInitData,
		state.loading,
		state.error,
		state.modalSelectVisible,
		state.modalWarningVisible,
		state.modalMessageVisible,
		state.modalShareVisible,
		state.dataLoading
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
					{ modalSelectVisible && <ModalSelect /> }
					{ modalWarningVisible && <ModalWarning /> }
					{ modalMessageVisible && <ModalMessage /> }
					{ modalShareVisible && <ModalShare /> }
				</>
			}
			{ dataLoading && <Loading /> }
		</section>
	)
}

export default App