import { useState } from "react";
import { ethers } from "ethers";

import {
  CROWDFUNDING_ADDRESS,
  CROWDFUNDING_ABI,
} from "../contracts/crowdfunding";

export default function CreateCampaign({
  signer,
}) {
  const [target, setTarget] =
    useState("");

  const [deadline, setDeadline] =
    useState("");

  const [token, setToken] =
    useState("");

  const [amounts, setAmounts] =
    useState("");

  const [statuses, setStatuses] =
    useState("");

  const [status, setStatus] =
    useState("");

  async function createCampaign() {
    try {
      if (!signer) {
        setStatus("Connect wallet first");
        return;
      }

      setStatus("Confirm transaction...");

      const contract = new ethers.Contract(
        CROWDFUNDING_ADDRESS,
        CROWDFUNDING_ABI,
        signer
      );

      const targetWei =
        ethers.parseEther(target);

      const deadlineUnix =
        Math.floor(
          new Date(deadline).getTime() / 1000
        );

      const milestoneAmounts =
        amounts
          .split(",")
          .map((amount) =>
            ethers.parseEther(amount.trim())
          );

      const milestoneStatuses =
        statuses
          .split(",")
          .map((status) =>
            Number(status.trim())
          );

      const tx =
        await contract.createCampaign(
          targetWei,
          deadlineUnix,
          token,
          milestoneAmounts,
          milestoneStatuses
        );

      setStatus(
        `Transaction: ${tx.hash}`
      );

      await tx.wait();

      setStatus(
        "Campaign created successfully"
      );
    } catch (error) {
      console.error(error);

      setStatus(
        error?.shortMessage ||
          error?.reason ||
          error?.message ||
          "Transaction failed"
      );
    }
  }

  return (
    <section>
      <h2>Create Campaign</h2>

      <input
        placeholder="Target"
        value={target}
        onChange={(e) =>
          setTarget(e.target.value)
        }
      />

      <input
        type="datetime-local"
        value={deadline}
        onChange={(e) =>
          setDeadline(e.target.value)
        }
      />

      <input
        placeholder="Token accepted"
        value={token}
        onChange={(e) =>
          setToken(e.target.value)
        }
      />

      <input
        placeholder="Amounts: 10,20,30"
        value={amounts}
        onChange={(e) =>
          setAmounts(e.target.value)
        }
      />

      <input
        placeholder="Statuses: 0,1,2"
        value={statuses}
        onChange={(e) =>
          setStatuses(e.target.value)
        }
      />

      <button onClick={createCampaign}>
        Create Campaign
      </button>

      {status && <p>{status}</p>}
    </section>
  );
}