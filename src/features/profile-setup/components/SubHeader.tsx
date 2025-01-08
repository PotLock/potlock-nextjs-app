import { SubTitle } from "./styles";

const SubHeader = ({
  title,
  required,
  className,
}: {
  title: string;
  required?: boolean;
  className?: string;
}) => (
  <SubTitle className={className}>
    {title}
    {required ? (
      <span className="required">Required</span>
    ) : (
      <span className="optional">Optional</span>
    )}
  </SubTitle>
);

export default SubHeader;
