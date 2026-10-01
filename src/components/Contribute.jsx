import { useState } from "react";
import { ethers } from "ethers";

import {
  CROWDFUNDING_ADDRESS,
  CROWDFUNDING_ABI,
} from "../contracts/crowdfunding";

import { ERC20_ABI } from "../contracts/erc20";

export default function Contribute({
  signer,
}) {
  const [campaignId, setCampaignId] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [token, setToken] =
    useState("");

  const [status, setStatus] =
    useState("");

  async function approve() {
    try {
      if (!signer) {
        setStatus("Connect wallet first");
        return;
      }

      const tokenContract =
        new ethers.Contract(
          token,
          ERC20_ABI,
          signer
        );

      const amountWei =
        ethers.parseEther(amount);

      setStatus("Approving token...");

      const tx =
        await tokenContract.approve(
          CROWDFUNDING_ADDRESS,
          amountWei
        );

      setStatus(
        `Approval transaction: ${tx.hash}`
      );

      await tx.wait();

      setStatus(
        "Token approved successfully"
      );
    } catch (error) {
      console.error(error);

      setStatus(
        error?.shortMessage ||
          error?.reason ||
          error?.message ||
          "Approval failed"
      );
    }
  }

  async function contribute() {
    try {
      if (!signer) {
        setStatus("Connect wallet first");
        return;
      }

      const contract =
        new ethers.Contract(
          CROWDFUNDING_ADDRESS,
          CROWDFUNDING_ABI,
          signer
        );

      const amountWei =
        ethers.parseEther(amount);

      setStatus(
        "Confirm contribution..."
      );

      const tx =
        await contract.contributing(
          amountWei,
          token,
          campaignId
        );

      setStatus(
        `Transaction: ${tx.hash}`
      );

      await tx.wait();

      setStatus(
        "Contribution successful"
      );
    } catch (error) {
      console.error(error);

      setStatus(
        error?.shortMessage ||
          error?.reason ||
          error?.message ||
          "Contribution failed"
      );
    }
  }

  return (
    <section>
      <h2>Contribute</h2>

      <input
        placeholder="Campaign ID"
        value={campaignId}
        onChange={(e) =>
          setCampaignId(e.target.value)
        }
      />

      <input
        placeholder="Amount"
        value={amount}
        onChange={(e) =>
          setAmount(e.target.value)
        }
      />

      <input
        placeholder="Token address"
        value={token}
        onChange={(e) =>
          setToken(e.target.value)
        }
      />

      <div>
        <button onClick={approve}>
          1. Approve Token
        </button>

        <button onClick={contribute}>
          2. Contribute
        </button>
      </div>

      {status && <p>{status}</p>}
    </section>
  );
}