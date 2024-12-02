const FileText = (props: any) => (
  <svg {...props} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6 12H12V13.5H6V12ZM6 9H12V10.5H6V9ZM10.5 1.5H4.5C3.675 1.5 3 2.175 3 3V15C3 15.825 3.6675 16.5 4.4925 16.5H13.5C14.325 16.5 15 15.825 15 15V6L10.5 1.5ZM13.5 15H4.5V3H9.75V6.75H13.5V15Z"
      fill={props.fill ?? "#EA6A25"}
    />
  </svg>
);

export default FileText;
