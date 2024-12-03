import Image from "next/image";

/**
 * Suspense Loading
 * @returns
 */
const SuspenseLoading = () => {
  return (
    <div className="mt-[40vh] flex w-full flex-col items-center">
      <span className="loader"></span>
      <div className="hover:decoration-none decoration-none mt-6 flex items-baseline gap-2 text-center text-2xl font-bold text-[color:var(--neutral-900)] max-[480px]:text-lg">
        <Image
          src="https://ipfs.near.social/ipfs/bafkreiafms2jag3gjbypfceafz2uvs66o25qc7m6u6hkxfyrzfoeyvj7ru"
          alt="logo"
          width={28.72}
          height={23.94}
        />
        POTLOCK
      </div>
    </div>
  );
};
export default SuspenseLoading;
