import React from 'react'

interface NavbarProps {
    height: number;
}

const Navbar:React.FC<NavbarProps> = ({height}) => {
  return (
    <div className={`w-screen bg-slate-400 h-[${height}vh]`}>
      Navbar
    </div>
  )
}

export default Navbar
