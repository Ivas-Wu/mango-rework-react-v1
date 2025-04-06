import React, { useState } from 'react'

interface NavbarProps {
    height: number;
    openConfigs: () => void;
    hideBar: (hidden: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ height, openConfigs, hideBar }) => {
    const [hidden, setHidden] = useState<boolean>(false);

    const getDynamicStyles = (): React.CSSProperties => {
        return {
            height: `${height}lvh`
        };
    };

    const setHiddenValue = (hidden: boolean) => {
        setHidden(hidden);
        hideBar(hidden);
    }

    return (
        <div className={`flex flex-row w-screen bg-slate-400`} style={getDynamicStyles()}>
            {!hidden &&
                <div>
                    Navbar
                    <button onClick={openConfigs}> Configs </button>
                    <button onClick={() => setHiddenValue(true)}> Hide </button>
                </div>
            }
        </div>
    )
}

export default Navbar
