// import React from 'react'
import ReactDOM from 'react-dom/client'
import { App, ErrorBoundary } from './Components'

ReactDOM.createRoot(document.getElementById('seApp')!).render(
	// <React.StrictMode>
		<ErrorBoundary>
			<App />
		</ErrorBoundary>
	// </React.StrictMode>,
)