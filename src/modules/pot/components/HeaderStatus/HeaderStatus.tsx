import { useState } from "react";

import { Pot } from "@/common/api/potlock";

import ProgressBar from "./ProgressBar";
import { Container, Loader, State, Wrapper } from "./styles";
import { statsList } from "../../utils";
import TimeLeft from "../TimeLeft";

type Props = {
  potDetail: Pot;
};

const HeaderStatus = ({ potDetail }: Props) => {
  const [mobileMenuActive, setMobileMenuActive] = useState(false);

  if (potDetail === null) return "";

  const stats = statsList(potDetail);

  const getIndexOfActive = () => {
    let index = 0;
    stats.forEach((state, idx) => {
      if (state.started && !state.completed) {
        index = idx;
      }
    });
    if (index === null) return 3;
    return index;
  };

  const containerHeight = 181;
  const showActiveState = getIndexOfActive() * (containerHeight / 4);

  return (
    <Wrapper onClick={() => setMobileMenuActive(!mobileMenuActive)}>
      <Container
        containerHeight={containerHeight}
        showActiveState={showActiveState}
        style={
          mobileMenuActive
            ? {
                height: containerHeight + "px",
              }
            : {}
        }
      >
        <div
          className="mobile-selected"
          style={
            mobileMenuActive
              ? {
                  transform: "translateY(0px)",
                }
              : {}
          }
        >
          {stats.map(
            // TODO: Improve this code (built by mohamed)
            ({ label, daysLeft, progress, started, completed }, idx) => {
              return (
                <State
                  style={{
                    color: completed || started ? "#000" : "#7b7b7b",
                  }}
                  key={label}
                >
                  <ProgressBar
                    progress={progress}
                    started={started}
                    completed={completed}
                  />
                  <div className="flex">
                    {label}
                    {!daysLeft && started && <span>pending </span>}
                    {started && !completed && daysLeft && (
                      <>
                        <p className="mx-1">{` `}ends in</p>
                        <span>
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
                </State>
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

export default HeaderStatus;
