import { useCallback, useState } from "react";

import { styled } from "styled-components";

import { ByPotId, indexer } from "@/common/api/indexer";
import { cn } from "@/common/ui/utils";

import { PotTimelineFragment } from "./PotTimelineFragment";
import TimeLeft from "./TimeLeft";
import { potIndexedDataToTimeline } from "../utils/timeline";
import { isPotVotingBased } from "../utils/voting";

/**
 * @deprecated convert to Tailwind classes
 */
const Container = styled.div<{
  containerHeight: number;
  showActiveState: number;
}>`
  display: flex;
  width: 100%;
  justify-content: center;
  transition: all 300ms ease-in-out;

  .mobile-selected {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin: 1rem 0;
    transition: all 300ms ease-in-out;
  }

  @media only screen and (max-width: 1280px) {
    justify-content: left;
    height: ${(props) => props.containerHeight / 4}px;
    overflow: hidden;

    .mobile-selected {
      margin: 10px 0;
      transform: translateY(${(props) => -props.showActiveState}px);
      flex-direction: column;
    }
  }
`;

/**
 * @deprecated convert to Tailwind classes
 */
const Loader = styled.div`
  position: relative;
  background: #dbdbdb;
  border-radius: 1px;
  height: 4px;
  width: 95px;

  @media only screen and (max-width: 1400px) {
    width: 90px;
  }

  @media only screen and (max-width: 1280px) {
    height: 40px;
    width: 4px;
    position: absolute;
    left: 10px;
    z-index: 0;
    top: 50%;
  }

  @media only screen and (min-width: 1536px) {
    width: 145px;
  }
`;

export type PotTimelineProps = ByPotId & {
  classNames?: {
    root?: string;
  };
};

export const PotTimeline: React.FC<PotTimelineProps> = ({ potId, classNames }) => {
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const toggleMobileMenu = useCallback(() => setMobileMenuActive((isActive) => !isActive), []);
  const { data: pot } = indexer.usePot({ potId });
  const isVotingBasedPot = isPotVotingBased({ potId });

  const statuses = pot
    ? potIndexedDataToTimeline({
        ...pot,
        isVotingEnabled: isVotingBasedPot,
      })
    : [];

  // TODO: Refactor this code ( original owner: @M-Rb3 )
  const getIndexOfActive = () => {
    let index = 0;
    statuses.forEach((status, idx) => {
      if (status.started && !status.completed) {
        index = idx;
      }
    });
    if (index === null) return 3;
    return index;
  };

  const containerHeight = 181;
  const showActiveState = getIndexOfActive() * (containerHeight / 4);

  return (
    <div
      onClick={toggleMobileMenu}
      className={cn(
        "xl:pointer-events-none cursor-pointer",
        "h-a xl:h-14 flex items-center justify-center gap-4 p-4",
        classNames?.root,
      )}
    >
      <Container
        containerHeight={containerHeight}
        showActiveState={showActiveState}
        style={mobileMenuActive ? { height: containerHeight + "px" } : {}}
      >
        <div
          className="mobile-selected"
          style={mobileMenuActive ? { transform: "translateY(0px)" } : {}}
        >
          {statuses.map(
            // TODO: Improve this code (built by mohamed)
            ({ label, daysLeft, progress, started, completed }, idx) => {
              return (
                <div
                  key={label}
                  className={cn("relative flex items-center gap-4 whitespace-nowrap", {
                    "color-neutral-500": !(completed || started),
                  })}
                >
                  {/* @ts-expect-error timeline fragments don't have proper typings */}
                  <PotTimelineFragment {...{ progress, completed, started }} />

                  <div className="flex">
                    {label}
                    {!daysLeft && started && <span>{"pending "}</span>}

                    {started && !completed && daysLeft && (
                      <>
                        <p className="mx-1">ends in</p>

                        <span className="prose text-primary-600 font-600">
                          <TimeLeft daysLeft={daysLeft} />
                        </span>
                      </>
                    )}

                    {idx === 0 && !started && " hasn’t started"}
                  </div>

                  <Loader
                    style={{
                      background: completed ? "#629D13" : "#dbdbdb",
                      display: idx === 3 ? "none" : "flex",
                    }}
                  />
                </div>
              );
            },
          )}
        </div>
      </Container>

      <svg
        className="xl:display-[none] transition-300 w-3 transition-all ease-in-out"
        style={{
          rotate: mobileMenuActive ? "180deg" : "0deg",
        }}
        viewBox="0 0 12 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.59 0.294922L6 4.87492L1.41 0.294922L0 1.70492L6 7.70492L12 1.70492L10.59 0.294922Z"
          fill="#7B7B7B"
        />
      </svg>
    </div>
  );
};
