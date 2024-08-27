import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  gap: 2rem;
  min-height: 430px;
  width: 100%;
  .col {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 33%;

    @media only screen and (max-width: 960px) {
      width: 100%;
    }
  }
  .item {
    position: relative;
    display: flex;
    justify-content: center;
    gap: 1rem;
    flex-direction: column;
    border-radius: 12px;
    background: #fef6ee;
    height: 50%;
    padding: 24px;
    font-size: 14px;
    &.first {
      box-shadow:
        0px 1px 2px -1px rgba(0, 0, 0, 0.08),
        0px 1px 1px -1px rgba(0, 0, 0, 0.12);
      border: 2px solid #dd3345;
      align-items: center;
      text-align: center;
      height: 100%;
      .profile-image {
        width: 64px;
        height: 64px;
      }
      .footer {
        flex-direction: column;
        gap: 1rem;
      }
      .amount {
        font-size: 32px;
        font-family: "Lora";
      }
    }
    .profile-image {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex !important;
      @media only screen and (max-width: 480px) {
        width: 40px;
        height: 40px;
      }
    }
    .name {
      white-space: nowrap;
      font-weight: 600;
      color: #292929;
      transition: all 300ms;
      font-size: 1rem;
      :hover {
        color: #dd3345;
        text-decoration: none;
      }
    }
    .footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }
    .amount {
      font-size: 22px;
      font-weight: 600;
    }
    .percentage {
      font-size: 1rem;
      background: #f8d3b0;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: 600;
      height: fit-content;
    }
  }
  @media only screen and (max-width: 960px) {
    gap: 1rem;
    flex-direction: column;
    .col {
      gap: 1rem;
    }
    .col:nth-child(2) {
      order: -1;
    }
  }
`;
