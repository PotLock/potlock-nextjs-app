import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  > .description {
    margin-top: 0.5rem;
    margin-bottom: 1.5rem;
  }
  .external-funding {
    display: flex;
    flex-direction: column;
    width: 100%;
    border-radius: 6px;
    border: 1px solid #7b7b7b;
    background: #fff;
    transition: all 300ms ease-in-out;
    &.hidden {
      visibility: hidden;
      height: 0;
      opacity: 0;
      transform: translateY(100px);
    }
    .header {
      border-bottom: 0.5px solid #7b7b7b;
      padding: 10px 20px;
      div {
        font-weight: 600;
      }
      @media screen and (max-width: 920px) {
        div {
          display: none;
        }
        .funding {
          display: block;
        }
      }
    }
    .funding-row {
      padding: 20px;
      flex-wrap: wrap;
      position: relative;
    }
    .header,
    .funding-row {
      display: flex;
      justify-content: space-between;
      gap: 2rem;
      font-size: 14px;
      div {
        text-transform: capitalize;
        width: 100%;
        max-width: 120px;
        text-align: left;
        &:last-of-type {
          justify-content: right;
        }
      }
      .investor {
        display: flex;
        flex-direction: column;
        div:first-of-type {
          font-weight: 600;
        }
      }
      .mobile-date {
        display: none;
        color: #7b7b7b;
      }
      .amount {
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 1rem;
        svg {
          display: none;
          rotate: 180deg;
        }
      }
      .description {
        flex: 1;
        max-width: 100%;
      }
      .toggle-check {
        position: absolute;
        width: 100%;
        left: 0;
        top: 0;
        height: 100%;
        opacity: 0;
        display: none;
      }
      .date {
        display: flex;
        align-items: center;
      }
      @media screen and (max-width: 920px) {
        gap: 8px;
        div {
          max-width: initial;
        }
        .date {
          display: none;
        }
        .mobile-date {
          display: block;
        }
        .description {
          flex-basis: 100%;
          order: 1;
          max-height: 0;
          overflow: hidden;
          transition: max-height 200ms ease-in-out;
        }
        div {
          width: fit-content;
        }
        .amount svg {
          display: block;
        }
        .toggle-check {
          display: block;
        }
        .toggle-check:checked + .description {
          max-height: 200px;
        }
        .toggle-check:checked ~ div svg {
          rotate: 0deg;
        }
      }
    }
    @media screen and (max-width: 920px) {
      .header div:not(:first-of-type) {
        display: none;
      }
    }
  }
`;

export const Title = styled.div`
  font-size: 24px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const Arrow = styled.svg`
  width: 12px;
  transition: all 200ms;
`;
