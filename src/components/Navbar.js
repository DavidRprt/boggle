import React from "react"

const Navbar = ({ bestScore }) => {
  return (
    <div className="navbar bg-neutral text-neutral-content flex justify-between px-6">
      <p className="text-xl">
        <b>Boggle</b>
      </p>
      <div className="flex flex-col items-center">
        <p className="text-accent">Best Score </p>
        <p>{bestScore}</p>
      </div>
    </div>
  )
}

export default Navbar
