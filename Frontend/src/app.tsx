import React, { useState, useCallback, useEffect } from "react";
import "./app.css";
import { Web3ModalContext } from "./contexts/Web3ModalProvider";
import { BlockchainContext } from "./contexts/BlockchainProvider";
import { HashLoader } from "react-spinners";

interface Offer {
  id: number;
  tokensOffered: { id: number; token: string; amount: number }[];
  tokensWanted: { id: number; token: string; amount: number }[];
  status: string;
  creator: string | null;
  date: string; // Date field
  time: string; // Time field
}

interface QuerriedOffer {
  id: number;
  offerString: string | null;
  offerCrreator: string | null;
  date: string; // Date field
  time: string; // Time field
}

const App: React.FC = () => {
  // Accessing the Web3ModalContext
  const { web3, account, connect, disconnect, signer, chainId } = React.useContext(
    Web3ModalContext
  );



  // add the blockchain context 
  const {
    woodInTheBlockchainLand: WoodInTheBlockchainLandWrapper,
    rockInTheBlockchainLand: RockInTheBlockchainLandWrapper,
    CLAYInTheBlockchainLand: CLAYInTheBlockchainLandWrapper,
    woolInTheBlockchainLand: WoolInTheBlockchainLandWrapper,
    fishInTheBlockchainLand: FishInTheBlockchainLandWrapper,
    tradeOffer: tradeOfferWrapper

  } = React.useContext(BlockchainContext);

  //Loading state
  const [loading, setLoading] = useState<boolean>(false)


  //allowance status
  const [woodAllowance, setWoodAllowance] = useState("");
  const [rockAllowance, setRockAllowance] = useState("");
  const [clayAllowance, setClayAllowance] = useState("");
  const [woolAllowance, setWoolAllowance] = useState("");
  const [fishAllowance, setFishAllowance] = useState("");

  //available Offers data
  const [numberOfOffers, setNumberOfOffers] = useState(0);

  const [offerStatus, setOfferStatus] = useState<string>('');
  const [offerString, setOfferString] = useState<string>('');
  const [offerCreator, setOfferCreator] = useState<string>('');
  const [offerStringArray, setOfferStringArray] = useState<string[]>([]);
  const [offerStatusArray, setOfferStatusArray] = useState<string[]>([]);
  const [offerCreatorArray, setOfferCreatorArray] = useState<string[]>([]);


  // State for open offers
  const [querriedOffers, setQuerriedOffers] = useState<QuerriedOffer[]>([]);

  const getNumberOfOffers = async () => {
    if (web3 && account && chainId) { 
      const _numberOfOffers = await tradeOfferWrapper?.getNumberOfOffers();
      if (Number(_numberOfOffers) > 0) {
        setNumberOfOffers(Number(_numberOfOffers));
      }
      else {
        setNumberOfOffers(0);
      }
    }
  }

  const fetchOfferInfo = useCallback(async () => {
    try {
      for (let i = 0; i < numberOfOffers; i++) {
        await getOfferInfo(i);
        let newOffer: QuerriedOffer = {
          id: i + 1,
          offerString: offerStringArray[i+1],
          offerCrreator: offerCreator,
          date: "",
          time: "",
        };

        setQuerriedOffers((prevState) => [...prevState, newOffer]);
      }
    } catch (error) {
      console.error("Error fetching offer info:", error);
    }
  }, [numberOfOffers]);

  useEffect(() => {
    for (let i = 0; i < numberOfOffers; i++) {
      getOfferInfo(i);
    }
  }, [numberOfOffers]);

  useEffect (() =>{
    setOfferStatusArray((prevState) => {
      const newOfferStatusArray = [...prevState];
      newOfferStatusArray.push(String(Boolean(offerStatus)));
      return newOfferStatusArray;
    });    
  },[offerStatus])

  useEffect (() =>{
    setOfferStringArray((prevState) => {
      const newOfferStringArray = [...prevState];
      newOfferStringArray.push(String(offerString));
      return newOfferStringArray;
    });    
  },[offerString])

  useEffect (() =>{
    setOfferCreatorArray((prevState) => {
      const newOfferCreatorArray = [...prevState];
      newOfferCreatorArray.push(String(Boolean(offerCreator)));
      return newOfferCreatorArray;
    });    
  },[offerStatus])

  useEffect(() => {
    fetchOfferInfo();
  }, [fetchOfferInfo]);

  useEffect(() => {
    // console.log(querriedOffers);
  }, [querriedOffers])

  useEffect(() => {
    // console.log(offerCreatorArray);
  }, [offerCreatorArray]);

  useEffect(() => {
    console.log(offerStringArray);
  }, [offerStringArray]);

  useEffect(() => {
    // console.log(offerStatusArray);
  }, [offerStatusArray]);



  const [tokenAmounts, setTokenAmounts] = useState(Array(10).fill(undefined));
  const [tokensOfferedData, setTokensOfferedData] = useState(Array(5).fill(undefined));
  const [tokensWantedData, setTokensWantedData] = useState(Array(5).fill(undefined));
  const [isApproved, setIsApproved] = useState({
    WOOD: false,
    ROCK: false,
    CLAY: false,
    WOOL: false,
    FISH: false
  })


  const [buttonName, setButtonName] = useState("Submit Offer");

  const getTokenAllowance = async () => {
    if (web3 && account && chainId) {
      const _woodAllowance = await WoodInTheBlockchainLandWrapper?.allowance();
      setWoodAllowance(String(Number(_woodAllowance) / 10 ** 18) || "0");

      const _rockAllowance = await RockInTheBlockchainLandWrapper?.allowance();
      setRockAllowance(String(Number(_rockAllowance) / 10 ** 18) || "0");

      const _clayAllowance = await CLAYInTheBlockchainLandWrapper?.allowance();
      setClayAllowance(String(Number(_clayAllowance) / 10 ** 18) || "0");
      // console.log(_clayAllowance);
      const _woolAllowance = await WoolInTheBlockchainLandWrapper?.allowance();
      setWoolAllowance(String(Number(_woolAllowance) / 10 ** 18) || "0");

      const _fishAllowance = await FishInTheBlockchainLandWrapper?.allowance();
      setFishAllowance(String(Number(_fishAllowance) / 10 ** 18) || "0");
    }
  }

  const getOfferInfo = async (offerId: number) => {
    try {
      if (web3 && account && chainId) {
        const _offerStatus = await tradeOfferWrapper?.getOfferStatus(offerId);
        setOfferStatus(String(Boolean(_offerStatus)));
        // console.log(_offerStatus);

        const _offerString = await tradeOfferWrapper?.getOfferString(offerId);
        setOfferString(String(_offerString));
        // console.log(_offerString);

        const _offerCreator = await tradeOfferWrapper?.getOfferCreator(offerId);
        setOfferCreator(String(_offerCreator));
        // console.log(_offerCreator);
      }
    } catch (error) {
      console.error("Error fetching offer info:", error);
    }
  };



  const tempTokenAmounts: number[] = new Array(10);


  // State for tokens offered and tokens wanted
  const [tokensOffered, setTokensOffered] = useState([
    { id: 1, token: "", amount: 0 }
  ]);
  const [tokensWanted, setTokensWanted] = useState([
    { id: 1, token: "", amount: 0 }
  ]);


  const [openOffers, setOpenOffers] = useState<Offer[]>([]);

  useEffect(() => {
    getTokenAllowance();
    getNumberOfOffers();
  });

  useEffect(() => {
    console.log(numberOfOffers);
  }, [numberOfOffers])

  // Declare counter states for each button
  const [counterWanted, setCounterWanted] = useState(0);
  const [counterOffered, setCounterOffered] = useState(0);

  // Function to add a new token to the tokensOffered state
  const handleAddTokenOffered = () => {
    if (counterOffered < 4) {
      const newToken = { id: tokensOffered.length + 1, token: "", amount: 0 };
      setTokensOffered([...tokensOffered, newToken]);
      setCounterOffered(counterOffered + 1);
      console.log(newToken);
    }
  };

  // Function to add a new token to the tokensWanted state
  const handleAddTokenWanted = () => {
    if (counterWanted < 4) {
      const newToken = { id: tokensWanted.length + 1, token: "", amount: 0 };
      setTokensWanted([...tokensWanted, newToken]);
      setCounterWanted(counterWanted + 1);
      console.log({ newToken, tokensWanted });
    }
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

  }

  // Function to handle form submission
  const handleSubmitOffer = useCallback(async () => {
    // Validate the form inputs before submitting
    if (tokensOffered.some((token) => token.token === "" || token.amount === 0)) {
      alert("Please fill in all the token offered fields.");
      return;
    }
    if (tokensWanted.some((token) => token.token === "" || token.amount === 0)) {
      alert("Please fill in all the token wanted fields.");
      return;
    }
    changeButtonName()
    createOrderedArray();

  }, [web3, account, tokensOffered, tokensWanted])

  function changeButtonName() {

    for (let i = 0; i < tokensOffered.length; i++) {
      // console.log(approveStep, tokensOffered.length);

      if (tokensOffered[i].token.length == 0) {
        return
      } else if (!isApproved[tokensOffered[i].token] && tokensOffered[i].token.length > 0) {
        const bName = `Approve ${tokensOffered[i].token}`
        setButtonName(bName);
        break;
      }
      setButtonName("Create Offer")
    }
  }

  useEffect(() => {
    changeButtonName()
  }, [isApproved])

  const createOrderedArray = () => {
    // Create an array to store the ordered Offered tokens

    const newOfferedData = Array(5).fill(undefined); // Create an array with 5 undefined elements
    // console.log(tokensOffered);

    for (let i = 0; i < tokensOffered.length; i++) {
      if (tokensOffered[i].token === "WOOD") {
        newOfferedData[0] = tokensOffered[i].amount;
      } else if (tokensOffered[i].token === "ROCK") {
        newOfferedData[1] = tokensOffered[i].amount;
      } else if (tokensOffered[i].token === "CLAY") {
        newOfferedData[2] = tokensOffered[i].amount;
      } else if (tokensOffered[i].token === "WOOL") {
        newOfferedData[3] = tokensOffered[i].amount;
      } else if (tokensOffered[i].token === "FISH") {
        newOfferedData[4] = tokensOffered[i].amount;
      }
      // console.log(newOfferedData);
    }

    setTokensOfferedData(newOfferedData);

    // Create an array to store the ordered Wanted tokens


    const newWantedData = Array(5).fill(undefined); // Create an array with 5 undefined elements

    for (let i = 0; i < tokensWanted.length; i++) {
      if (tokensWanted[i].token === "WOOD") {
        newWantedData[0] = tokensWanted[i].amount;
      } else if (tokensWanted[i].token === "ROCK") {
        newWantedData[1] = tokensWanted[i].amount;
      } else if (tokensWanted[i].token === "CLAY") {
        newWantedData[2] = tokensWanted[i].amount;
      } else if (tokensWanted[i].token === "WOOL") {
        newWantedData[3] = tokensWanted[i].amount;
      } else if (tokensWanted[i].token === "FISH") {
        newWantedData[4] = tokensWanted[i].amount;
      }
    }

    setTokensWantedData(newWantedData);

    const newTokenAmounts = Array(10).fill(undefined);

    for (let i = 0; i < newOfferedData.length; i++) {
      newTokenAmounts[i] = newOfferedData[i]
    }


    for (let i = 0; i < newWantedData.length; i++) {
      newTokenAmounts[i + 5] = newWantedData[i]
    }

    for (let i = 0; i < 10; i++) {
      if (typeof newTokenAmounts[i] === "undefined") {
        newTokenAmounts[i] = 0;
      }
    }
    setTokenAmounts(newTokenAmounts);




    const tokenAmountsTuple = tokenAmounts as [number, number, number, number, number, number, number, number, number, number];


  }

  // Function to handle form submission
  const handleCreateOffer = useCallback(async () => {
    // Validate the form inputs before submitting
    if (tokensOffered.some((token) => token.token === "" || token.amount === 0)) {
      alert("Please fill in all the token offered fields.");
      return;
    }
    if (tokensWanted.some((token) => token.token === "" || token.amount === 0)) {
      alert("Please fill in all the token wanted fields.");
      return;
    }


    // Create an array to store the ordered Offered tokens

    for (let i = 0; i < tokensOffered.length; i++) {
      if (tokensOffered[i].token === "WOOD") {
        tokensOfferedData[0] = tokensOffered[i].amount;
      } else if (tokensOffered[i].token === "ROCK") {
        tokensOfferedData[1] = tokensOffered[i].amount;
      } else if (tokensOffered[i].token === "CLAY") {
        tokensOfferedData[2] = tokensOffered[i].amount;
      } else if (tokensOffered[i].token === "WOOL") {
        tokensOfferedData[3] = tokensOffered[i].amount;
      } else if (tokensOffered[i].token === "FISH") {
        tokensOfferedData[4] = tokensOffered[i].amount;
      }
    }
    console.log(tokensOfferedData);

    // Create an array to store the ordered Wanted tokens

    for (let i = 0; i < tokensWanted.length; i++) {
      if (tokensWanted[i].token === "WOOD") {
        tokensWantedData[0] = tokensWanted[i].amount;
      } else if (tokensWanted[i].token === "ROCK") {
        tokensWantedData[1] = tokensWanted[i].amount;
      } else if (tokensWanted[i].token === "CLAY") {
        tokensWantedData[2] = tokensWanted[i].amount;
      } else if (tokensWanted[i].token === "WOOL") {
        tokensWantedData[3] = tokensWanted[i].amount;
      } else if (tokensWanted[i].token === "FISH") {
        tokensWantedData[4] = tokensWanted[i].amount;
      }
    }



    for (let i = 0; i < tokensOfferedData.length; i++) {
      tokenAmounts[i] = tokensOfferedData[i]
    }


    for (let i = 0; i < tokensWantedData.length; i++) {
      tokenAmounts[i + 5] = tokensWantedData[i]
    }

    for (let i = 0; i < 10; i++) {
      if (typeof tokenAmounts[i] === "undefined") {
        tokenAmounts[i] = 0;
      }
    }
    console.log(tokenAmounts);

    const tokenAmountsTuple = tokenAmounts as [number, number, number, number, number, number, number, number, number, number];

    if (web3 && account && chainId) {
      setLoading(true);
      tradeOfferWrapper
        ?.makeOffer(...tokenAmountsTuple)
        .then(() => {
          alert("Offer created successfully!");
        })
        .then(() => {
          setLoading(false);
          window.location.reload();
        })
        .catch((err) => {
          alert(`Error: ${err.message}`);
        });
    }

    // Reset the form after submission
    setTokensOffered([{ id: 1, token: "", amount: 0 }]);
    setTokensWanted([{ id: 1, token: "", amount: 0 }]);
    setButtonName('Creating Offer')
  }, [web3, account, tokensOffered, tokensWanted, tradeOfferWrapper]);

  // Function to connect to XDCPay
  const handleConnectXDCPay = useCallback(() => {
    connect();
  }, [connect]);

  // Function to disconnect from the wallet
  const handleDisconnectWallet = useCallback(() => {
    disconnect();
  }, [disconnect]);

  function ellipseAddress(address: string = "", width: number = 4): string {
    return `xdc${address.slice(2, width + 2)}...${address.slice(-width)}`;
  }

  const handleApproveWood = () => {
    // if (web3 && account && chainId) {

    if (tokenAmounts[0] > 0) {
      if (woodAllowance === "0") {
        setLoading(true);
        WoodInTheBlockchainLandWrapper
          ?.approve()
          .then(() => {
            setLoading(false);
            alert(" Wood Approved!");
            setIsApproved(prevState => {
              return { ...prevState, WOOD: true }
            })
          })
      }
      else {
        alert(" Wood Approved!");
        setIsApproved(prevState => {
          return { ...prevState, WOOD: true }
        })
      }
    }
  }

  const handleApproveRock = () => {
    if (web3 && account && chainId) {
      if (tokenAmounts[1] > 0) {
        if (rockAllowance === "0") {
          setLoading(true);
          RockInTheBlockchainLandWrapper
            ?.approve()
            .then(() => {
              setLoading(false);
              alert("Rock Approved!");
              setIsApproved(prevState => {
                return { ...prevState, ROCK: true };
              });
            });
        } else {
          alert("Rock Approved!");
          setIsApproved(prevState => {
            return { ...prevState, ROCK: true };
          });
        }
      }
    }
  };

  const handleApproveClay = () => {
    if (web3 && account && chainId) {
      if (tokenAmounts[2] > 0) {
        if (clayAllowance === "0") {
          setLoading(true);
          CLAYInTheBlockchainLandWrapper
            ?.approve()
            .then(() => {
              setLoading(false);
              alert("Clay Approved!");
              setIsApproved(prevState => {
                return { ...prevState, CLAY: true };
              });
            });
        } else {
          alert("Clay Approved!");
          setIsApproved(prevState => {
            return { ...prevState, CLAY: true };
          });
        }
      }
    }
  };

  const handleApproveWool = () => {
    if (web3 && account && chainId) {
      if (tokenAmounts[3] > 0) {
        if (woolAllowance === "0") {
          setLoading(true);
          WoolInTheBlockchainLandWrapper
            ?.approve()
            .then(() => {
              alert("Wool Approved!");
              setLoading(false);
              setIsApproved(prevState => {
                return { ...prevState, WOOL: true };
              });
            });
        } else {
          alert("Wool Approved!");
          setIsApproved(prevState => {
            return { ...prevState, WOOL: true };
          });
        }
      }
    }
  };

  const handleApproveFish = () => {
    if (web3 && account && chainId) {
      if (tokenAmounts[4] > 0) {
        if (fishAllowance === "0") {
          setLoading(true);
          FishInTheBlockchainLandWrapper
            ?.approve()
            .then(() => {
              setLoading(false);
              alert("Fish Approved!");
              setIsApproved(prevState => {
                return { ...prevState, FISH: true };
              });
            });
        } else {
          alert("Fish Approved!");
          setIsApproved(prevState => {
            return { ...prevState, FISH: true };
          });
        }
      }
    }
  };


  // Function to initiate the trade
  // const initiateTrade = useCallback(
  //   async (offerId: number) => {
  //     try {
  //       // Perform the necessary steps to initiate the trade
  //       // console.log("Initiating trade for offer ID:", offerId);

  //       // Update the offer status to "In Progress" or any other desired value
  //       const updatedOffers = openOffers.map((offer) =>
  //         offer.id === offerId ? { ...offer, status: "In Progress" } : offer
  //       );
  //       setOpenOffers(updatedOffers);

  //       // Optional: Interact with a contract or perform additional logic
  //       // Declare and define the tradeOffer variable
  //       // const tradeOffer: TradeOffer | undefined = undefined; 
  //       // if (tradeOffer) {
  //       //   // Perform the tradeOffer action here
  //       //   await tradeOffer.performTrade(offerId);
  //       // }

  //       // Sign the transaction
  //       const signature = await signer.sign("Hello, World!");

  //       // Perform any necessary UI updates or display a success message to the user
  //     } catch (error) {
  //       // Handle errors
  //       console.error("Error initiating trade:", error);
  //       // Display an error message to the user
  //     }
  //   },
  //   [openOffers, signer]
  // );

  return (
    <main className="main">
      <div className="button-container">
        {!account ? (
          <button className="addbtn connect" onClick={handleConnectXDCPay}>Connect XDCPay</button>
        ) : (
          <button className="addbtn connected" onClick={handleDisconnectWallet}>{ellipseAddress(account)}</button>
        )}
      </div>
      <div className="container">
        {/* Open Offers */}
        <div className="open-offers">
          <h2>Marketplace Offers (List of Open Offers)</h2>
          {querriedOffers.length > 0 ? (
            <ul>
              {querriedOffers
                .filter((offer) => typeof offer === "object" && offer !== null) // Filter out inconsistent elements
                .map((offer) => (
                  <li key={offer.id}>
                    <strong>Offer #{offer.id}</strong>
                    <p>OfferString: {offer.offerString}</p>
                    <p>Creator: {offer.offerCrreator}</p>
                    <p>Date: {offer.date}</p>
                    <p>Time: {offer.time}</p>
                    <button onClick={() => handleSubmitOffer()}>TRADE</button>
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

          <button className="addbtn" onClick={handleAddTokenOffered}>Add Another</button>

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

          <button className="addbtn" onClick={handleAddTokenWanted}>Add Another</button>

          <div>
            {
              loading ? <HashLoader color="#0ca02c" /> : <button id="create-offer" onClick={() => {
                buttonName === "Create Offer" ? handleCreateOffer() :
                  buttonName === 'Submit Offer' ? handleSubmitOffer() :
                    buttonName === 'Approve WOOD' ? handleApproveWood() :
                      buttonName === 'Approve ROCK' ? handleApproveRock() :
                        buttonName === 'Approve CLAY' ? handleApproveClay() :
                          buttonName === 'Approve WOOL' ? handleApproveWool() :
                            buttonName === 'Approve FISH' ? handleApproveFish() :
                              console.log("")
              }}
              >
                {buttonName}
              </button>
            }
          </div>
        </div>
      </div>
    </main>
  );
};

export default App;