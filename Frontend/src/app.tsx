import React, { useState } from "react";
import { XdcConnect, Disconnect } from "xdc-connect";
import "./app.css";

const App: React.FC = () => {
  const [tokensOffered, setTokensOffered] = useState([{ id: 1, token: "", amount: 0 }]);
  const [tokensWanted, setTokensWanted] = useState([{ id: 1, token: "", amount: 0 }]);
  const [wallet, setWallet] = useState({ connected: false });

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

  const handleConnectXDCPay = () => {
    // Logic to open XDCPay wallet
    // Replace this with the actual code to open the XDCPay wallet
    console.log("Connect XDCPay clicked");
  };

  const handleSubmit = () => {
    // Logic to handle submit
    console.log("Submit button clicked");
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

      <XdcConnect
        btnClass={
          wallet.connected
            ? "btn btn-rounded btn-success"
            : "btn btn-rounded btn-warning"
        }
        btnName={wallet.connected ? "CONNECTED" : "CONNECT"}
        onConnect={(wallet) => {
          console.log("user connected wallet", wallet);
          setWallet({ connected: true });
        }}
        onDisconnect={(wallet) => {
          console.log("user disconnected wallet", wallet);
          setWallet({ connected: false });
        }}
      />

      {wallet.connected ? <button onClick={Disconnect}>Logout</button> : null}
    </main>
  );
};

export default App;