import styled from "styled-components";

export const LinktreeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  -webkit-box-pack: start;
  justify-content: flex-start;
  gap: 1rem;
`;

export const LinktreeItemContainer = styled.a`
  display: flex;
  svg {
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
  }
`;

export const LinkText = styled.a<{ disabled?: boolean }>`
  font-size: 14px;
  color: gray;
  font-weight: 400;
  margin-left: 16px;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};

  &:hover {
    text-decoration: none;
  }
`;
