import React from "react"
import { IoCheckmarkCircle } from "react-icons/io5"


const ListaPalabras = ({ palabrasCorrectas }) => {
  // Dividimos las palabras en tres partes
  const columnas = [[], [], []]

  palabrasCorrectas.forEach((palabra, index) => {
    const columnaIndex = index % 3 // Determina la columna en la que se ubicará la palabra
    columnas[columnaIndex].push(palabra) // Agrega la palabra a la columna correspondiente
  })

  return (
    <div className="mt-2 grid grid-cols-3 gap-4 w-full overflow-y-auto max-h-80">
      {columnas.map((columna, columnIndex) => (
        <div key={columnIndex}>
          {columna.map((palabra, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 my-1 bg-secondary rounded-lg shadow-md"
            >
              <span className="text-white font-semibold capitalize">
                {palabra}
              </span>
              <IoCheckmarkCircle className="text-white text-xl" />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

export default ListaPalabras
