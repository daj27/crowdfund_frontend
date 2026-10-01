import { useEffect, useState } from "react";
import { ethers } from "ethers";

export function useWallet() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState(null);

  function disconnect() {
    setProvider(null);
    setSigner(null);
    setAccount("");
    setChainId(null);
  }

  async function connect() {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    const browserProvider =
      new ethers.BrowserProvider(window.ethereum);

    await browserProvider.send(
      "eth_requestAccounts",
      []
    );

    const walletSigner =
      await browserProvider.getSigner();

    const address =
      await walletSigner.getAddress();

    const network =
      await browserProvider.getNetwork();

    setProvider(browserProvider);
    setSigner(walletSigner);
    setAccount(address);
    setChainId(network.chainId);

    return {
      provider: browserProvider,
      signer: walletSigner,
      account: address,
      chainId: network.chainId,
    };
  }

  useEffect(() => {
    if (!window.ethereum) return;

    const accountsChanged = (accounts) => {
      setAccount(accounts[0] || "");
    };

    const chainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on(
      "accountsChanged",
      accountsChanged
    );

    window.ethereum.on(
      "chainChanged",
      chainChanged
    );

    return () => {
      window.ethereum.removeListener(
        "accountsChanged",
        accountsChanged
      );

      window.ethereum.removeListener(
        "chainChanged",
        chainChanged
      );
    };
  }, []);

  return {
    provider,
    signer,
    account,
    chainId,
    connect,
    disconnect,
  };
}