import React from "react";

const DeleteIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg {...props} viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2.5 14C2.0875 14 1.73437 13.8531 1.44062 13.5594C1.14687 13.2656 1 12.9125 1 12.5V2.5H0V1H4V0H8V1H12V2.5H11V12.491C11 12.9137 10.8531 13.2708 10.5594 13.5625C10.2656 13.8542 9.9125 14 9.5 14H2.5ZM9.5 2.5H2.5V12.5H9.5V2.5ZM4 11H5.5V4H4V11ZM6.5 11H8V4H6.5V11Z"
        fill="#7B7B7B"
      />
    </svg>
  );
};

export default DeleteIcon;
