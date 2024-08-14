import ActivePots from "@/modules/pot/components/ActivePots";
import Banner from "@/modules/pot/components/Banner";

export default function PotsPage() {
  return (
    <main className="flex flex-col items-center justify-center pb-[48px]">
      <Banner />
      <ActivePots />
    </main>
  );
}
