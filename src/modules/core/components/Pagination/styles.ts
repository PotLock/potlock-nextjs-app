import { styled } from "styled-components";

export const Container = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  list-style-type: none;
  li {
    display: flex;
    align-items: center;
    justify-content: center;
    &.disabled {
      pointer-events: none;

      .arrow::before {
        border-right: 0.12em solid rgba(0, 0, 0, 0.43);
        border-top: 0.12em solid rgba(0, 0, 0, 0.43);
      }

      &:hover {
        cursor: default;
      }
    }
  }
  .pagination-item {
    border: 1px solid transparent;
    background: #292929;
    border-radius: 2px;
    padding: 10px;
    font-size: 12px;
    color: white;
    cursor: pointer;
    transition: all 300ms;

    &.dots:hover {
      cursor: default;
      opacity: 1;
    }
    &:hover {
      opacity: 0.75;
    }

    &.selected {
      background: white;
      cursor: default;
      color: #292929;
      border-color: #292929;
    }
  }
  .arrow {
    cursor: pointer;
    &::before {
      position: relative;
      content: "";
      display: inline-block;
      width: 0.4em;
      height: 0.4em;
      border-right: 0.12em solid rgba(0, 0, 0, 0.87);
      border-top: 0.12em solid rgba(0, 0, 0, 0.87);
    }

    &.left {
      transform: rotate(-135deg) translate(-50%);
    }

    &.right {
      transform: rotate(45deg);
    }
  }
`;
