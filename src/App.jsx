import { useState } from 'react'
import Topo from "../src/Componentes/Topo/index"
import Login from "../src/Componentes/Login/index"
import './App.css'
import UploadForm from './Componentes/Upload/uploadForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Topo />
      <UploadForm />
    </>
  )
}

export default App
