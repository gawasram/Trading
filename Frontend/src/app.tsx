import React, { useState } from "react";
import "./app.css";

const App: React.FC = () => {
  const [tokensOffered, setTokensOffered] = useState([{ id: 1, token: "", amount: 0 }]);
  const [tokensWanted, setTokensWanted] = useState([{ id: 1, token: "", amount: 0 }]);

  const handleAddTokenOffered = () => {
    const newToken = { id: tokensOffered.length + 1, token: "", amount: 0 };
    setTokensOffered([...tokensOffered, newToken]);
  };

  const handleAddTokenWanted = () => {
    const newToken = { id: tokensWanted.length + 1, token: "", amount: 0 };
    setTokensWanted([...tokensWanted, newToken]);
  };

  const handleTokenOfferedChange = (id: number, field: string, value: string) => {
    const updatedTokens = tokensOffered.map((token) =>
      token.id === id ? { ...token, [field]: value } : token
    );
    setTokensOffered(updatedTokens);
  };

  const handleTokenWantedChange = (id: number, field: string, value: string) => {
    const updatedTokens = tokensWanted.map((token) =>
      token.id === id ? { ...token, [field]: value } : token
    );
    setTokensWanted(updatedTokens);
  };

  const handleSubmit = () => {
    // Logic to handle form submission
  };

  const handleConnectXDCPay = () => {
    // Logic to open XDCPay wallet
    // You can replace the alert with the actual code to open the XDCPay wallet
    alert("Open XDCPay wallet");
  };

  return (
    <main className="main">
      {tokensOffered.map((token) => (
        <div key={token.id} className="token-wrapper">
          <h3>Amount</h3>
          <input
            type="number"
            value={token.amount}
            onChange={(e) => handleTokenOfferedChange(token.id, "amount", e.target.value)}
          />
          <h3>Tokens Offered</h3>
          <select
            value={token.token}
            onChange={(e) => handleTokenOfferedChange(token.id, "token", e.target.value)}
          >
            <option value="">Select Token</option>
            <option value="WOOD">WOOD</option>
            <option value="ROCK">ROCK</option>
            <option value="CLAY">CLAY</option>
            <option value="WOOL">WOOL</option>
            <option value="FISH">FISH</option>
          </select>
        </div>
      ))}

      <button onClick={handleAddTokenOffered}>Add Another</button>

      {tokensWanted.map((token) => (
        <div key={token.id} className="token-wrapper">
          <h3>Amount</h3>
          <input
            type="number"
            value={token.amount}
            onChange={(e) => handleTokenWantedChange(token.id, "amount", e.target.value)}
          />
          <h3>Tokens Wanted</h3>
          <select
            value={token.token}
            onChange={(e) => handleTokenWantedChange(token.id, "token", e.target.value)}
          >
            <option value="">Select Token</option>
            <option value="WOOD">WOOD</option>
            <option value="ROCK">ROCK</option>
            <option value="CLAY">CLAY</option>
            <option value="WOOL">WOOL</option>
            <option value="FISH">FISH</option>
          </select>
        </div>
      ))}

      <button onClick={handleAddTokenWanted}>Add Another</button>

      <button id="connect-xdcpay" onClick={handleConnectXDCPay}>
        Connect XDCPay
      </button>

      <button id="create-offer" onClick={handleSubmit}>
        CREATE OFFER TO TRADE
      </button>
    </main>
  );
};

export default App;