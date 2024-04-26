import { useEffect } from 'react'
import { useBoundStore } from './Store'
import './App.sass'


const App = () => {

	const requestInitData = useBoundStore(state => state.requestInitData)

	useEffect(() => {
		requestInitData()
	}, [requestInitData])

	return (
		<section className="se-app">
			Hello
			<img src="" alt="" className="image" style={{height: '200px', width: '200px'}}/>
		</section>
	)
}

export default App