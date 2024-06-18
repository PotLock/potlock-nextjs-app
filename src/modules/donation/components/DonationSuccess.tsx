export type DonationSuccessProps = {
  closeModal: VoidFunction;
};

export const DonationSuccess = ({ closeModal }: DonationSuccessProps) => {
  return (
    <div>
      <h1>Donation successful!</h1>
      <button onClick={closeModal}>Close</button>
    </div>
  );
};
