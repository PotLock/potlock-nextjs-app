import styled from "styled-components";

export const ModalHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 24px;
`;

export const ModalHeaderLeft = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

export const IconContainer = styled.div`
  width: 40px;
  height: 40px;
  background: #f0f0f0;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
`;

export const Icon = styled.svg`
  width: 20px;
  height: 20px;
  cursor: pointer;
  transition: 300ms ease-in-out;
  :hover {
    rotate: 180deg;
  }
`;

export const ModalTitle = styled.div`
  color: #2e2e2e;
  font-size: 16px;
  font-weight: 600;
`;

export const ModalDescription = styled.p`
  color: #2e2e2e;
  font-size: 16px;
  font-weight: 400;
`;

export const Space = styled.div`
  height: 24px;
`;

export const MembersCount = styled.span`
  color: #2e2e2e;
  font-weight: 600;
`;

export const MembersText = styled.div`
  color: #7b7b7b;
  font-size: 12px;
  font-weight: 400;
`;
