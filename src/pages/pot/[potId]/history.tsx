import { PotLayout } from "@/layout/pot/components/PotLayout";

export default function PotHistoryTab() {
  return <div>history</div>;
}

PotHistoryTab.getLayout = function getLayout(page: React.ReactNode) {
  return <PotLayout>{page}</PotLayout>;
};
