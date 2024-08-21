import { useEffect } from 'react'
import { Loader, Tabs, Factory, Viewport } from '../../Components'
import useStore from '../../Store'
import style from './App.module.sass'
import '../../Sass/main.sass'

const { app, caption, body } = style

const App = () => {
	const [ requestInitData, loading, error ] = useStore(state => [
		state.requestInitData,
		state.loading,
		state.error
	])

	if (error !== null) {
		throw new Error(`${error ? error : ''}`)
	}

	useEffect(() => {
		requestInitData()
	}, [requestInitData])

	const clazz = `se-app ${app}`

	return (
		<section className={clazz}>
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
		</section>
	)
}

export default App