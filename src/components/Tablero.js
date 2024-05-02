import React, { useState, useEffect } from "react"
import axios from "axios"
import InputPalabra from "./InputPalabra"
import Contador from "./Contador"
import ListaPalabras from "./ListaPalabras"
import { FaRegStopCircle } from "react-icons/fa"
import { FaDiceD6 } from "react-icons/fa"

const Tablero = ({ bestScore, setBestScore }) => {
  const segundos = 180
  const [tablero, setTablero] = useState(generarTablero())
  const [palabrasEncontradas, setPalabrasEncontradas] = useState([])
  const [palabrasCorrectas, setPalabrasCorrectas] = useState([])
  const [palabraIngresada, setPalabraIngresada] = useState("")
  const [mensaje, setMensaje] = useState("")
  const [temporizador, setTemporizador] = useState(segundos)
  const [juegoActivo, setJuegoActivo] = useState(false)

  useEffect(() => {
    if (juegoActivo) encontrarPalabras()
  }, [tablero])

  useEffect(() => {
    // Actualizar bestScore si palabrasCorrectas es mayor que bestScore
    if (palabrasCorrectas.length > bestScore) {
      setBestScore(palabrasCorrectas.length)
    }
  }, [palabrasCorrectas, palabrasEncontradas, bestScore, setBestScore])

  useEffect(() => {
    let intervalo
    if (juegoActivo && temporizador > 0) {
      intervalo = setInterval(() => {
        setTemporizador((prev) => prev - 1)
      }, 1000)
    } else if (temporizador === 0) {
      terminarJuego()
    }
    return () => clearInterval(intervalo)
  }, [juegoActivo, temporizador])

  const terminarJuego = () => {
    setJuegoActivo(false)
    setMensaje(
      `Tiempo finalizado. Palabras correctas: ${palabrasCorrectas.length} de ${palabrasEncontradas.length} encontradas.`
    )
  }

  const detenerJuego = () => {
    setTemporizador(0) // Forzar finalización del juego como si el tiempo se acabara
  }

  const encontrarPalabras = async () => {
    const URL = `${process.env.REACT_APP_BACKEND_URL}/find-words`
    try {
      const response = await axios.post(
        URL,
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
           console.log(URL)
      setPalabrasEncontradas([])
    }
  }

  const verificarPalabra = (palabra) => {
    if (!palabrasEncontradas.includes(palabra)) {
      setMensaje("La palabra no fue encontrada.")
      setPalabraIngresada("")
    } else if (palabrasCorrectas.includes(palabra)) {
      setMensaje("La palabra ya fue ingresada.")
      setPalabraIngresada("")
    } else {
      setPalabrasCorrectas([...palabrasCorrectas, palabra])
      setPalabraIngresada("")
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
    setPalabrasCorrectas([])
    setPalabraIngresada("")
    setMensaje("")
    setTemporizador(segundos)
    setJuegoActivo(true)
  }

  return (
    <div className="flex flex-col items-center justify-center flex-grow p-5">
      <div className="flex flex-col items-center justify-center">
        {!juegoActivo && (
          <div>
            <div>
              <div className="text-8xl font-jersey flex gap-2">
                <h1>Boggle</h1>
                <FaDiceD6 />
              </div>
              <div className="flex justify-center flex-col items-center mt-5">
                <p className="text-xl ">Desarrollo y Arquitecturas Web</p>
              </div>
            </div>

            <button
              onClick={sortearTablero}
              className="my-4 w-full max-w-xs px-4 py-2 bg-secondary text-white font-bold rounded hover:bg-secondary-900 transition duration-150"
            >
              Comenzar
            </button>
          </div>
        )}
        {juegoActivo && (
          <>
            <Contador temporizador={temporizador} />
            <button
              onClick={detenerJuego}
              className="my-2 w-full flex items-center justify-between max-w-xs px-4 py-2 bg-accent text-white font-bold rounded transition duration-150"
            >
              Detener Juego <FaRegStopCircle />
            </button>
            <div className="grid grid-cols-4 gap-4 w-full max-w-xs">
              {tablero.flat().map((letra, idx) => (
                <div
                  key={idx}
                  className="w-16 h-16 flex items-center justify-center bg-primary text-white font-bold text-2xl rounded shadow-lg"
                >
                  {letra}
                </div>
              ))}
            </div>
            <InputPalabra
              palabraIngresada={palabraIngresada}
              setPalabraIngresada={setPalabraIngresada}
              verificarPalabra={verificarPalabra}
              mensaje={mensaje}
              palabrasCorrectas={palabrasCorrectas}
            />
          </>
        )}

        <ListaPalabras palabrasCorrectas={palabrasCorrectas} />
        <p className="mt-4 text-lg text-gray-700">{mensaje}</p>
        {!juegoActivo && palabrasEncontradas.length > 0 && (
          <p className="text-lg text-gray-700">
            Porcentaje de aciertos:{" "}
            {(
              (palabrasCorrectas.length / palabrasEncontradas.length) *
              100
            ).toFixed(2)}
            %
          </p>
        )}
      </div>
    </div>
  )
}

export default Tablero
