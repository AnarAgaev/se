import React from 'react'
import ReactDOM from 'react-dom/client'
import ErrorBoundary from './Components/ErrorBoundary'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('seApp')!).render(
	<React.StrictMode>
		<ErrorBoundary>
			<App />
		</ErrorBoundary>
	</React.StrictMode>,
)
