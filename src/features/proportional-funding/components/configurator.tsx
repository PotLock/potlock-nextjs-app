import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ByPotId } from "@/common/api/indexer";
import { TextField } from "@/common/ui/form/components";
import { Card, CardContent, CardFooter, Form } from "@/common/ui/layout/components";
import { cn } from "@/common/ui/layout/utils";
import { usePotFeatureFlags } from "@/entities/pot";

import { proportionalFundingConfigurationSchema } from "../model/schemas";

export type PFConfiguratorProps = ByPotId & {
  className?: string;
  footerContent?: React.ReactNode;
};

export const PFConfigurator: React.FC<PFConfiguratorProps> = ({
  potId,
  footerContent,
  className,
}) => {
  const { hasPFMechanism } = usePotFeatureFlags({ potId });

  const form = useForm({ resolver: zodResolver(proportionalFundingConfigurationSchema) });

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
        {hasPFMechanism ? null : (
          <Form {...form}>
            <TextField type="text" />
          </Form>
        )}
      </CardContent>

      {footerContent && <CardFooter>{footerContent}</CardFooter>}
    </Card>
  );
};
