import React, { useState, useCallback, useEffect } from "react";
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
  const [offersNumber, setoffersNumber] = useState(0);

  const [offerStatus, setOfferStatus] = useState<string>('');
  const [offerString, setOfferString] = useState<string>('');
  const [offerCreator, setofferCreator] = useState<string>('');
  const [offerStringArray, setOfferStringArray] = useState<string[]>([]);
  const [offerStatusArray, setOfferStatusArray] = useState<string[]>([]);
  const [offerCreatorArray, setOfferCreatorArray] = useState<string[]>([]);


  // State for qurried offers
  const [querriedOffers, setQuerriedOffers] = useState<QuerriedOffer[]>([]);

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

  // State for tokens offered and tokens wanted
  const [tokensOffered, setTokensOffered] = useState([
    { id: 1, token: "", amount: 0 }
  ]);
  const [tokensWanted, setTokensWanted] = useState([
    { id: 1, token: "", amount: 0 }
  ]);

  // Declare counter states for each button
  const [counterWanted, setCounterWanted] = useState(0);
  const [counterOffered, setCounterOffered] = useState(0);

  //declare marketplace button name array
  const [marketplaceButtonName, setMarketplaceButtonName] = useState<string[]>([]);
  
  useEffect(() => {
    getStringInfo();
  });
  useEffect(() => {
    getStatusInfo();
  });
  useEffect(() => {
    getCreatorInfo();
  });

  useEffect(() => {
    getTokenAllowance();
  });

  useEffect(() => {
    //console.log(numberOfOffers);
  }, [numberOfOffers])

  const getTokenAllowance = async () => {
    if (web3 && account && chainId) {
      const _woodAllowance = await WoodInTheBlockchainLandWrapper?.allowance();
      setWoodAllowance(String(Number(_woodAllowance) / 10 ** 18) || "0");

      const _rockAllowance = await RockInTheBlockchainLandWrapper?.allowance();
      setRockAllowance(String(Number(_rockAllowance) / 10 ** 18) || "0");

      const _clayAllowance = await CLAYInTheBlockchainLandWrapper?.allowance();
      setClayAllowance(String(Number(_clayAllowance) / 10 ** 18) || "0");

      const _woolAllowance = await WoolInTheBlockchainLandWrapper?.allowance();
      setWoolAllowance(String(Number(_woolAllowance) / 10 ** 18) || "0");

      const _fishAllowance = await FishInTheBlockchainLandWrapper?.allowance();
      setFishAllowance(String(Number(_fishAllowance) / 10 ** 18) || "0");
    }
  }

  // const getNumberOfOffers = async () => {
  //   if (web3 && account && chainId) {
  //     const _numberOfOffers = await tradeOfferWrapper?.getNumberOfOffers();
  //     if (Number(_numberOfOffers) > 0) {
  //       setNumberOfOffers(Number(_numberOfOffers));
  //     }
  //     else {
  //       setNumberOfOffers(0);
  //     }
  //   }
  // }

  const fetchOfferInfo = useCallback(async () => {
    //console.log(offerStringArray[0] != undefined)
    //console.log(offerStringArray[0] != "")
    //console.log(offerStringArray[0] != undefined && offerStringArray[0] != "")
    if (offerStringArray[0] != undefined && offerStringArray[0] != "" && offerStringArray[0] != "undefined") {
      try {
        for (let i = 0; i < offerStringArray.length; i++) {
          if (offerStatusArray[i] != "false") {
            let newOffer: QuerriedOffer = {
              id: i + 1,
              offerString: offerStringArray[i],
              offerCrreator: offerCreatorArray[i],
              offerStatus: offerStatusArray[i]
            };
            // console.log(offerStringArray);
            setQuerriedOffers((prevState) => [...prevState, newOffer]);
            //console.log(offerStringArray[i])
          }
        }
      } catch (error) {
        console.error("Error fetching offer info:", error);
      }
    }
  }, [offerStringArray]);

  const getStringInfo = async () => {
    try {
      if (web3 && account && chainId) {
        const _offerString = await tradeOfferWrapper?.getOfferStringsArray();
        if (_offerString != offerStatus) {
          setOfferString(String(_offerString));
        }
        // console.log(_offerString);
      }
    } catch (error) {
      console.error("Error fetching offer info:", error);
    }
  };

  const getStatusInfo = async () => {
    try {
      if (web3 && account && chainId) {
        const _offerStatus = await tradeOfferWrapper?.getOfferStatusArray();
        // setOfferStatusArray((String(_offerStatus)).split(","));
        if (_offerStatus != offerStatus) {
          setOfferStatus(String(_offerStatus));
        }
        console.log(String(_offerStatus));
      }
    } catch (error) {
      console.error("Error fetching offer info:", error);
    }
  };

  const getCreatorInfo = async () => {
    try {
      if (web3 && account && chainId) {
        const _offerCreator = await tradeOfferWrapper?.getOfferCreatorsArray();
        if (_offerCreator != offerCreator) {
          setofferCreator(String(_offerCreator));
        }
        // console.log(_offerCreator);
      }
    } catch (error) {
      console.error("Error fetching offer info:", error);
    }
  };


  // Function to add a new token to the tokensOffered state
  const handleAddTokenOffered = () => {
    if (counterOffered < 4) {
      const newToken = { id: tokensOffered.length + 1, token: "", amount: 0 };
      setTokensOffered([...tokensOffered, newToken]);
      setCounterOffered(counterOffered + 1);
      //console.log(newToken);
    }
  };

  // Function to add a new token to the tokensWanted state
  const handleAddTokenWanted = () => {
    if (counterWanted < 4) {
      const newToken = { id: tokensWanted.length + 1, token: "", amount: 0 };
      setTokensWanted([...tokensWanted, newToken]);
      setCounterWanted(counterWanted + 1);
      //console.log({ newToken, tokensWanted });
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

  }, [web3, account, tokensOffered, tokensWanted]);

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

  // useEffect(() => {
  //   getOfferInfo();
  // }, [numberOfOffers]);

  useEffect(() => {
    const newOfferStatusArray = offerStatus.split(",");
    setOfferStatusArray(newOfferStatusArray);
    // setOfferStatusTest(offerStatus)
  }, [offerStatus])

  useEffect(() => {
    const newOfferStringArray = offerString.split(",");
    setOfferStringArray(newOfferStringArray);
  }, [offerString])

  useEffect(() => {
    const newOfferCreatorsArray = offerCreator.split(",");
    setOfferCreatorArray(newOfferCreatorsArray);
  }, [offerStatus])

  useEffect(() => {
    fetchOfferInfo();
  }, [fetchOfferInfo]);

  useEffect(() => {
    // console.log(querriedOffers);
  }, [querriedOffers])

  useEffect(() => {
    //console.log(offerCreatorArray);
  }, [offerCreatorArray]);

  useEffect(() => {
    //console.log(offerStringArray);
  }, [offerStringArray]);

  useEffect(() => {
    //console.log(offerStatusArray);
  }, [offerStatusArray]);

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

  useEffect(() => {
    for (let i = 0; i < offerCreatorArray.length; i++) {
      if (offerStatusArray[i] === "true")  
        {if (offerCreatorArray[i] === "true") {
          setMarketplaceButtonName(prevState => [...prevState, 'Cancel Offer']);
        } else {
          setMarketplaceButtonName(prevState => [...prevState, 'Accept Offer']);
        }}
    }
  }, [offerCreatorArray])

  useEffect(() => {
    console.log(marketplaceButtonName)
  }, [marketplaceButtonName])

  let counter = 0;

  useEffect(() => {
    if ((counter === 0) && (offerStatusArray[0] === "undefined" || offerStatusArray[0] === "" || offerStatusArray[0] === undefined )) {
      counter ++;
    } else if (counter ===1 && (offerStatusArray[0] === "undefined" || offerStatusArray[0] === "" || offerStatusArray[0] === undefined )) {
      window.location.reload();
    }
    console.log(offerStatusArray[0]);    
  }, [offerStatusArray])

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
    //console.log(tokensOfferedData);

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
    //console.log(tokenAmounts);

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
        })
        .then(() => {
          setLoading(false);
          window.location.reload();
        });
    }

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
                .map((offer, index) => (
                  <li key={offer.id}>
                    <strong>Offer Id: {offer?.id}</strong>
                    <p>{offer.offerString}</p>
                    <p>Your Offer: {offer?.offerCrreator}</p>
                    <p>Offer Status: {offer?.offerStatus}</p>
                    {/* <p>Date: {offer.date}</p>
                    <p>Time: {offer.time}</p> */}
                    <button className={`defaultbtn ${marketplaceButtonName[index]=="Accept Offer"? "acceptbtn":"cancelbtn"}`} onClick={() => handleSubmitOffer()}> {marketplaceButtonName[index]}</button>
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