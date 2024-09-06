import React, { ChangeEvent } from "react";

import { Container } from "./styles";

type Option = {
  label: string | React.ReactNode;
  value: string;
};

type Props = {
  options: Option[];
  name: string;
  value: string;
  customClassName?: string;
  customStyle?: React.CSSProperties;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

const Radio = ({
  options,
  customClassName,
  customStyle,
  name,
  value,
  onChange,
}: Props) => {
  return (
    <Container>
      {options.map((option: Option) => (
        <div
          key={option.value}
          className={`option ${customClassName || customClassName}`}
          style={customStyle || {}}
        >
          <div
            className={`radio-btn ${value === option.value ? "active" : ""}`}
          >
            <div />
            <input
              className="input"
              type="radio"
              value={option.value}
              name={name}
              checked={option.value === value}
              onChange={onChange}
            />
          </div>
          <p className="label">{option.label}</p>
        </div>
      ))}
    </Container>
  );
};

export default Radio;
