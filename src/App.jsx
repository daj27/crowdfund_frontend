import WalletButton from "./components/WalletButton";
import CampaignReader from "./components/CampaignReader";
import CreateCampaign from "./components/CreateCampaign";
import Contribute from "./components/Contribute";
import CampaignActions from "./components/CampaignActions";

import { useWallet } from "./hooks/useWallet";

function App() {
  const {
    provider,
    signer,
    account,
    chainId,
    connect,
  } = useWallet();

  return (
    <main>
      <h1>Crowdfunding</h1>

      <WalletButton
        account={account}
        chainId={chainId}
        onConnect={connect}
      />

      <hr />

      <CampaignReader
        provider={provider}
        account={account}
      />

      <hr />

      <CreateCampaign
        signer={signer}
      />

      <hr />

      <Contribute
        signer={signer}
      />

      <hr />

      <CampaignActions
        signer={signer}
        campaignId="0"
      />
    </main>
  );
}

export default App;