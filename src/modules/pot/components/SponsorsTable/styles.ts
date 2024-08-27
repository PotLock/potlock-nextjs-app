import { styled } from "styled-components";

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding-bottom: 2rem;
  border-radius: 6px;
  border: 1px solid #7b7b7b;
  overflow: hidden;
  .transaction {
    display: flex;
    flex-direction: column;
    width: 100%;
    font-size: 14px;
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 1rem;
      gap: 1rem;
      color: #7b7b7b;
      div {
        display: flex;
        align-items: center;
        font-weight: 600;
        &:last-of-type {
          justify-content: flex-end;
        }
      }
    }
    .address {
      width: 190px;
      margin-right: auto;
      justify-content: start !important;
    }
    .rank {
      width: 40px;
      margin-right: 2rem;
      justify-content: center;
    }
  }
  @media only screen and (max-width: 768px) {
    .transaction {
      font-size: 12px;
      .header {
        padding: 0.5rem;
      }
      .rank {
        margin-right: 0;
        width: 30px;
      }
    }
  }
  @media only screen and (max-width: 480px) {
    .transaction .address {
      width: 135px;
      flex: 1;
    }
  }
`;

export const TrRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 1rem;
  padding: 1rem;
  border-top: 1px solid #c7c7c7;
  > div {
    display: flex;
    align-items: center;
  }

  .address {
    color: #292929;
    font-weight: 600;

    display: flex;
    align-items: center;
    justify-content: flex-start;
    border-radius: 2px;
    transition: all 200ms;
    .profile-image {
      width: 1.5rem;
      height: 1.5rem;
      margin-right: 1rem;
    }
  }
  .sponsors-amount {
    justify-content: flex-end;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  @media only screen and (max-width: 768px) {
    padding: 1rem 0.5rem;
  }
`;

export const Percentage = styled.div`
  background: #ebebeb;
  box-shadow:
    0px -1px 0px 0px #dbdbdb inset,
    0px 0px 0px 0.5px #dbdbdb;
  border-radius: 4px;
  padding: 2px 4px;
  min-width: 60px;
  text-align: right;
`;

export const NoResult = styled.div`
  font-size: 1.125rem;
  text-align: center;
`;
