import { useState } from "react";
import GameParent from "./components/GameParent";
import Navbar from "./components/Navbar/Navbar";

function App() {
  const [navbarHeight, setNavbarHeight] = useState<number>(7);
  return (
    <div className="flex flex-col h-screen">
      <Navbar height={navbarHeight}></Navbar>
      <GameParent height={100-navbarHeight}></GameParent>
    </div>
  );
}

export default App;
