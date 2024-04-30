import React, { useState } from "react"
import Tablero from "./components/Tablero"
import Footer from "./components/Footer"
import Navbar from "./components/Navbar"

function App() {
  const [bestScore, setBestScore] = useState(0)

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar bestScore={bestScore} />
      <Tablero bestScore={bestScore} setBestScore={setBestScore} />
      <Footer />
    </div>
  )
}

export default App
