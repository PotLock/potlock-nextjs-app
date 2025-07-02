import { styled } from "styled-components";

export const Container = styled.div`
  display: flex;
  gap: 2rem;
  .option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .radio-btn {
    display: flex;
    position: relative;
    border: 1px solid #292929;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    transition: all 300ms ease-in-out;
    padding: 4px;
    div {
      width: 100%;
      height: 100%;
      background: transparent;
      transition: all 300ms ease-in-out;
      border-radius: 50%;
    }
    &.active {
      border-color: var(--primary-600);
      div {
        background: var(--primary-600);
      }
    }
    input {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: inherit;
      opacity: 0;
      cursor: pointer;
    }
  }
  .label {
    font-weight: 500;
  }
`;
