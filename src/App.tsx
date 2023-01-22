import { useState } from 'react'
import './App.css'
import Gear from './Gear'

function App() {
	const [count, setCount] = useState(0)

	return (
		<div className="App relative">
			<Gear teeth={10} position={{x:50,y:50}} radius={10}/>
			<div className="absolute w-[50px] h-[50px] border-2 border-green-700"></div>
		</div>
	)
}

export default App
