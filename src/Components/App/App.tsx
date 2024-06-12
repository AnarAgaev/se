import { useEffect } from 'react'
import { Tabs, Factory, Viewport } from '../../Components'
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
			<Tabs />
			<div className={body}>
				<Factory />
				<Viewport />
			</div>
		</section>
	)
}

export default App