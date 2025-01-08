import { useCallback, useState } from "react";

import { styled } from "styled-components";

import { ByPotId } from "@/common/api/indexer";
import { TimeLeft } from "@/common/ui/components/_deprecated/TimeLeft";
import { cn } from "@/common/ui/utils";

import { PotLifecycleStageCircularProgressIndicator } from "./progress";
import { usePotLifecycle } from "../hooks/lifecycle";

const containerHeight = 181;

/**
 * @deprecated convert to div with Tailwind classes
 */
const Container = styled.div<{
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
    height: ${containerHeight / 4}px;
    overflow: hidden;

    .mobile-selected {
      margin: 10px 0;
      transform: translateY(${(props) => -props.showActiveState}px);
      flex-direction: column;
    }
  }
`;

/**
 * @deprecated convert to div with Tailwind classes
 */
const Loader = styled.div`
  width: 95px;

  @media only screen and (max-width: 1400px) {
    width: 90px;
  }

  @media only screen and (max-width: 1280px) {
    z-index: 0;
    position: absolute;
    top: 24px;
    left: 10px;
    width: 4px;
    height: 24px;
  }

  @media only screen and (min-width: 1536px) {
    width: 145px;
  }
`;

export type PotTimelineProps = ByPotId & {
  hasProportionalFundingMechanism?: boolean;

  classNames?: {
    root?: string;
  };
};

export const PotTimeline: React.FC<PotTimelineProps> = ({
  potId,
  classNames,
  hasProportionalFundingMechanism,
}) => {
  const [isMobileMenuActive, setIsMobileMenuActive] = useState(false);
  const toggleMobileMenu = useCallback(() => setIsMobileMenuActive((isActive) => !isActive), []);
  const lifecycle = usePotLifecycle({ potId, hasProportionalFundingMechanism });

  const showActiveState =
    (lifecycle.currentStage === undefined ? 0 : lifecycle.stages.indexOf(lifecycle.currentStage)) *
    (containerHeight / 4);

  return (
    <div
      onClick={toggleMobileMenu}
      className={cn(
        "h-a cursor-pointer 2xl:pointer-events-none 2xl:h-14",
        "flex w-full items-center justify-center gap-4 px-4",
        classNames?.root,
      )}
    >
      <Container
        showActiveState={showActiveState}
        style={isMobileMenuActive ? { height: `${containerHeight}px` } : {}}
      >
        <div
          className={cn("mobile-selected w-full", {
            isMobileMenuActive: "transform-translate-y-0",
          })}
        >
          {lifecycle.stages.map(({ label, daysLeft, progress, started, completed }, idx) => {
            return (
              <div
                key={label}
                className={cn("relative flex items-center gap-4 whitespace-nowrap", {
                  "color-neutral-500": !(completed || started),
                })}
              >
                <PotLifecycleStageCircularProgressIndicator
                  started={started ?? false}
                  {...{ progress, completed }}
                />

                <div className="flex gap-1">
                  {label}
                  {!daysLeft && started && <span>{"pending"}</span>}

                  {started && !completed && daysLeft && (
                    <>
                      <span>{"ends in"}</span>

                      <span className="prose text-primary-600 font-600 min-w-31">
                        <TimeLeft daysLeft={daysLeft} />
                      </span>
                    </>
                  )}

                  {idx === 0 && !started && "hasn’t started"}
                </div>

                {idx !== 3 && (
                  <Loader
                    className={cn("relative flex h-1 rounded-[1px]", {
                      "bg-neutral-200": !completed,
                      "bg-[#629D13]": completed,
                    })}
                  />
                )}
              </div>
            );
          })}
        </div>
      </Container>

      <svg
        className="transition-300 w-4 transition-all ease-in-out xl:hidden"
        style={{
          rotate: isMobileMenuActive ? "180deg" : "0deg",
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
