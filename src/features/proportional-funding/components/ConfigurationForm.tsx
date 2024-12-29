import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ByPotId } from "@/common/api/indexer";
import { Card, CardContent, CardFooter, Form } from "@/common/ui/components";
import { TextField } from "@/common/ui/form-fields";
import { cn } from "@/common/ui/utils";
import { usePotFeatureFlags } from "@/entities/pot";

import { votingConfigurationSchema } from "../model/schemas";

export type ProportionalFundingConfigurationFormProps = ByPotId & {
  className?: string;
  footerContent?: React.ReactNode;
};

export const ProportionalFundingConfigurationForm: React.FC<
  ProportionalFundingConfigurationFormProps
> = ({ potId, footerContent, className }) => {
  const { hasVoting } = usePotFeatureFlags({ potId });

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
        {hasVoting ? null : (
          <Form {...form}>
            <TextField type="text" />
          </Form>
        )}
      </CardContent>

      {footerContent && <CardFooter>{footerContent}</CardFooter>}
    </Card>
  );
};
