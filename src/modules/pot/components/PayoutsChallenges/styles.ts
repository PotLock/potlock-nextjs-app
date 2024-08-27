import { styled } from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
export const Title = styled.div`
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  width: fit-content;
  cursor: pointer;
  margin-bottom: 1.5rem;
  div:first-of-type {
    font-weight: 600;
  }
  svg {
    rotate: 180deg;
    transition: all 300ms ease-in-out;
  }
`;
export const Table = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 6px;
  border: 1px solid #7b7b7b;
  transition: max-height 400ms ease-in-out;
  overflow: hidden;
  opacity: 1;
  &.hidden {
    opacity: 0;
    max-height: 0;
  }
`;

export const Challenge = styled.div`
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid #c7c7c7;
  font-size: 14px;
  &:last-of-type {
    border-bottom: none;
  }
  .vertical-line {
    height: 100%;
    background: #c7c7c7;
    width: 1px;
    transform: translateX(0.75rem);
    z-index: -1;
  }
  .profile-image {
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.5rem;
  }
  .admin-icon {
    margin-right: 0.75rem;
    svg {
      width: 1.5rem;
      height: 1.5rem;
    }
  }
  .content {
    display: flex;
    flex-direction: column;
  }
  .header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
  }
  .id {
    font-weight: 600;
    color: #292929;
    transition: 200ms;
    :hover {
      text-decoration: none;
      color: #dd3345;
    }
  }
  .title {
    font-weight: 600;
    color: #8b5af8;
  }
  .reason {
    color: #7b7b7b;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    padding-left: 2.5rem;
    background: white;
  }
  .admin-header {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  .dot {
    background: #7b7b7b;
    width: 5px;
    height: 5px;
    border-radius: 50%;
  }
  .resolved-state {
    font-weight: 600;
  }
  .resolve-btn {
    cursor: pointer;
    background: none;
    border: none;
  }
  @media only screen and (max-width: 480px) {
    .profile-image {
      margin-right: 0;
    }
    .admin-icon {
      margin-right: 0.25rem;
    }
    .reason {
      padding-left: 2rem;
    }
    .date {
      width: 100%;
      margin-top: -0.5rem;
      padding-left: 2rem;
    }
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  background: white;
  padding: 24px 24px 12px 24px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  font-weight: 500;
`;

export const ModalBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  padding: 24px;
  border-top: 1px #f0f0f0 solid;
  background: #fafafa;
  gap: 8px;
`;

export const ModalFooter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  background: #fafafa;
  padding: 12px 24px 24px 24px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  gap: 24px;
  width: 100%;
`;

export const HeaderItemText = styled.div`
  color: #292929;
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
  word-wrap: break-word;
`;

export const Line = styled.div`
  width: 100%;
  height: 1px;
  background: #c7c7c7;
  margin: 3rem 0;
`;
