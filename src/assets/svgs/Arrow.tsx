const Arrow = (props: any) => (
  <svg
    {...props}
    style={{ rotate: !props.active ? "0deg" : "180deg" }}
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 6L1.0575 7.0575L5.25 2.8725V12H6.75V2.8725L10.935 7.065L12 6L6 0L0 6Z" fill="#7B7B7B" />
  </svg>
);

export default Arrow;
