import { styled } from "styled-components";

export const Container = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 4rem;
  gap: 2rem;
  .dropdown {
    display: none;
  }
  @media only screen and (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    .dropdown {
      display: flex;
    }
  }
`;

export const Filter = styled.div`
  display: grid;
  width: 286px;
  border-radius: 6px;
  padding: 8px 0;
  border: 1px solid var(--Neutral-500, #7b7b7b);
  height: fit-content;
  .item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0.5rem 1rem;
    font-size: 14px;
    cursor: pointer;
    svg {
      opacity: 0;
      transition: all 300ms ease;
    }
    &.active {
      svg {
        opacity: 1;
      }
    }
    &:hover {
      svg {
        opacity: 1;
      }
    }
  }
  .count {
    color: #7b7b7b;
    margin-left: auto;
  }
  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

export const ApplicationsWrapper = styled.div`
  border-radius: 6px;
  border: 1px solid #7b7b7b;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-width: 711px;
  width: 100%;
`;
export const SearchBar = styled.div`
  display: flex;
  position: relative;
  svg {
    position: absolute;
    left: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
  }
  input {
    font-size: 14px;
    background: #f6f5f3;
    width: 100%;
    height: 100%;
    padding: 8px 24px 8px 60px;
    border: none;
    outline: none;
  }
  @media only screen and (max-width: 768px) {
    svg {
      left: 1rem;
    }

    input {
      padding: 8px 24px 8px 54px;
    }
  }
`;

export const ApplicationRow = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  font-size: 14px;
  position: relative;
  border-top: 1px solid #c7c7c7;
  .header {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    position: relative;
    align-items: center;
  }
  .header-info {
    display: flex;
    gap: 8px;
    align-items: center;
    cursor: auto;
  }
  .profile-image {
    margin-right: 8px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
  }
  .name {
    color: #292929;
    font-weight: 600;
  }
  .address {
    color: #7b7b7b;
    font-weight: 600;
    cursor: pointer;
    transition: all 300ms;
    position: relative;
    z-index: 2;
    &:hover {
      color: #292929;
    }
  }
  .content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: hidden;
    transition: all 300ms ease-in-out;
    max-height: 0;
    .message {
      padding-top: 1rem;
    }
    .notes {
      display: flex;
      flex-direction: column;
      gap: 8px;
      .title {
        color: #7b7b7b;
      }
    }
    button {
      width: fit-content;
    }
  }
  .arrow {
    rotate: 180deg;
    transition: all 300ms;
  }
  .toggle-check {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 67px;
    z-index: 1;
    opacity: 0;
    cursor: pointer;
  }
  .toggle-check:checked + .header .arrow {
    rotate: 0deg;
  }
  .toggle-check:checked + .header + .content {
    max-height: 100%;
  }
  @media only screen and (max-width: 768px) {
    padding: 1rem;
    .header-info {
      flex-wrap: wrap;
      gap: 0px;
    }
    .name {
      margin: 0 8px;
    }
    .date {
      line-height: 1;
      width: 100%;
      margin-left: 2.5rem;
    }
  }
`;

export const Dot = styled.div`
  width: 6px;
  height: 6px;
  background: #7b7b7b;
  border-radius: 50%;

  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

export const Status = styled.div`
  display: flex;
  padding: 6px 12px;
  gap: 8px;
  align-items: center;
  border-width: 1px;
  border-style: solid;
  border-radius: 4px;
  margin-left: auto;
  div {
    font-weight: 500;
  }
  svg {
    width: 1rem;
  }
  @media only screen and (max-width: 768px) {
    padding: 6px;
    div {
      display: none;
    }
    svg {
      width: 16px;
    }
  }
`;

export const DropdownLabel = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  .label {
    font-weight: 500;
  }
  .count {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #ebebeb;
  }
`;
