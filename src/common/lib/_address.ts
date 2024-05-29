export const _address = (address: string, max?: number) => {
  const limit = max || 10;
  if (address.length > limit) return address.slice(0, limit) + "...";
  else return address;
};
