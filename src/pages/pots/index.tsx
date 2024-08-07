import ActivePots from "@/modules/pots/components/ActivePots";
import Banner from "@/modules/pots/components/Banner";

export default function Pots() {
  return (
    <main className="flex flex-col items-center justify-center pb-[48px]">
      <Banner />
      <ActivePots />
    </main>
  );
}
