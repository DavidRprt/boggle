import React from "react"

const Contador = ({ temporizador }) => {
  // Calcula minutos y segundos 
  const minutos = Math.floor(temporizador / 60)
  const segundos = Math.floor(temporizador % 60)

  return (
    <div className="grid grid-flow-col gap-5 text-center auto-cols-max mb-3">
      <div className="flex flex-col">
        <span className="countdown font-mono text-5xl">
          <span style={{ "--value": minutos }}>{minutos}</span>
        </span>
        min
      </div>
      <div className="flex flex-col">
        <span className="countdown font-mono text-5xl">
          <span style={{ "--value": segundos }}>{segundos}</span>
        </span>
        sec
      </div>
    </div>
  )
}

export default Contador
