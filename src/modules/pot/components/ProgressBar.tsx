import { ProgressBarWrapper } from "./styles";

const ProgressBar = ({ progress, completed, started }: any) => (
  <ProgressBarWrapper>
    <svg viewBox="0 0 160 160" className="circle">
      <circle
        r="70"
        cx="80"
        cy="80"
        fill="transparent"
        stroke={completed ? "#629D13" : started ? "#000000" : "#C7C7C7"}
        strokeWidth="12px"
      ></circle>
      <circle
        r="70"
        cx="80"
        cy="80"
        fill="transparent"
        stroke="#C7C7C7"
        strokeWidth="12px"
        strokeDasharray="439.6px"
        strokeDashoffset={439.6 * progress + "px"}
      ></circle>
    </svg>
    <svg className="check" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.72667 7.05333L0.946667 4.27333L0 5.21333L3.72667 8.94L11.7267 0.94L10.7867 0L3.72667 7.05333Z"
        style={{
          fill: completed ? "#629D13" : started ? "#7B7B7B" : "#C7C7C7",
        }}
      />
    </svg>
  </ProgressBarWrapper>
);

export default ProgressBar;
