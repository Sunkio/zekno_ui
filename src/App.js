import React, { useEffect, useState } from 'react';
import './App.css';
import SelectCharacter from './Components/SelectCharacter';
import Arena from './Components/Arena';
import { CONTRACT_ADDRESS, TESTNET_CHAIN_ID, transformCharacterData } from './constants';
import Zekno from './utils/Zekno.json';
import { ethers } from 'ethers';
import LoadingIndicator from './Components/LoadingIndicator';
import twitterLogo from './assets/twitter-logo.svg';

// Constants
const TWITTER_HANDLE = '';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // State
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Actions
  const checkIfWalletIsConnected = async () => {
    try { 
	  const { ethereum } = window;

      if (!ethereum) {
        console.log('Make sure you have MetaMask!');
		setIsLoading(false);
        return;
      } else {
        console.log('We have the ethereum object', ethereum);

        const accounts = await ethereum.request({ method: 'eth_accounts' });

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log('Found an authorized account:', account);
          setCurrentAccount(account);
        } else {
          console.log('No authorized account found');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };


  // check if the user is connected to Harmony testnet, if not: alert user
  const checkNetwork = async () => {
	try { 
	  if (window.ethereum.any !== TESTNET_CHAIN_ID) {
		alert("Please connect to Harmony Testnet!")
	  }
	} catch(error) {
	  console.log(error);
	}
	setIsLoading(false);
  };

  /*
   * Implement connectWallet method
   */
  const connectWalletAction = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert('Get MetaMask!');
        return;
      }

      /*
       * Request access to account.
       */
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });

      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  // Whenever the component mounts, do:
  useEffect(() => {
  	setIsLoading(true);
    checkIfWalletIsConnected();
	checkNetwork();
  }, []);

  /*
 * Add this useEffect right under the other useEffect where you are calling checkIfWalletIsConnected
 */
 useEffect(() => {
	/*
	 * The function we will call that interacts with out smart contract
	 */
	const fetchNFTMetadata = async () => {
	  console.log('Checking for Character NFT on address:', currentAccount);
  
	  const provider = new ethers.providers.Web3Provider(window.ethereum);
	  const signer = provider.getSigner();
	  const gameContract = new ethers.Contract(
		CONTRACT_ADDRESS,
		Zekno.abi,
		signer
	  );
  
	  const characterNFT = await gameContract.checkIfUserHasNFT();
	  if (characterNFT.name) {
		console.log('User has character NFT');
		setCharacterNFT(transformCharacterData(characterNFT));
	  } else {
		console.log('No character NFT found');
	  }
	     /*
     * Once we are done with all the fetching, set loading state to false
     */
	  setIsLoading(false);
	};
  
	/*
	 * We only want to run this, if we have a connected wallet
	 */
	if (currentAccount) {
	  console.log('CurrentAccount:', currentAccount);
	  fetchNFTMetadata();
	}
  }, [currentAccount]);

  // Render Methods
const renderContent = () => {
	if (isLoading) {
		return <LoadingIndicator />;
	  }
	/*
	 * Scenario #1
	 */
	if (!currentAccount) {
	  return (
		<div className="connect-wallet-container">
		  <img
			src="https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv"
			alt="Monty Python Gif"
		  />
		  <button
			className="cta-button connect-wallet-button"
			onClick={ connectWalletAction }
		  >
			Connect Wallet To Get Started
		  </button>
		</div>
	  );
	  /*
	   * Scenario #2
	   */
	} else if (currentAccount && !characterNFT) {
	  return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
		/*
	* Scenario #3: If there is a connected wallet and characterNFT, it's time to battle!
	*/
	} else if (currentAccount && characterNFT) {
		return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT}/>;
	  }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text"> Zekno </p>
          <p className="sub-text">Team up to protect the Metaverse!</p>
		  {/* This is where our button and image code used to be!
		  *	Remember we moved it into the render method.
		  */}
		  {renderContent()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;