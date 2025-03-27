import React, { useState } from "react";
import TokenVaults from "./TokenVaults"; 
import NFTVaults from "./NFTVaults"; 
const HomePage: React.FC = () => {
  const [activeComponent, setActiveComponent] = useState<"tokens" | "nfts">("tokens");

  return (
    <div>
      <nav className="flex gap-4 text-white hover-gray-300 mt-2">
        <button onClick={() => setActiveComponent("tokens")}>Tokens</button>
        <button onClick={() => setActiveComponent("nfts")}>NFTVaults</button>
      </nav>
      <div>
        {activeComponent === "tokens" && <TokenVaults />}
        {activeComponent === "nfts" && <NFTVaults />}
      </div>
    </div>
  );
};

export default HomePage;
