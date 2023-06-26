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

      const [woodAllowance, rockAllowance, clayAllowance, woolAllowance, fishAllowance] = await Promise.all(allowancePromises);

      setAllowances({
        WOOD: woodAllowance.toString(),
        ROCK: rockAllowance.toString(),
        CLAY: clayAllowance.toString(),
        WOOL: woolAllowance.toString(),
        FISH: fishAllowance.toString()
      });
    } catch (error) {
      console.log("Error fetching allowances: ", error);
    } finally {
      setLoading(false);
    }
  }, [account, tradeOffer.address, woodInTheBlockchainLand, rockInTheBlockchainLand, CLAYInTheBlockchainLand, woolInTheBlockchainLand, fishInTheBlockchainLand]);

  const getNumberOfOffers = useCallback(async () => {
    setLoading(true);
    try {
      const offersCount = await tradeOffer.getNumberOfOffers();
      setNumberOfOffers(offersCount.toNumber());
    } catch (error) {
      console.log("Error fetching number of offers: ", error);
    } finally {
      setLoading(false);
    }
  }, [tradeOffer]);

  const getOfferInfo = useCallback(async () => {
    setLoading(true);
    try {
      const offerPromises = Array(numberOfOffers)
        .fill(undefined)
        .map((_, index) => tradeOffer.offers(index + 1));

      const offers = await Promise.all(offerPromises);

      const parsedOffers = offers.map((offer) => ({
        id: offer.offerId.toNumber(),
        offerString: offer.offerString,
        offerCrreator: offer.offerCreator,
        offerStatus: offer.offerStatus
      }));

      setOfferData(parsedOffers);
    } catch (error) {
      console.log("Error fetching offer info: ", error);
    } finally {
      setLoading(false);
    }
  }, [numberOfOffers, tradeOffer]);

  const handleConnect = () => {
    connect();
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const handleTokenAmountChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = event.target;

    setTokenAmounts((prevAmounts) => {
      const updatedAmounts = [...prevAmounts];
      updatedAmounts[index] = value;
      return updatedAmounts;
    });
  };

  const handleTokensOfferedChange = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const { value } = event.target;

    setTokensOfferedData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = value;
      return updatedData;
    });
  };

  const handleTokensWantedChange = (event: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const { value } = event.target;

    setTokensWantedData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = value;
      return updatedData;
    });
  };

  /// Rest of the code...

const handleCreateOffer = async () => {
  setLoading(true);
  try {
    const tokenAmountsBN = tokenAmounts.map((amount) => ethers.utils.parseUnits(amount, 18));

    await tradeOffer.createOffer(tokenAmountsBN, tokensOfferedData, tokensWantedData);
    // Refresh offer data
    await getNumberOfOffers();
    await getOfferInfo();
  } catch (error) {
    console.log("Error creating offer: ", error);
  } finally {
    setLoading(false);
  }
};

const handleCancelOffer = async (offerId) => {
  setLoading(true);
  try {
    await tradeOffer.cancelOffer(offerId);
    // Refresh offer data
    await getNumberOfOffers();
    await getOfferInfo();
  } catch (error) {
    console.log("Error canceling offer: ", error);
  } finally {
    setLoading(false);
  }
};

return (
  <main className="main">
    <div className="button-container">
      {!account ? (
        <button className="addbtn connect" onClick={handleConnectXDCPay}>
          Connect XDCPay
        </button>
      ) : (
        <button className="addbtn connected" onClick={handleDisconnectWallet}>
          {ellipseAddress(account)}
        </button>
      )}
    </div>
    <div className="container">
      {/* Open Offers */}
      <div className="open-offers">
        <h2>Marketplace Offers (List of Open Offers)</h2>
        {querriedOffers.length > 0 ? (
          <ul>
            {querriedOffers
              .filter((offer) => typeof offer === "object" && offer !== null)
              .map((offer, index) => (
                <li key={offer.id}>
                  <strong>Offer Id: {offer?.id}</strong>
                  <p>{offer.offerString}</p>
                  <div>
                    {loading ? (
                      <HashLoader color="#0ca02c" />
                    ) : (
                      <button
                        className={`defaultbtn ${
                          [
                            "Accept Offer",
                            "Transact",
                            "Approve WOOD",
                            "Approve ROCK",
                            "Approve CLAY",
                            "Approve WOOL",
                            "Approve FISH",
                          ].includes(marketplaceButtonName[index])
                            ? "acceptbtn"
                            : marketplaceButtonName[index] === "Cancel Offer"
                            ? "cancelbtn"
                            : "graybtn"
                        }`}
                        onClick={() => {
                          switch (marketplaceButtonName[index]) {
                            case "Cancel Offer":
                              handleCancelOffer(offer?.id);
                              break;
                            case "Accept Offer":
                              handleAcceptOffer(offer?.id);
                              break;
                            case "Approve WOOD":
                              handleApproveWood(true);
                              break;
                            case "Approve ROCK":
                              handleApproveRock(true);
                              break;
                            case "Approve CLAY":
                              handleApproveClay(true);
                              break;
                            case "Approve WOOL":
                              handleApproveWool(true);
                              break;
                            case "Approve FISH":
                              handleApproveFish(true);
                              break;
                            case "Transact":
                              handleTransactAcceptOffer(offer?.id);
                              break;
                            default:
                              console.log("");
                          }
                        }}
                      >
                        {marketplaceButtonName[index]}
                      </button>
                    )}
                  </div>
                </li>
              ))}
          </ul>
        ) : (
          <p>No open offers available.</p>
        )}
      </div>

      {/* Tokens Offered */}
      <div>
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

        <button className="addbtn" onClick={handleAddTokenOffered}>
          Add Another
        </button>

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

        <button className="addbtn" onClick={handleAddTokenWanted}>
          Add Another
        </button>

        <div>
          {loading ? (
            <HashLoader color="#0ca02c" />
          ) : (
            <button
              id="create-offer"
              onClick={() => {
                switch (buttonName) {
                  case "Create Offer":
                    handleCreateOffer();
                    break;
                  case "Submit Offer":
                    handleSubmitOffer();
                    break;
                  case "Approve WOOD":
                    handleApproveWood(false);
                    break;
                  case "Approve ROCK":
                    handleApproveRock(false);
                    break;
                  case "Approve CLAY":
                    handleApproveClay(false);
                    break;
                  case "Approve WOOL":
                    handleApproveWool(false);
                    break;
                  case "Approve FISH":
                    handleApproveFish(false);
                    break;
                  default:
                    console.log("");
                }
              }}
            >
              {buttonName}
            </button>
          )}
        </div>
      </div>
    </div>
  </main>
);

};