import Dropdown, { Option } from "./Dropdown";
import VLine from "../../profile/components/VLine";

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

const Stats = ({ sortOptions, selectedSortOption, stats, onSelectSortOption }: Props) => {
  if (stats.length === 1) {
    stats[0].hideSeparator = true;
  }

  return (
    <div className="m-[24px_0] flex flex-wrap items-center">
      <div className="md:flex hidden">
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
      <div className="sm:ml-auto ml-auto">
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
