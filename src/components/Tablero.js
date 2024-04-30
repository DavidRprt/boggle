import React, { useState, useEffect } from "react"
import axios from "axios"

const Tablero = () => {
  const [tablero, setTablero] = useState(generarTablero())
  const [palabrasEncontradas, setPalabrasEncontradas] = useState([])
  const [cargando, setCargando] = useState(false)
  const [palabrasCorrectas, setPalabrasCorrectas] = useState([])
  const [palabraIngresada, setPalabraIngresada] = useState("")
  const [mensaje, setMensaje] = useState("")

  useEffect(() => {
    encontrarPalabras()
  }, [tablero]) 

  const encontrarPalabras = async () => {
    setCargando(true)
    try {
      const response = await axios.post(
        "http://localhost:3000/api/boggle/find-words",
        { board: tablero }
      )
      const data = response.data
      if (data.wordsFound) {
        setPalabrasEncontradas(data.wordsFound)
        console.log(data.wordsFound)
      } else {
        console.error(
          "No se encontraron palabras o hubo un error en la respuesta"
        )
        setPalabrasEncontradas([])
      }
    } catch (error) {
      console.error("Error al buscar palabras:", error)
      setPalabrasEncontradas([])
    }
    setCargando(false)
  }

  const verificarPalabra = (palabra) => {
    if (!palabrasEncontradas.includes(palabra)) {
      setMensaje("La palabra no fue encontrada.")
    } else if (palabrasCorrectas.includes(palabra)) {
      setMensaje("La palabra ya fue ingresada.")
    } else {
      setPalabrasCorrectas([...palabrasCorrectas, palabra])
      setMensaje("¡Palabra correcta!")
    }
  }

  function generarTablero() {
    const TAMANO = 4
    const letrasFrecuentes = "AAEEEEIIOOU" // Duplicamos las vocales mas comunes
    const letrasInfrecuentes = "BCDFGHJKLMNPQRSTVWXYZSSRRLLNNTTMMCC" // Nuevamente duplicamos las consonantes mas comunes como la 'S'
    let nuevoTablero = Array.from({ length: TAMANO }, () =>
      Array.from({ length: TAMANO }, () => "")
    )
    const totalVocales = 6 // Seteamos la cantidad de vocales en 6
    let indicesVocales = new Set()

    // Generaramos índices aleatorios para las posiciones de las vocales
    while (indicesVocales.size < totalVocales) {
      let indiceAleatorio = Math.floor(Math.random() * TAMANO * TAMANO)
      indicesVocales.add(indiceAleatorio)
    }

    // Llenamos el tablero con vocales y consonantes
    for (let i = 0; i < TAMANO; i++) {
      for (let j = 0; j < TAMANO; j++) {
        let indiceLineal = i * TAMANO + j
        if (indicesVocales.has(indiceLineal)) {
          nuevoTablero[i][j] =
            letrasFrecuentes[
              Math.floor(Math.random() * letrasFrecuentes.length)
            ]
        } else {
          nuevoTablero[i][j] =
            letrasInfrecuentes[
              Math.floor(Math.random() * letrasInfrecuentes.length)
            ]
        }
      }
    }

    // Verificamos si hay una 'Q' en el tablero
    for (let i = 0; i < TAMANO; i++) {
      for (let j = 0; j < TAMANO; j++) {
        if (nuevoTablero[i][j] === "Q") {
          // Si hay, nos fijamos que al menos una de las posiciones adyacentes tenga una 'U'
          let hasAdjacentU = false
          const directions = [
            [1, 0],
            [0, 1],
            [-1, 0],
            [0, -1],
            [1, 1],
            [-1, -1],
            [1, -1],
            [-1, 1],
          ]
          for (let [dx, dy] of directions) {
            let ni = i + dx,
              nj = j + dy
            if (
              ni >= 0 &&
              ni < TAMANO &&
              nj >= 0 &&
              nj < TAMANO &&
              nuevoTablero[ni][nj] === "U"
            ) {
              hasAdjacentU = true
              break
            }
          }
          if (!hasAdjacentU) {
            // Si no hay 'U' adyacente, colocamos una en una posicion cercana, aunque esto agregue una vocal extra
            let placed = false
            for (let [dx, dy] of directions) {
              let ni = i + dx,
                nj = j + dy
              if (
                ni >= 0 &&
                ni < TAMANO &&
                nj >= 0 &&
                nj < TAMANO &&
                !indicesVocales.has(ni * TAMANO + nj)
              ) {
                nuevoTablero[ni][nj] = "U"
                placed = true
                break
              }
            }
            if (!placed && i < TAMANO - 1) {
              nuevoTablero[i + 1][j] = "U"
            }
          }
        }
      }
    }

    return nuevoTablero
  }

  const sortearTablero = () => {
    setTablero(generarTablero())
  }

  return (
    <div className="app-container flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
      <div className="flex flex-col items-center justify-center">
        <button
          onClick={sortearTablero}
          className="my-4 w-full max-w-xs px-4 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition duration-150"
        >
          Comenzar
        </button>
        <div className="grid grid-cols-4 gap-4 w-full max-w-xs">
          {tablero.flat().map((letra, idx) => (
            <div
              key={idx}
              className="w-16 h-16 flex items-center justify-center bg-blue-500 text-white font-bold text-2xl rounded shadow-lg"
            >
              {letra}
            </div>
          ))}
        </div>
      </div>
      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <div className="flex flex-col w-full max-w-xs items-center">
          <input
            value={palabraIngresada}
            onChange={(e) => setPalabraIngresada(e.target.value)}
            className="w-full p-2 border-2 border-blue-300 my-3 rounded-lg focus:outline-none focus:border-blue-500 transition duration-200 ease-in-out"
            placeholder="Ingresa una palabra..."
          />
          <button
            onClick={() => verificarPalabra(palabraIngresada)}
            className="w-full px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-150 ease-in-out shadow"
          >
            Verificar Palabra
          </button>
          <p className="mt-4 text-lg text-gray-700">{mensaje}</p>
          {palabrasCorrectas.length > 0 && (
            <ul className="mt-2 list-disc list-inside">
              {palabrasCorrectas.map((palabra, index) => (
                <li key={index} className="text-green-600">
                  {palabra}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default Tablero
