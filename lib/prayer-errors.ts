export function getPrayerSubmissionErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : "";

  if (message.includes("Profanity detected")) {
    return "Your prayer contains language that is not allowed. Please revise the title, prayer text or username.";
  }

  if (message.includes("Profanity check failed")) {
    return "We could not check your prayer right now. Please try again.";
  }

  if (message.includes("Cell group not found")) {
    return "This cell-group board is no longer available. Please refresh and try again.";
  }

  return "We could not save your prayer. Please try again.";
}
