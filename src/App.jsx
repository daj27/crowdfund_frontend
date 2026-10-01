import "./App.css";
import WalletButton from "./components/WalletButton";
import CampaignReader from "./components/CampaignReader";
import CreateCampaign from "./components/CreateCampaign";
import Contribute from "./components/Contribute";
import CampaignActions from "./components/CampaignActions";

import { useWallet } from "./hooks/useWallet";
import { useState } from "react";

function App() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectError, setConnectError] = useState("");
  const {
    provider,
    signer,
    account,
    chainId,
    connect,
    disconnect,
  } = useWallet();

  async function handleConnect() {
    setConnectError("");
    setIsConnecting(true);

    try {
      await connect();
    } catch (error) {
      if (error?.code === 4001) {
        setConnectError("Wallet connection was rejected.");
      } else if (error?.code === -32002) {
        setConnectError("A wallet connection request is already pending.");
      } else {
        setConnectError(
          error?.shortMessage ||
            error?.info?.error?.message ||
            error?.message ||
            "Unable to connect wallet."
        );
      }
    } finally {
      setIsConnecting(false);
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Crowdfund home">
          <span className="brand-mark" aria-hidden="true">C</span>
          <span>Crowdfund<span className="brand-period">.</span></span>
        </a>
        <div className="wallet-area">
          <span className="wallet-label">Wallet</span>
          <WalletButton
            account={account}
            chainId={chainId}
            onConnect={handleConnect}
            onDisconnect={disconnect}
            isConnecting={isConnecting}
          />
        </div>
        {connectError && (
          <p className="wallet-error" role="alert">
            {connectError}
          </p>
        )}
      </header>

      <section className="intro" id="top">
        <div>
          <p className="eyebrow"><span className="live-dot" /> Sepolia network</p>
          <h1>Ideas move<br /><em>when we fund them.</em></h1>
          <p className="intro-copy">
            Discover a campaign, back a bold idea, or bring your own to life.
          </p>
        </div>
        <div className="intro-stamp" aria-hidden="true">
          <span>COMMUNITY</span>
          <strong>GO</strong>
          <span>POWERED</span>
        </div>
      </section>

      <div className="workspace-heading">
        <div>
          <p className="eyebrow">Your onchain toolkit</p>
          <h2>Campaign workspace</h2>
        </div>
        <span className="workspace-index">01 <i /> 04</span>
      </div>

      <div className="dashboard-grid">
        <div className="panel panel-wide">
          <div className="panel-heading">
            <span className="panel-number">01</span>
            <span className="panel-label">Explore</span>
          </div>
          <CampaignReader provider={provider} account={account} />
        </div>

        <div className="panel">
          <div className="panel-heading">
            <span className="panel-number">02</span>
            <span className="panel-label">Launch</span>
          </div>
          <CreateCampaign signer={signer} />
        </div>

        <div className="panel">
          <div className="panel-heading">
            <span className="panel-number">03</span>
            <span className="panel-label">Support</span>
          </div>
          <Contribute signer={signer} />
        </div>

        <div className="panel panel-wide actions-panel">
          <div className="panel-heading">
            <span className="panel-number">04</span>
            <span className="panel-label">Manage campaign 0</span>
          </div>
          <CampaignActions signer={signer} campaignId="0" />
        </div>
      </div>

      <footer className="page-footer">
        <span>Built for ideas with momentum.</span>
        <span>Ethereum / Sepolia</span>
      </footer>
    </main>
  );
}

export default App;