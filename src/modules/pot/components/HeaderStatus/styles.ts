// TODO: move to tailwind

import { styled } from "styled-components";

export const Container = styled.div<{
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

export const Wrapper = styled.div`
  border-top: 1px solid rgb(199 199 199 / 50%);
  border-bottom: 1px solid rgb(199 199 199 / 50%);
  position: relative;
  display: flex;
  align-items: center;
  margin-top: -1px;
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

export const State = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  gap: 1rem;
  font-size: 14px;
  white-space: nowrap;
  span {
    font-weight: 600;
    color: #dd3345;
  }
`;

export const Loader = styled.div`
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

export const ProgressBarWrapper = styled.div`
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
    background: white;
    padding: 2px 0;
  }
`;
