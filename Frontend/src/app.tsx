import React, { useState, useCallback } from "react";
import { XdcConnect, Disconnect } from "xdc-connect";
import "./app.css";
import { Web3ModalContext } from "./contexts/Web3ModalProvider";
import { BlockchainContext } from "./contexts/BlockchainProvider";

const App: React.FC = () => {
  const [slide, setSlide] = useState(0);
  const { web3, account, connect, disconnect, chainId } =
    React.useContext(Web3ModalContext);
  const [tokensOffered, setTokensOffered] = useState([
    { id: 1, token: "", amount: 0 }
  ]);
  const [tokensWanted, setTokensWanted] = useState([
    { id: 1, token: "", amount: 0 }
  ]);

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

  const handleConnectXDCPay = useCallback(() => {
    connect();
  }, [connect]);

  const handleDisconnectWallet = useCallback(() => {
    disconnect();
  }, [disconnect]);

  return (
    <main className="main">
      <div className="button-container">
      {!account ? (
        <button onClick={handleConnectXDCPay}>Connect XDCPay</button>
      ) : (
        <button onClick={handleDisconnectWallet}>Disconnect</button>
      )}
      </div>

      {tokensOffered.map((token) => (
        <div key={token.id} className="token-wrapper">
          <h3>Amount</h3>
          <input
            type="number"
            value={token.amount}
            onChange={(e) =>
              handleTokenOfferedChange(token.id, "amount", e.target.value)
            }
          />
          <h3>Tokens Offered</h3>
          <select
            value={token.token}
            onChange={(e) =>
              handleTokenOfferedChange(token.id, "token", e.target.value)
            }
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
            onChange={(e) =>
              handleTokenWantedChange(token.id, "amount", e.target.value)
            }
          />
          <h3>Tokens Wanted</h3>
          <select
            value={token.token}
            onChange={(e) =>
              handleTokenWantedChange(token.id, "token", e.target.value)
            }
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

      <button id="create-offer" onClick={handleSubmit}>
        CREATE OFFER TO TRADE
      </button>
    </main>
  );
};

export default App;