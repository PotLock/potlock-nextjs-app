import { SubTitle } from "./styles";

const SubHeader = ({
  title,
  required,
}: {
  title: string;
  required?: boolean;
}) => (
  <SubTitle>
    {title}
    {required ? (
      <span className="required">Required</span>
    ) : (
      <span className="optional">Optional</span>
    )}
  </SubTitle>
);

export default SubHeader;
