import React from "react"

const JuegoFinalizado = ({
  palabrasCorrectas,
  palabrasEncontradas,
  reiniciarJuego,
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <p className="text-lg text-gray-700">Juego Finalizado</p>
      <p className="text-lg text-gray-700">
        Palabras correctas: {palabrasCorrectas.length} de{" "}
        {palabrasEncontradas.length} encontradas.
      </p>
      <p className="text-lg text-gray-700">
        Porcentaje de aciertos:{" "}
        {(
          (palabrasCorrectas.length / palabrasEncontradas.length) *
          100
        ).toFixed(2)}
        %
      </p>
      <button
        onClick={reiniciarJuego}
        className="mt-4 w-full max-w-xs px-4 py-2 bg-secondary text-white font-bold rounded hover:bg-secondary-900 transition duration-150"
      >
        Comenzar Nuevo Juego
      </button>
    </div>
  )
}

export default JuegoFinalizado
