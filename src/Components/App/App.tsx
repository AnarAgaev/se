import { useEffect } from 'react'
import { Loader, Tabs, Factory, Viewport, ModalSelect } from '../../Components'
import useStore from '../../Store'
import style from './App.module.sass'
import '../../Sass/main.sass'

const { app, caption, body } = style

const App = () => {
	const [ requestInitData, loading, error, modalSelectVisible ] = useStore(state => [
		state.requestInitData,
		state.loading,
		state.error,
		state.modalSelectVisible
	])

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
				</>
			}
		</section>
	)
}

export default App