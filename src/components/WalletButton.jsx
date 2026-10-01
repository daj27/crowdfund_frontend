export default function WalletButton({
  account,
  chainId,
  onConnect,
}) {
  if (account) {
    return (
      <div>
        <p>
          {account.slice(0, 6)}...
          {account.slice(-4)}
        </p>

        <p>
          Chain: {chainId?.toString()}
        </p>

        {chainId?.toString() !== "11155111" && (
          <p style={{ color: "red" }}>
            Switch to Sepolia
          </p>
        )}
      </div>
    );
  }

  return (
    <button onClick={onConnect}>
      Connect Wallet
    </button>
  );
}