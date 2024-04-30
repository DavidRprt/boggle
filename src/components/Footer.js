import React from "react"
import { FaGithub } from "react-icons/fa"

const Footer = () => {
  return (
    <footer className="footer p-10 flex justify-between bg-neutral text-neutral-content left-0 w-full">
      <div>
        <div className="flex flex-col">
          <b>Developed By:</b>
          <p>David Kahan Rapoport</p>
          <p>Augusto Baez</p>
        </div>
      </div>
      <a
        href="https://github.com/DavidRprt/boggle"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaGithub size={58} className="fill-current" />
      </a>
    </footer>
  )
}

export default Footer
