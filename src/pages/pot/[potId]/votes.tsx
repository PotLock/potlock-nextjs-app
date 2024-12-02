import { useRouteQuery } from "@/common/lib";
import { VotingProjectList } from "@/features/voting";
import { PotLayout } from "@/modules/pot";

const PotVotesTab = () => {
  const { query } = useRouteQuery();
  const potId = query.potId as string;

  return (
    <div className="md:py-12 flex w-full flex-col py-5">
      <VotingProjectList />
    </div>
  );
};

PotVotesTab.getLayout = function getLayout(page: React.ReactNode) {
  return <PotLayout>{page}</PotLayout>;
};

export default PotVotesTab;
