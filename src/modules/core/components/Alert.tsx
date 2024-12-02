import Link from "next/link";
import { styled } from "styled-components";

import { WarningIcon } from "@/common/assets/svgs";
import { Button } from "@/common/ui/components";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.5rem;
  width: 100%;
  gap: 8px;
  border-radius: 6px;
  padding: 16px;
  border: 1px solid #f0cf1f;
  background-color: #fbf9c6;
  box-shadow:
    0px -2px 2px 0px #9a670e3d inset,
    0px 1px 0px 1px #ffffff inset;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

type Props = {
  // type: "normal" | "warning" | "error",
  text: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
  buttonHref?: string; // this has preference over onButtonClick
};

export const Alert = ({ text, buttonLabel, onButtonClick, buttonHref }: Props) => {
  return (
    <Container>
      <div className="flex items-center">
        <div className="h-[18px] w-[18px]">
          <WarningIcon />
        </div>
        <p className="font-400 ml-3 text-[14px]">{text}</p>
      </div>
      {buttonLabel && (
        <Button
          className="ml-4"
          variant="brand-plain"
          onClick={() => {
            if (!buttonHref && onButtonClick) {
              onButtonClick();
            }
          }}
        >
          {buttonHref ? (
            <Link className="font-500" href={buttonHref} target="blank_">
              {buttonLabel}
            </Link>
          ) : (
            buttonLabel
          )}
        </Button>
      )}
    </Container>
  );
};

export default Alert;
