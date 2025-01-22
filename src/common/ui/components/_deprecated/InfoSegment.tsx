import { MdInfo } from "react-icons/md";
import { styled } from "styled-components";

export const Container = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 1em;
  gap: 0.75em;
  background: #fcfcfd;
  border: 1px solid #d0d5dd;
  border-radius: 4px;
  width: 100%;
  margin-top: 2rem;
  svg {
    width: 20px;
  }
`;

export const Text = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0px;
  gap: 0.75em;
`;

export const Heading = styled.div`
  font-style: normal;
  font-weight: 600;
  font-size: 0.95em;
  line-height: 1.25em;
  color: #344054;
`;

export const Description = styled.p`
  font-style: normal;
  font-weight: 400;
  font-size: 0.95em;
  line-height: 1.25em;
  color: #475467;
  white-space: wrap;
  margin: 0px;
`;

const InfoSegment = ({ title, description }: { title: string; description: string }) => {
  return (
    <Container>
      <MdInfo className="h-4 w-4" />
      <Text>
        <Heading>{title}</Heading>
        <Description>{description}</Description>
      </Text>
    </Container>
  );
};

export default InfoSegment;
