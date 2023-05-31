import React, { useState, useCallback } from "react";
import "./app.css";
import { Web3ModalContext } from "./contexts/Web3ModalProvider";

interface Offer {
  id: number;
  tokensOffered: { id: number; token: string; amount: number }[];
  tokensWanted: { id: number; token: string; amount: number }[];
  status: string;
  creator: string | null;
  date: string; // Date field
  time: string; // Time field
}

const App: React.FC = () => {
  // Accessing the Web3ModalContext
  const { account, connect, disconnect, signer } = React.useContext(
    Web3ModalContext
  );

  // State for tokens offered and tokens wanted
  const [tokensOffered, setTokensOffered] = useState([
    { id: 1, token: "", amount: 0 }
  ]);
  const [tokensWanted, setTokensWanted] = useState([
    { id: 1, token: "", amount: 0 }
  ]);

  // State for open offers
  const [openOffers, setOpenOffers] = useState<Offer[]>([]);

  // Function to add a new token to the tokensOffered state
  const handleAddTokenOffered = () => {
    const newToken = { id: tokensOffered.length + 1, token: "", amount: 0 };
    setTokensOffered([...tokensOffered, newToken]);
  };

  // Function to add a new token to the tokensWanted state
  const handleAddTokenWanted = () => {
    const newToken = { id: tokensWanted.length + 1, token: "", amount: 0 };
    setTokensWanted([...tokensWanted, newToken]);
  };

  // Function to handle changes in the tokensOffered state
  const handleTokenOfferedChange = (
    id: number,
    field: string,
    value: string
  ) => {
    const updatedTokens = tokensOffered.map((token) =>
      token.id === id ? { ...token, [field]: value } : token
    );
    setTokensOffered(updatedTokens);
  };

  // Function to handle changes in the tokensWanted state
  const handleTokenWantedChange = (
    id: number,
    field: string,
    value: string
  ) => {
    const updatedTokens = tokensWanted.map((token) =>
      token.id === id ? { ...token, [field]: value } : token
    );
    setTokensWanted(updatedTokens);
  };

  // Function to handle form submission
  const handleSubmit = () => {
    // Validate the form inputs before submitting
    if (tokensOffered.some((token) => token.token === "" || token.amount === 0)) {
      alert("Please fill in all the token offered fields.");
      return;
    }
    if (tokensWanted.some((token) => token.token === "" || token.amount === 0)) {
      alert("Please fill in all the token wanted fields.");
      return;
    }

    // Prepare the data to be submitted
    const newOffer: Offer = {
      id: openOffers.length + 1,
      tokensOffered,
      tokensWanted,
      status: "Open",
      creator: account,
      date: new Date().toISOString().split("T")[0], // Get the current date
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) // Get the current time
    };

    // Update the open offers state
    setOpenOffers([...openOffers, newOffer]);

    // Reset the form after submission
    setTokensOffered([{ id: 1, token: "", amount: 0 }]);
    setTokensWanted([{ id: 1, token: "", amount: 0 }]);
  };

  // Function to connect to XDCPay
  const handleConnectXDCPay = useCallback(() => {
    connect();
  }, [connect]);

  // Function to disconnect from the wallet
  const handleDisconnectWallet = useCallback(() => {
    disconnect();
  }, [disconnect]);

  // Function to initiate the trade
  const initiateTrade = useCallback(
    async (offerId: number) => {
      try {
        // Perform the necessary steps to initiate the trade
        console.log("Initiating trade for offer ID:", offerId);

        // Update the offer status to "In Progress" or any other desired value
        const updatedOffers = openOffers.map((offer) =>
          offer.id === offerId ? { ...offer, status: "In Progress" } : offer
        );
        setOpenOffers(updatedOffers);

        // Optional: Interact with a contract or perform additional logic
        // ...

        // Sign the transaction
        const signature = await signer.sign("Hello, World!");

        // Perform any necessary UI updates or display a success message to the user
        console.log("Trade initiated successfully");
      } catch (error) {
        // Handle errors
        console.error("Error initiating trade:", error);
        // Display an error message to the user
      }
    },
    [openOffers, signer]
  );

  return (
    <main className="main">
      <div className="button-container">
        {!account ? (
          <button onClick={handleConnectXDCPay}>Connect XDCPay</button>
        ) : (
          <button onClick={handleDisconnectWallet}>Disconnect</button>
        )}
      </div>

      {/* Tokens Offered */}
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

      {/* Tokens Wanted */}
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

      {/* Create Offer button */}
      <button id="create-offer" onClick={handleSubmit}>
        CREATE OFFER TO TRADE
      </button>

      {/* Open Offers */}
      <div className="open-offers">
        <h2>Marketplace Offers (List of Open Offers)</h2>
        {openOffers.length > 0 ? (
          <ul>
            {openOffers.map((offer) => (
              <li key={offer.id}>
                <strong>Offer #{offer.id}</strong>
                <p>
                  Tokens Offered: {offer.tokensOffered
                    .map((token) => `${token.amount} ${token.token}`)
                    .join(", ")}
                </p>
                <p>
                  Tokens Wanted: {offer.tokensWanted
                    .map((token) => `${token.amount} ${token.token}`)
                    .join(", ")}
                </p>
                <p>Status: {offer.status}</p>
                <p>Creator: {offer.creator}</p>
                <p>Date: {offer.date}</p>
                <p>Time: {offer.time}</p>
                <button onClick={() => initiateTrade(offer.id)}>TRADE</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No open offers available.</p>
        )}
      </div>
    </main>
  );
};

export default App;