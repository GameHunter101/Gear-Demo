import { useState } from 'react'
import './App.css'
import Gear from './Gear'

function App() {
	const [count, setCount] = useState(0)

	return (
		<div className="App relative">

			<Gear teeth={30} diameter={10} position={{ x: 50, y: 50 }}/>
		</div>
	)
}

export default App
