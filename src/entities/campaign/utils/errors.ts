/**
 * Maps contract error messages to user-friendly messages with hints
 */

export interface ParsedError {
  title: string;
  message: string;
  hint?: string;
}

/**
 * Common contract error patterns and their user-friendly equivalents
 */
const ERROR_MAPPINGS: Array<{
  pattern: RegExp;
  title: string;
  message: string;
  hint?: string;
}> = [
  {
    pattern: /campaign start time must be in the future/i,
    title: "Invalid Start Date",
    message: "The campaign start time has already passed.",
    hint: "Please select a future date and time for your campaign to start.",
  },
  {
    pattern: /campaign end time must be after start time/i,
    title: "Invalid End Date",
    message: "The campaign end time must be after the start time.",
    hint: "Please ensure your end date is later than the start date.",
  },
  {
    pattern: /min.*amount.*cannot.*greater.*max.*amount/i,
    title: "Invalid Amount Range",
    message: "The minimum amount cannot be greater than the maximum amount.",
    hint: "Please adjust your minimum or maximum target amounts.",
  },
  {
    pattern: /recipient.*not.*exist|account.*not.*found/i,
    title: "Invalid Recipient",
    message: "The recipient account does not exist.",
    hint: "Please verify the NEAR account ID is correct and exists.",
  },
  {
    pattern: /insufficient.*storage|storage.*balance/i,
    title: "Insufficient Storage",
    message: "Not enough NEAR deposited for storage.",
    hint: "This is usually handled automatically. Please try again or contact support.",
  },
  {
    pattern: /transaction.*already.*exists/i,
    title: "Duplicate Transaction",
    message: "This transaction was already submitted.",
    hint: "Your campaign may have been created. Please check 'My Campaigns' or refresh the page.",
  },
  {
    pattern: /gas.*exceeded|out.*of.*gas/i,
    title: "Transaction Failed",
    message: "The transaction ran out of gas.",
    hint: "This is unusual. Please try again or contact support if the issue persists.",
  },
  {
    pattern: /unauthorized|access.*denied|not.*owner/i,
    title: "Permission Denied",
    message: "You don't have permission to perform this action.",
    hint: "Make sure you're signed in with the correct account.",
  },
];

/**
 * Parses a contract/wallet error and returns user-friendly message
 */
export function parseContractError(error: unknown): ParsedError {
  // Default error
  const defaultError: ParsedError = {
    title: "Failed to Create Campaign",
    message: "An unexpected error occurred.",
    hint: "Please try again. If the problem persists, contact support.",
  };

  // Handle various error formats
  let errorMessage = "";

  if (typeof error === "string") {
    errorMessage = error;
  } else if (error && typeof error === "object") {
    if ("message" in error && typeof error.message === "string") {
      errorMessage = error.message;
    } else if ("toString" in error && typeof error.toString === "function") {
      errorMessage = error.toString();
    }
  }

  if (!errorMessage) {
    return defaultError;
  }

  // Try to match against known patterns
  for (const mapping of ERROR_MAPPINGS) {
    if (mapping.pattern.test(errorMessage)) {
      return {
        title: mapping.title,
        message: mapping.message,
        hint: mapping.hint,
      };
    }
  }

  // If no pattern matched, try to extract contract panic message
  const panicMatch = errorMessage.match(/Smart contract panicked: (.+?)(?:\n|$)/i);

  if (panicMatch) {
    return {
      title: "Contract Error",
      message: panicMatch[1],
      hint: "Please check your input values and try again.",
    };
  }

  // Return default with actual error message if available
  return {
    ...defaultError,
    message:
      errorMessage.length > 200 ? errorMessage.substring(0, 200) + "..." : errorMessage,
  };
}
