const formatWithCommas = (amount: string) => {
  // Convert to a number and use toLocaleString to add commas
  return Number(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default formatWithCommas;
