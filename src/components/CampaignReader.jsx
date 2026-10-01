import { useState } from "react";
import { ethers } from "ethers";

import {
  CROWDFUNDING_ADDRESS,
  CROWDFUNDING_ABI,
} from "../contracts/crowdfunding";

export default function CampaignReader({
  provider,
  account,
}) {
  const [campaignId, setCampaignId] =
    useState("");

  const [campaign, setCampaign] =
    useState(null);

  const [contribution, setContribution] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function readCampaign() {
    if (!provider) return;

    try {
      setLoading(true);

      const contract = new ethers.Contract(
        CROWDFUNDING_ADDRESS,
        CROWDFUNDING_ABI,
        provider
      );

      const data =
        await contract.campaign(campaignId);

      setCampaign({
        creator: data.creator,
        target: ethers.formatEther(data.target),
        deadline: new Date(
          Number(data.deadline) * 1000
        ).toLocaleString(),
        moneyRaised: ethers.formatEther(
          data.moneyRaised
        ),
        moneyAvailable: ethers.formatEther(
          data.moneyavailable
        ),
        active: data.active,
        cancelled: data.cancelled,
        tokenAccepted: data.tokenAccepted,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function readContribution() {
    if (!provider || !account) return;

    const contract = new ethers.Contract(
      CROWDFUNDING_ADDRESS,
      CROWDFUNDING_ABI,
      provider
    );

    const amount =
      await contract.contributors(
        campaignId,
        account
      );

    setContribution(
      ethers.formatEther(amount)
    );
  }

  return (
    <section>
      <h2>Campaign</h2>

      <input
        placeholder="Campaign ID"
        value={campaignId}
        onChange={(e) =>
          setCampaignId(e.target.value)
        }
      />

      <button
        onClick={readCampaign}
        disabled={loading}
      >
        Read Campaign
      </button>

      <button onClick={readContribution}>
        My Contribution
      </button>

      {campaign && (
        <div>
          <p>Creator: {campaign.creator}</p>

          <p>Target: {campaign.target}</p>

          <p>
            Deadline: {campaign.deadline}
          </p>

          <p>
            Raised: {campaign.moneyRaised}
          </p>

          <p>
            Available: {campaign.moneyAvailable}
          </p>

          <p>
            Active:{" "}
            {campaign.active ? "Yes" : "No"}
          </p>

          <p>
            Cancelled:{" "}
            {campaign.cancelled
              ? "Yes"
              : "No"}
          </p>

          <p>
            Token: {campaign.tokenAccepted}
          </p>
        </div>
      )}

      {contribution && (
        <p>
          Your contribution: {contribution}
        </p>
      )}
    </section>
  );
}