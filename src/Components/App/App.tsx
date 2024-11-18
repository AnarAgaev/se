import { useEffect } from 'react'
import { Loader, Tabs, Factory, Viewport, ModalSelect, ModalWarning } from '../../Components'
import useStore from '../../Store'
import style from './App.module.sass'
import '../../Sass/main.sass'

const { app, caption, body } = style

const App = () => {

	// #region Variables
	const [
		requestInitData,
		loading,
		error,
		modalSelectVisible,
		modalWarningVisible
	] = useStore(state => [
		state.requestInitData,
		state.loading,
		state.error,
		state.modalSelectVisible,
		state.modalWarningVisible
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
				</>
			}
		</section>
	)
}

export default App