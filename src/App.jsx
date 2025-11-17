import { useState } from 'react'
import Topo from "../src/Componentes/Topo/index"
import Login from "../src/Componentes/Login/index"
import Home from "../src/Componentes/Home/index"

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Topo />
      <Home />
      
    </>
  )
}

export default App
