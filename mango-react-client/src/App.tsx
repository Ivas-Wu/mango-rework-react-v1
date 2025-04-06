import { useState } from "react";
import GameParent from "./components/GameParent";
import Navbar from "./components/Navbar/Navbar";
import ConfigModal from "./components/Config/ConfigModal";

function App() {
  const NavbarHeightConst = 7;
  const [navbarHeight, setNavbarHeight] = useState<number>(NavbarHeightConst);
  const [showConfig, setShowConfig] = useState<boolean>(false);

  const toggleConfigs = (override?: boolean) => {
    setShowConfig(override || !showConfig);
  }

  const toggleNavbar = (hidden: boolean) => {
    setNavbarHeight(hidden ? 0 : NavbarHeightConst);
  }

  const getBodyHeight = () => {
    return 100 - navbarHeight;
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar
        height={navbarHeight}
        openConfigs={() => toggleConfigs(true)}
        hideBar={toggleNavbar} />
      <GameParent
        height={getBodyHeight()} />
      {
        showConfig &&
        <ConfigModal
          onClose={() => toggleConfigs(false)} />
      }
    </div>
  );
}

export default App;
