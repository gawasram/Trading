import React, { useState, useCallback, useEffect, useContext } from "react";
import "./app.css";
import { Web3ModalContext } from "./contexts/Web3ModalProvider";
import { BlockchainContext } from "./contexts/BlockchainProvider";
import { HashLoader } from "react-spinners";

interface QuerriedOffer {
  id: number;
  offerString: string | null;
  offerCrreator: string | null;
  offerStatus: string | null;
}

const App: React.FC = () => {
  const {
    web3,
    account,
    connect,
    disconnect,
    signer,
    chainId
  } = useContext(Web3ModalContext);

  const {
    woodInTheBlockchainLand,
    rockInTheBlockchainLand,
    CLAYInTheBlockchainLand,
    woolInTheBlockchainLand,
    fishInTheBlockchainLand,
    tradeOffer
  } = useContext(BlockchainContext);

  const [loading, setLoading] = useState<boolean>(false);

  const [allowances, setAllowances] = useState({
    WOOD: "",
    ROCK: "",
    CLAY: "",
    WOOL: "",
    FISH: ""
  });

  const [numberOfOffers, setNumberOfOffers] = useState(0);
  const [offerData, setOfferData] = useState<QuerriedOffer[]>([]);
  const [tokenAmounts, setTokenAmounts] = useState(Array(10).fill(undefined));
  const [tokensOfferedData, setTokensOfferedData] = useState(Array(5).fill(undefined));
  const [tokensWantedData, setTokensWantedData] = useState(Array(5).fill(undefined));
  const [isApproved, setIsApproved] = useState({
    WOOD: false,
    ROCK: false,
    CLAY: false,
    WOOL: false,
    FISH: false
  });

  const [buttonName, setButtonName] = useState("Submit Offer");
  const [tokensOffered, setTokensOffered] = useState([
    { id: 1, token: "", amount: 0 }
  ]);
  const [tokensWanted, setTokensWanted] = useState([
    { id: 1, token: "", amount: 0 }
  ]);
  const [counterWanted, setCounterWanted] = useState(0);
  const [counterOffered, setCounterOffered] = useState(0);
  const [marketplaceButtonName, setMarketplaceButtonName] = useState<string[]>([]);
  const [offerToAccept, setOfferToAccept] = useState<string[]>([""]);
  const [undefinedCounter, setUndefinedCounter] = useState(0);
  const [currentOfferToAccept, setCurrentOfferToAccept] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([getTokenAllowance(), getNumberOfOffers()]);

    if (offerStatusArray[0] === "undefined" || offerStatusArray[0] === "") {
      getStatusInfo();
      console.log(offerStatusArray[0])
    }

    if (offerStringArray[0] === "undefined" || offerStringArray[0] === "") {
      getOfferInfo();
      console.log(offerStringArray[0]);
    }
  }, []);

  const getTokenAllowance = useCallback(async () => {
    setLoading(true);
    try {
      const allowancePromises = [
        woodInTheBlockchainLand.allowance(account, tradeOffer.address),
        rockInTheBlockchainLand.allowance(account, tradeOffer.address),
        CLAYInTheBlockchainLand.allowance(account, tradeOffer.address),
        woolInTheBlockchainLand.allowance(account, tradeOffer.address),
        fishInTheBlockchainLand.allowance(account, tradeOffer.address)
      ];

      const allowances = await Promise.all(allowancePromises);
      setAllowances({
        WOOD: allowances[0].toString(),
        ROCK: allowances[1].toString(),
        CLAY: allowances[2].toString(),
        WOOL: allowances[3].toString(),
        FISH: allowances[4].toString()
      });
    } catch (error) {
      console.error("Error fetching token allowance:", error);
    } finally {
      setLoading(false);
    }
  }, [
    woodInTheBlockchainLand,
    rockInTheBlockchainLand,
    CLAYInTheBlockchainLand,
    woolInTheBlockchainLand,
    fishInTheBlockchainLand,
    account,
    tradeOffer
  ]);

  const getNumberOfOffers = useCallback(async () => {
    setLoading(true);
    try {
      const count = await tradeOffer.getNumberOfOffers();
      setNumberOfOffers(count.toNumber());
    } catch (error) {
      console.error("Error fetching number of offers:", error);
    } finally {
      setLoading(false);
    }
  }, [tradeOffer]);

  const getOfferInfo = useCallback(async () => {
    setLoading(true);
    try {
      const offerPromises = [];
      for (let i = 0; i < numberOfOffers; i++) {
        offerPromises.push(tradeOffer.getOfferById(i));
      }
      const offers = await Promise.all(offerPromises);
      setOfferData(
        offers.map((offer) => ({
          id: offer[0].toNumber(),
          offerString: offer[1].toString(),
          offerCrreator: offer[2].toString(),
          offerStatus: offer[3].toString()
        }))
      );
    } catch (error) {
      console.error("Error fetching offer info:", error);
    } finally {
      setLoading(false);
    }
  }, [numberOfOffers, tradeOffer]);

  const approveToken = useCallback(
    async (token: string) => {
      setLoading(true);
      try {
        let contract;
        let allowance;
        let approve;
        if (token === "WOOD") {
          contract = woodInTheBlockchainLand;
          allowance = allowances.WOOD;
          approve = woodInTheBlockchainLand.approve;
        } else if (token === "ROCK") {
          contract = rockInTheBlockchainLand;
          allowance = allowances.ROCK;
          approve = rockInTheBlockchainLand.approve;
        } else if (token === "CLAY") {
          contract = CLAYInTheBlockchainLand;
          allowance = allowances.CLAY;
          approve = CLAYInTheBlockchainLand.approve;
        } else if (token === "WOOL") {
          contract = woolInTheBlockchainLand;
          allowance = allowances.WOOL;
          approve = woolInTheBlockchainLand.approve;
        } else if (token === "FISH") {
          contract = fishInTheBlockchainLand;
          allowance = allowances.FISH;
          approve = fishInTheBlockchainLand.approve;
        }

        if (allowance === "0" || allowance === "") {
          await approve(tradeOffer.address, "1000000000000000000000000000000000000000000000000000000000000000000000000000000000");
        }
      } catch (error) {
        console.error(`Error approving ${token} token:`, error);
      } finally {
        setLoading(false);
      }
    },
    [
      allowances.WOOD,
      allowances.ROCK,
      allowances.CLAY,
      allowances.WOOL,
      allowances.FISH,
      woodInTheBlockchainLand,
      rockInTheBlockchainLand,
      CLAYInTheBlockchainLand,
      woolInTheBlockchainLand,
      fishInTheBlockchainLand,
      tradeOffer
    ]
  );

  const getStatusInfo = useCallback(async () => {
    setLoading(true);
    try {
      const offerStatusPromises = [];
      for (let i = 0; i < numberOfOffers; i++) {
        offerStatusPromises.push(tradeOffer.getOfferStatus(i));
      }
      const statuses = await Promise.all(offerStatusPromises);
      setOfferStatusArray(statuses.map((status) => status.toString()));
    } catch (error) {
      console.error("Error fetching offer status:", error);
    } finally {
      setLoading(false);
    }
  }, [numberOfOffers, tradeOffer]);

  const handleConnect = useCallback(async () => {
    setLoading(true);
    try {
      await connect();
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setLoading(false);
    }
  }, [connect]);

  const handleDisconnect = useCallback(async () => {
    setLoading(true);
    try {
      await disconnect();
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
    } finally {
      setLoading(false);
    }
  }, [disconnect]);

  const handleTokenAmountChange = (index: number, value: number) => {
    const updatedTokenAmounts = [...tokenAmounts];
    updatedTokenAmounts[index] = value;
    setTokenAmounts(updatedTokenAmounts);
  };

  const handleTokenOfferedChange = (index: number, token: string) => {
    const updatedTokensOfferedData = [...tokensOfferedData];
    updatedTokensOfferedData[index] = token;
    setTokensOfferedData(updatedTokensOfferedData);
  };

  const handleTokenWantedChange = (index: number, token: string) => {
    const updatedTokensWantedData = [...tokensWantedData];
    updatedTokensWantedData[index] = token;
    setTokensWantedData(updatedTokensWantedData);
  };

  const handleAddTokenOffered = () => {
    const newTokenOffered = { id: counterOffered + 1, token: "", amount: 0 };
    setTokensOffered([...tokensOffered, newTokenOffered]);
    setCounterOffered(counterOffered + 1);
  };

  const handleAddTokenWanted = () => {
    const newTokenWanted = { id: counterWanted + 1, token: "", amount: 0 };
    setTokensWanted([...tokensWanted, newTokenWanted]);
    setCounterWanted(counterWanted + 1);
  };

  const handleRemoveTokenOffered = (id: number) => {
    const updatedTokensOffered = tokensOffered.filter((token) => token.id !== id);
    setTokensOffered(updatedTokensOffered);
  };

  const handleRemoveTokenWanted = (id: number) => {
    const updatedTokensWanted = tokensWanted.filter((token) => token.id !== id);
    setTokensWanted(updatedTokensWanted);
  };

  const handleSubmitOffer = useCallback(async () => {
    setLoading(true);
    try {
      const tokensOfferedToSend = tokensOffered
        .filter((token) => token.token !== "" && token.amount > 0)
        .map((token) => token.token);

      const tokensWantedToSend = tokensWanted
        .filter((token) => token.token !== "" && token.amount > 0)
        .map((token) => token.token);

      if (tokensOfferedToSend.length === 0 || tokensWantedToSend.length === 0) {
        console.error("Please select at least one token to offer and one token to request.");
        return;
      }

      const amountsToSend = tokenAmounts
        .filter((amount) => amount !== undefined && amount > 0)
        .map((amount) => amount.toString());

      if (amountsToSend.length !== tokensOfferedToSend.length) {
        console.error("Please provide amounts for all offered tokens.");
        return;
      }

      await tradeOffer.submitOffer(tokensOfferedToSend, amountsToSend, tokensWantedToSend);
    } catch (error) {
      console.error("Error submitting offer:", error);
    } finally {
      setLoading(false);
    }
  }, [tokensOffered, tokenAmounts, tokensWanted, tradeOffer]);

  const handleApproveAndSubmit = useCallback(async () => {
    setLoading(true);
    try {
      const tokensToApprove = [...new Set([...tokensOfferedData, ...tokensWantedData])];
      const approvePromises = tokensToApprove.map((token) => approveToken(token));
      await Promise.all(approvePromises);
      setIsApproved({
        WOOD: allowances.WOOD !== "0" && allowances.WOOD !== "",
        ROCK: allowances.ROCK !== "0" && allowances.ROCK !== "",
        CLAY: allowances.CLAY !== "0" && allowances.CLAY !== "",
        WOOL: allowances.WOOL !== "0" && allowances.WOOL !== "",
        FISH: allowances.FISH !== "0" && allowances.FISH !== ""
      });
      await handleSubmitOffer();
    } catch (error) {
      console.error("Error approving and submitting offer:", error);
    } finally {
      setLoading(false);
    }
  }, [
    tokensOfferedData,
    tokensWantedData,
    allowances,
    approveToken,
    handleSubmitOffer
  ]);

  const handleAcceptOffer = useCallback(
    async (offerId: string) => {
      setLoading(true);
      try {
        const offerToAcceptArray = [offerId];
        setCurrentOfferToAccept(offerToAcceptArray);
        setOfferToAccept([...offerToAcceptArray, ...offerToAccept]);
        await tradeOffer.acceptOffer(Number(offerId));
      } catch (error) {
        console.error("Error accepting offer:", error);
      } finally {
        setLoading(false);
      }
    },
    [offerToAccept, tradeOffer]
  );

  return (
    <div className="app">
      {loading && (
        <div className="loading-overlay">
          <HashLoader color="#36D7B7" />
        </div>
      )}

      <header className="app-header">
        <h1>Token Trading Marketplace</h1>
        {account ? (
          <button className="disconnect-button" onClick={handleDisconnect}>
            Disconnect Wallet
          </button>
        ) : (
          <button className="connect-button" onClick={handleConnect}>
            Connect Wallet
          </button>
        )}
      </header>

      <div className="app-content">
        {account && (
          <div className="account-info">
            <p>Connected Account: {account}</p>
            <p>Chain ID: {chainId}</p>
          </div>
        )}

        <div className="token-allowances">
          <h2>Token Allowances</h2>
          <div className="allowance-container">
            <div className="allowance">
              <p>WOOD</p>
              <p>{allowances.WOOD}</p>
              {!isApproved.WOOD && (
                <button onClick={() => approveToken("WOOD")}>Approve</button>
              )}
            </div>
            <div className="allowance">
              <p>ROCK</p>
              <p>{allowances.ROCK}</p>
              {!isApproved.ROCK && (
                <button onClick={() => approveToken("ROCK")}>Approve</button>
              )}
            </div>
            <div className="allowance">
              <p>CLAY</p>
              <p>{allowances.CLAY}</p>
              {!isApproved.CLAY && (
                <button onClick={() => approveToken("CLAY")}>Approve</button>
              )}
            </div>
            <div className="allowance">
              <p>WOOL</p>
              <p>{allowances.WOOL}</p>
              {!isApproved.WOOL && (
                <button onClick={() => approveToken("WOOL")}>Approve</button>
              )}
            </div>
            <div className="allowance">
              <p>FISH</p>
              <p>{allowances.FISH}</p>
              {!isApproved.FISH && (
                <button onClick={() => approveToken("FISH")}>Approve</button>
              )}
            </div>
          </div>
        </div>

        <div className="trade-offers">
          <h2>Trade Offers</h2>
          <div className="offer-list">
            {offerData.map((offer) => (
              <div key={offer.id} className="offer">
                <p>Offer: {offer.offerString}</p>
                <p>Creator: {offer.offerCrreator}</p>
                <p>Status: {offer.offerStatus}</p>
                {offer.offerStatus === "0" && (
                  <button onClick={() => handleAcceptOffer(offer.id.toString())}>
                    Accept Offer
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="submit-offer">
          <h2>Submit Offer</h2>
          <div className="token-offered-container">
            <h3>Tokens Offered</h3>
            {tokensOffered.map((token) => (
              <div key={token.id} className="token-offered">
                <select
                  value={token.token}
                  onChange={(e) =>
                    handleTokenOfferedChange(token.id - 1, e.target.value)
                  }
                >
                  <option value="">Select Token</option>
                  <option value="WOOD">WOOD</option>
                  <option value="ROCK">ROCK</option>
                  <option value="CLAY">CLAY</option>
                  <option value="WOOL">WOOL</option>
                  <option value="FISH">FISH</option>
                </select>
                <input
                  type="number"
                  placeholder="Amount"
                  value={tokenAmounts[token.id - 1]}
                  onChange={(e) =>
                    handleTokenAmountChange(token.id - 1, parseInt(e.target.value))
                  }
                />
                <button onClick={() => handleRemoveTokenOffered(token.id)}>
                  Remove
                </button>
              </div>
            ))}
            <button onClick={handleAddTokenOffered}>Add Token</button>
          </div>

          <div className="token-wanted-container">
            <h3>Tokens Wanted</h3>
            {tokensWanted.map((token) => (
              <div key={token.id} className="token-wanted">
                <select
                  value={token.token}
                  onChange={(e) =>
                    handleTokenWantedChange(token.id - 1, e.target.value)
                  }
                >
                  <option value="">Select Token</option>
                  <option value="WOOD">WOOD</option>
                  <option value="ROCK">ROCK</option>
                  <option value="CLAY">CLAY</option>
                  <option value="WOOL">WOOL</option>
                  <option value="FISH">FISH</option>
                </select>
                <input
                  type="number"
                  placeholder="Amount"
                  value={tokenAmounts[token.id - 1]}
                  onChange={(e) =>
                    handleTokenAmountChange(token.id - 1, parseInt(e.target.value))
                  }
                />
                <button onClick={() => handleRemoveTokenWanted(token.id)}>
                  Remove
                </button>
              </div>
            ))}
            <button onClick={handleAddTokenWanted}>Add Token</button>
          </div>

          <button onClick={handleApproveAndSubmit}>Approve & Submit</button>
        </div>
      </div>
    </div>
  );
}

export default App;
