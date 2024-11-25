import { useState } from "react";

import { styled } from "styled-components";

import { ByPotId, indexer } from "@/common/api/indexer";
import { cn } from "@/common/ui/utils";

import { PotTimelineFragment } from "./PotTimelineFragment";
import { Container, Loader } from "./styles";
import TimeLeft from "./TimeLeft";
import { potIndexedDataToTimeline } from "../utils/timeline";
import { isPotStakeWeighted } from "../utils/voting";

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  pointer-events: none;

  .spread-indicator {
    height: auto;
    width: 12px;
    transition: all 300ms ease-in-out;
    display: none;
  }

  @media only screen and (max-width: 1280px) {
    pointer-events: all;
    cursor: pointer;
    .spread-indicator {
      display: block;
    }
  }
`;

export type PotTimelineProps = ByPotId & {
  classNames?: {
    root?: string;
  };
};

export const PotTimeline: React.FC<PotTimelineProps> = ({ potId, classNames }) => {
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const { data: pot } = indexer.usePot({ potId });
  const isStakeWeightedPot = isPotStakeWeighted({ potId });

  const statuses = pot
    ? potIndexedDataToTimeline({
        ...pot,
        isVotingEnabled: isStakeWeightedPot,
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
    <Wrapper
      onClick={() => setMobileMenuActive(!mobileMenuActive)}
      className={cn("px-4", classNames?.root)}
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
        className="spread-indicator"
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
    </Wrapper>
  );
};
