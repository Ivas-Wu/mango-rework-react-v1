import { useState } from "react";
import GameParent from "./components/GameParent";
import Navbar from "./components/Navbar/Navbar";
import ConfigModal from "./components/Config/ConfigModal";

function App() {
  const [navbarHeight, setNavbarHeight] = useState<number>(7);
  const [showConfig, setShowConfig] = useState<boolean>(false);

  const toggleConfigs = (override?: boolean) => {
    setShowConfig(override || !showConfig);
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar
        height={navbarHeight}
        openConfigs={() => toggleConfigs(true)} />
      <GameParent
        height={100 - navbarHeight} />
      {
        showConfig &&
        <ConfigModal
          onClose={() => toggleConfigs(false)} />
      }
    </div>
  );
}

export default App;
