import { useEffect } from 'react'
import { Factory, Screen } from './Components'
import useStore from './Store'
import './App.sass'

const App = () => {
	const requestInitData = useStore(state => state.requestInitData)

	useEffect(() => {
		requestInitData()
	}, [requestInitData])

	return (
		<section className="se-app">
			<h1 className='se-app__caption'>Конфигуратор</h1>
			<div className='se-app__body'>
				<Factory />
				<Screen />
			</div>
		</section>
	)
}

export default App