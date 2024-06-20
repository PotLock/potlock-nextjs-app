import VLine from "./VLine";
import Dropdown, { Option } from "../Dropdown";

type Props = {
  sortOptions: Option[];
  selectedSortOption: Option;
  stats: Stat[];
  onSelectSortOption: (option: Option) => void;
};

export type Stat = {
  value: string;
  label: string;
  hideSeparator?: boolean;
};

const Stats = ({
  sortOptions,
  selectedSortOption,
  stats,
  onSelectSortOption,
}: Props) => {
  return (
    <div className="m-[24px_0] flex flex-wrap items-center">
      <div className="hidden md:flex">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center">
            <div className="flex h-fit items-center gap-2 pr-4">
              <p className="font-600">{stat.value}</p>
              <p className="item-label">{stat.label}</p>
            </div>
            {!stat.hideSeparator && <VLine />}
          </div>
        ))}
      </div>
      <div className="ml-auto sm:ml-auto">
        <Dropdown
          selectedOption={selectedSortOption}
          options={sortOptions}
          onSelect={onSelectSortOption}
        />
      </div>
    </div>
  );
};

export default Stats;
