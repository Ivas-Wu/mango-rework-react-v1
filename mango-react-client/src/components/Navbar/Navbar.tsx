import React from 'react'

interface NavbarProps {
    height: number;
    openConfigs: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ height, openConfigs }) => {
    return (
        <div className={`flex flex-row w-screen bg-slate-400 h-[${height}vh]`}>
            Navbar
            <button onClick={openConfigs}> Configs </button>
        </div>
    )
}

export default Navbar
