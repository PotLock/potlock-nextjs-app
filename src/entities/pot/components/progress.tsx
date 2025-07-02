import { styled } from "styled-components";

import { Progress, ProgressProps } from "@/common/ui/layout/components";

import { PotLifecycleStage } from "../types";

export type PotLifecycleStageProgressIndicatorProps = Omit<PotLifecycleStage, "progress"> & {
  progressPercent: ProgressProps["value"];
};

export const PotLifecycleStageProgressIndicator: React.FC<
  PotLifecycleStageProgressIndicatorProps
> = ({ started, progressPercent, completed }) => (
  <Progress
    value={progressPercent}
    bgColor={completed ? "#629D13" : started ? "#7B7B7B" : "#C7C7C7"}
  />
);

/**
 * @deprecated convert to Tailwind classes
 */
const Wrapper = styled.div`
  position: relative;
  display: flex;

  .circle {
    width: 24px;
    height: 24px;
    transform: rotate(-90deg);
  }

  .check {
    width: 12px;
    position: absolute;
    transform: translate(-50%, -50%);
    top: 50%;
    left: 50%;
  }

  @media only screen and (max-width: 1280px) {
    z-index: 1;
    padding: 2px 0;
  }
`;

export type PotLifecycleStageCircularProgressIndicatorProps = {
  progress: number;
  completed: boolean;
  started: boolean;
};

export const PotLifecycleStageCircularProgressIndicator: React.FC<
  PotLifecycleStageCircularProgressIndicatorProps
> = ({ progress, completed, started }) => (
  <Wrapper>
    <svg viewBox="0 0 160 160" className="circle">
      <circle
        r="70"
        cx="80"
        cy="80"
        fill="transparent"
        stroke={completed ? "#629D13" : started ? "#000000" : "#C7C7C7"}
        strokeWidth="12px"
      ></circle>

      <circle
        r="70"
        cx="80"
        cy="80"
        fill="transparent"
        stroke="#C7C7C7"
        strokeWidth="12px"
        strokeDasharray="439.6px"
        strokeDashoffset={439.6 * progress + "px"}
      ></circle>
    </svg>

    <svg className="check" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.72667 7.05333L0.946667 4.27333L0 5.21333L3.72667 8.94L11.7267 0.94L10.7867 0L3.72667 7.05333Z"
        style={{
          fill: completed ? "#629D13" : started ? "#7B7B7B" : "#C7C7C7",
        }}
      />
    </svg>
  </Wrapper>
);
