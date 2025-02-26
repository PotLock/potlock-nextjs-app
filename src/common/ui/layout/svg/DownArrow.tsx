const DownArrow = (props: any) => (
  <svg
    {...props}
    style={{ rotate: !props.active ? "0deg" : "180deg" }}
    width="40"
    height="41"
    viewBox="0 0 40 41"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M24.59 16.7969L20 21.3769L15.41 16.7969L14 18.2069L20 24.2069L26 18.2069L24.59 16.7969Z"
      fill="#A6A6A6"
    />
  </svg>
);

export default DownArrow;
