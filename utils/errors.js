export function getErrorMessage(error) {
  if (error?.code === 4001) {
    return "Transaction rejected";
  }

  if (error?.reason) {
    return error.reason;
  }

  if (error?.shortMessage) {
    return error.shortMessage;
  }

  if (error?.info?.error?.message) {
    return error.info.error.message;
  }

  return error?.message || "Transaction failed";
}