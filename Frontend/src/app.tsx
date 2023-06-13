import React, { useState, useCallback, useEffect, useRef } from "react";
import "./app.css";
import { Web3ModalContext } from "./contexts/Web3ModalProvider";
import { BlockchainContext } from "./contexts/BlockchainProvider";

type TradeOffer = {
  offerId: number;
  offerCreator: string;
  offerAmount1: number;
  offerAmount2: number;
  offerAmount3: number;
  offerAmount4: number;
  offerAmount5: number;
  wantedAmount1: number;
  wantedAmount2: number;
  wantedAmount3: number;
  wantedAmount4: number;
  wantedAmount5: number;
  offerTimestamp: number;
  offerStatus: boolean;
};

interface Offer {
  id: number;
  tokensOffered: { id: number; token: string; amount: number }[];
  tokensWanted: { id: number; token: string; amount: number }[];
  status: string;
  creator: string | null;
  date: string; // Date field
  time: string; // Time field
}

// let tokenAmounts: number[] = new Array(10);
// let OfferSubmitted: boolean = false;


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


  //allowance status
  const [woodAllowance, setWoodAllowance] = useState("");
  const [rockAllowance, setRockAllowance] = useState("");
  const [clayAllowance, setClayAllowance] = useState("");
  const [woolAllowance, setWoolAllowance] = useState("");
  const [fishAllowance, setFishAllowance] = useState("");

  const [tokenAmounts, setTokenAmounts] = useState(Array(10).fill(undefined));
  const [tokensOfferedData, setTokensOfferedData] = useState(Array(5).fill(undefined));
  const [tokensWantedData, setTokensWantedData] = useState(Array(5).fill(undefined));

  const [OfferSubmitted, setOfferSubmit] = useState(false);
  const condition1Ref = useRef<boolean>(false);
  const condition2Ref = useRef<boolean>(false);
  const condition3Ref = useRef<boolean>(false);
  const condition4Ref = useRef<boolean>(false);
  const condition5Ref = useRef<boolean>(false);

  const [approvetep, setApproveStep] = useState(0);

  const [buttonName, setButtonName] = useState("Submit Offer");

  const getTokenAllowance = async () => {
    if (web3 && account && chainId) {
      const _woodAllowance = await WoodInTheBlockchainLandWrapper?.allowance();
      setWoodAllowance(String(Number(_woodAllowance) / 10 ** 18) || "0");
    
      const _rockAllowance = await RockInTheBlockchainLandWrapper?.allowance();
      setRockAllowance(String(Number(_rockAllowance) / 10 ** 18) || "0");
    
      const _clayAllowance = await CLAYInTheBlockchainLandWrapper?.allowance();
      setClayAllowance(String(Number(_clayAllowance) / 10 ** 18) || "0");
      console.log(_clayAllowance);
    
      const _woolAllowance = await WoolInTheBlockchainLandWrapper?.allowance();
      setWoolAllowance(String(Number(_woolAllowance) / 10 ** 18) || "0");
    
      const _fishAllowance = await FishInTheBlockchainLandWrapper?.allowance();
      setFishAllowance(String(Number(_fishAllowance) / 10 ** 18) || "0");
    }
  }


  const tempTokenAmounts: number[] = new Array(10);


  // State for tokens offered and tokens wanted
  const [tokensOffered, setTokensOffered] = useState([
    { id: 1, token: "", amount: 0 }
  ]);
  const [tokensWanted, setTokensWanted] = useState([
    { id: 1, token: "", amount: 0 }
  ]);


  // State for open offers
  const [openOffers, setOpenOffers] = useState<Offer[]>([]);
  // const tokensWantedData = Array(5);
  // const tokensOfferedData = Array(5);



  useEffect(() => {
    getTokenAllowance();
  });

  useEffect(() => {
    console.log(woodAllowance);
    console.log(rockAllowance);
    console.log(clayAllowance);
    console.log(woolAllowance);
    console.log(fishAllowance);
  }, [woodAllowance, rockAllowance, clayAllowance, woolAllowance, fishAllowance]);

  useEffect(() => {
    const tempTokenAmounts = [...tokenAmounts];
    console.log(tempTokenAmounts);
    if (tempTokenAmounts[0] > 0 && woodAllowance === "0") {
      condition1Ref.current = true;
    }
    if (tempTokenAmounts[1] > 0 && rockAllowance === "0") {
      condition2Ref.current = true;
    }
    if (tempTokenAmounts[2] > 0 && clayAllowance === "0") {
      condition3Ref.current = true;
    }
    if (tempTokenAmounts[3] > 0 && woolAllowance === "0") {
      condition4Ref.current = true;
    }
    if (tempTokenAmounts[4] > 0 && fishAllowance === "0") {
      condition5Ref.current = true;
    }
    // console.log(condition1Ref);
    // console.log(condition2Ref);
    // console.log(condition3Ref);
    // console.log(condition4Ref);
    // console.log(condition5Ref);
    console.log(tempTokenAmounts);
  }, [tokenAmounts, tempTokenAmounts, woodAllowance, rockAllowance, clayAllowance, woolAllowance, fishAllowance]);


  // Function to add a new token to the tokensOffered state
  const handleAddTokenOffered = () => {
    const newToken = { id: tokensOffered.length + 1, token: "", amount: 0 };
    setTokensOffered([...tokensOffered, newToken]);
    // console.log(newToken);
  };

  // Function to add a new token to the tokensWanted state
  const handleAddTokenWanted = () => {
    const newToken = { id: tokensWanted.length + 1, token: "", amount: 0 };
    setTokensWanted([...tokensWanted, newToken]);
    // console.log({newToken, tokensWanted});

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
    console.log(updatedTokens);

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
    const bName = `Approve ${tokensOffered[0].token}`
    setButtonName(bName);
    createOrderedArray();
    // setOfferSubmit(true);
    console.log(tokensOffered);
    console.log(tokensWanted);
    
    console.log(condition1Ref);
    console.log(condition2Ref);
    console.log(condition3Ref);
    console.log(condition4Ref);
    console.log(condition5Ref);
    console.log(tempTokenAmounts);

  }, [web3, account, tokensOffered, tokensWanted])

  const changeButtonName = () => {
    tokensOffered.forEach((token, id) => {
      setApproveStep(id + 1)
      switch (buttonName) {
        case 'Approve WOOD':
          setButtonName(`Approve ${token.token}`)           
          break
        case 'Approve ROCK':
          setButtonName(`Approve ${token.token}`)    
          break
          case 'Approve CLAY':
            setButtonName(`Approve ${token.token}`)    
            break
          case 'Approve WOOL':
            setButtonName(`Approve ${token.token}`)    
            break
          case 'Approve FISH':
            setButtonName(`Approve ${token.token}`)    
            break
          default:
            setButtonName("Create Offer")
            break
      }
    })}

  const createOrderedArray = () => {
    // Create an array to store the ordered Offered tokens

    const newOfferedData = Array(5).fill(undefined); // Create an array with 5 undefined elements
    console.log(tokensOffered);

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
      console.log(newOfferedData);
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
      console.log(newWantedData);
    }

    setTokensWantedData(newWantedData);
    console.log(tokensWantedData)

    const newTokenAmounts = Array(10).fill(undefined);

    for (let i = 0; i < newOfferedData.length; i++) {
      newTokenAmounts[i] = newOfferedData[i]
      //console.log(tokenAmounts);
    }


    for (let i = 0; i < newWantedData.length; i++) {
      newTokenAmounts[i + 5] = newWantedData[i]
      //console.log(tokenAmounts);
    }

    for (let i = 0; i < 10; i++) {
      if (typeof newTokenAmounts[i] === "undefined") {
        newTokenAmounts[i] = 0;
        //console.log(tokenAmounts);
      }
    }
    setTokenAmounts(newTokenAmounts);
    console.log(newTokenAmounts);

    console.log(tempTokenAmounts);
    console.log(tokenAmounts);



    const tokenAmountsTuple = tokenAmounts as [number, number, number, number, number, number, number, number, number, number];
    console.log(tokenAmountsTuple);


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
    //console.log(tokensWantedData);


    //console.log(tokensOfferedData)
    //console.log(tokensWantedData)

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
    console.log(tokenAmountsTuple);

    if (web3 && account && chainId) {
      tradeOfferWrapper
        ?.makeOffer(...tokenAmountsTuple)
        .then(() => {
          alert("Offer created successfully!");
        })
        .then(() => {
          window.location.reload();
        })
        .catch((err) => {
          alert(`Error: ${err.message}`);
        });
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
    if (web3 && account && chainId) {

      if (tokenAmounts[0] > 0) {
        WoodInTheBlockchainLandWrapper
          ?.approve()
          .then(() => {
            alert(" Wood Approved!");
            changeButtonName()
          })
      }
    }
  }

  const handleApproveRock = () => {
    if (web3 && account && chainId) {
      if (tokenAmounts[1] > 0) {
        RockInTheBlockchainLandWrapper
          ?.approve()
          .then(() => {
            alert(" Rock Approved!");
            changeButtonName()
          })
      }
    }
  }

  const handleApproveClay = () => {
    if (web3 && account && chainId) {
      if (tokenAmounts[2] > 0) {
        CLAYInTheBlockchainLandWrapper
          ?.approve()
          .then(() => {
            alert(" Clay Approved!");
            changeButtonName()
          })
      }
    }
  }

  const handleApproveWool = () => {
    if (web3 && account && chainId) {
      if (tokenAmounts[3] > 0) {
        WoolInTheBlockchainLandWrapper
          ?.approve()
          .then(() => {
            alert(" Wool Approved!");
            changeButtonName()
          })
      }
    }
  }

  const handleApproveFish = () => {
    if (web3 && account && chainId) {
      if (tokenAmounts[4] > 0) {
        FishInTheBlockchainLandWrapper
          ?.approve()
          .then(() => {
            alert(" Fish Approved!");
            changeButtonName()
          })
      }


    }
  }

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
        // Declare and define the tradeOffer variable
        // const tradeOffer: TradeOffer | undefined = undefined; 
        // if (tradeOffer) {
        //   // Perform the tradeOffer action here
        //   await tradeOffer.performTrade(offerId);
        // }

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
          <button onClick={handleDisconnectWallet}>{ellipseAddress(account)}</button>
        )}
      </div>
     <div className="container">
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

      {/* Create Offer button
      <button id="create-offer" onClick={handleSubmit}>
        CREATE OFFER TO TRADE
      </button> */}

      {/* {(tokenAmounts[0] > 0)? (
        <button id="create-offer" onClick={handleApproveWood}>
          APPROVE WOOD
        </button>
      ) : (
        <button id="create-offer" onClick={handleSubmit}>
          CREATE OFFER TO TRADE
        </button>
      )} */}


<div>
      <button id="create-offer" onClick = {() => {
  approvetep === tokensOffered.length? handleCreateOffer():
  buttonName === 'Submit Offer' ? handleSubmitOffer() :
  buttonName === 'Approve WOOD' ? handleApproveWood() :
  buttonName === 'Approve ROCK' ? handleApproveRock() :
  buttonName === 'Approve CLAY' ? handleApproveClay() :
  buttonName === 'Approve WOOL' ? handleApproveWool() :
  buttonName === 'Approve FISH' ? handleApproveFish() : 
  console.log("")
}}

      >
        {approvetep === tokensOffered.length ? "Create Offer" : 
          buttonName}
      </button>


      </div>
      </div>
      </div>
    </main>
  );
};

export default App;