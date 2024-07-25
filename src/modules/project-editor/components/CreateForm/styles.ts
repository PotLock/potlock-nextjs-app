import { styled } from "styled-components";

export const SubTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  gap: 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  span {
    font-size: 14px;
    line-height: 140%;
  }
  .optional {
    color: #656565;
  }
  .required {
    color: #db521b;
    font-weight: 500;
  }
  @media only screen and (max-width: 768px) {
    font-size: 18px;
  }
`;

export const LowerBannerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export const LowerBannerContainerLeft = styled.div`
  display: flex;
`;
