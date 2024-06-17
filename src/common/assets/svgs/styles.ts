import styled from "styled-components";

export const Icon = styled.svg`
  width: 24px;
  height: 24px;
  path,
  rect {
    transition: all 300ms ease-in-out;
  }
  &#near-logo:hover path {
    fill: white;
  }
  :hover path,
  :hover rect {
    fill: #292929;
  }
`;
