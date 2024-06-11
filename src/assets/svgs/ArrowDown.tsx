import styled from "styled-components";

const Arrow = styled.svg`
  width: 12px;
  rotate: 180deg;
  transition: all 200ms;
  display: none;
  @media screen and (max-width: 768px) {
    display: block;
  }
`;

const ArrowDown = (props: any) => (
  <Arrow {...props} viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 0.294983L0 6.29498L1.41 7.70498L6 3.12498L10.59 7.70498L12 6.29498L6 0.294983Z" fill="#7B7B7B" />
  </Arrow>
);

export default ArrowDown;
