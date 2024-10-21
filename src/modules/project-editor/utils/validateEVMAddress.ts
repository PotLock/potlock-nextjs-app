export default function validateEVMAddress(address: string) {
  // Check if the address is defined and the length is correct (42 characters, including '0x')
  if (!address || address.length !== 42) {
    return false;
  }
  // Check if the address starts with '0x' and contains only valid hexadecimal characters after '0x'
  const re = /^0x[a-fA-F0-9]{40}$/;
  return re.test(address);
}
