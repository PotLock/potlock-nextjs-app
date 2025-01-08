import InfoIcon from "@/common/ui/svg/InfoIcon";

import { Container, Description, Heading, Text } from "./styles";

const InfoSegment = ({ title, description }: { title: string; description: string }) => {
  return (
    <Container>
      <InfoIcon />
      <Text>
        <Heading>{title}</Heading>
        <Description>{description}</Description>
      </Text>
    </Container>
  );
};

export default InfoSegment;
