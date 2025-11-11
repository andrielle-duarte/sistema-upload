import { useState } from 'react'
import Topo from "../src/Componentes/Topo/index"
import Login from "../src/Componentes/Login/index"


import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Topo />
      <Login />
    </>
  )
}

export default App
