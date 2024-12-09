import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { isNonNullish } from "remeda";

import { ByPotId } from "@/common/api/indexer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Form,
} from "@/common/ui/components";
import { TextField } from "@/common/ui/form-fields";
import { cn } from "@/common/ui/utils";

import { useVotingElection } from "../hooks/elections";
import { votingConfigurationSchema } from "../model/schemas";

export type VotingConfigurationProps = ByPotId & {
  className?: string;
  footerContent?: React.ReactNode;
};

export const VotingConfiguration: React.FC<VotingConfigurationProps> = ({
  potId,
  footerContent,
  className,
}) => {
  const { data: associatedElection } = useVotingElection({ potId });
  const isVotingConfigured = true || isNonNullish(associatedElection);

  const form = useForm({ resolver: zodResolver(votingConfigurationSchema) });

  return (
    <Card className={cn("w-full", className)}>
      {/* <CardHeader>
        <CardTitle>{"Voting Contract"}</CardTitle>

        <CardDescription>
          {
            "A blockchain-based governance system where stakeholders can directly participate in decision - making through secure, transparent voting mechanisms that determine project direction and resource allocation."
          }
        </CardDescription>
      </CardHeader> */}

      <CardContent>
        {isVotingConfigured ? null : (
          <Form {...form}>
            <TextField type="text" />
          </Form>
        )}
      </CardContent>

      {footerContent && <CardFooter>{footerContent}</CardFooter>}
    </Card>
  );
};
