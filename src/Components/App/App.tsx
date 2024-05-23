import { useEffect } from 'react'
import { Factory, Viewport } from '../'
import useStore from '../../Store'
import style from './App.module.sass'
import '../../Sass/main.sass'

const { app, caption, body } = style

const App = () => {
	const requestInitData = useStore(state => state.requestInitData)

	useEffect(() => {
		requestInitData()
	}, [requestInitData])

	const clazz = `se-app ${app}`

	return (
		<section className={clazz}>
			<h1 className={caption}>
				Конфигуратор
			</h1>
			<div className={body}>
				<Factory />
				<Viewport />
			</div>
		</section>
	)
}

export default App