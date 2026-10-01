import { ethers } from "ethers";

import {
  CROWDFUNDING_ADDRESS,
  CROWDFUNDING_ABI,
} from "../contracts/crowdfunding";

export default function CampaignActions({
  signer,
  campaignId,
}) {
  async function execute(
    functionName
  ) {
    try {
      if (!signer) {
        alert("Connect wallet first");
        return;
      }

      const contract =
        new ethers.Contract(
          CROWDFUNDING_ADDRESS,
          CROWDFUNDING_ABI,
          signer
        );

      const tx =
        await contract[functionName](
          campaignId
        );

      console.log(
        "Transaction:",
        tx.hash
      );

      await tx.wait();

      alert("Transaction confirmed");
    } catch (error) {
      console.error(error);

      alert(
        error?.shortMessage ||
          error?.reason ||
          error?.message ||
          "Transaction failed"
      );
    }
  }

  return (
    <section>
      <h2>Campaign Actions</h2>

      <button
        onClick={() =>
          execute("approveMilestones")
        }
      >
        Approve Milestones
      </button>

      <button
        onClick={() =>
          execute("Withdrawal")
        }
      >
        Withdraw
      </button>

      <button
        onClick={() =>
          execute("cancelCampaign")
        }
      >
        Cancel Campaign
      </button>

      <button
        onClick={() =>
          execute("refundMoney")
        }
      >
        Refund
      </button>
    </section>
  );
}