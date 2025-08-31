import { useCallback, useMemo, useState } from "react";

import { Info, Plus } from "lucide-react";

import { EMPTY_STRING, type EmptyString } from "@/common/lib";
import type { AccountId } from "@/common/types";
import { TextField } from "@/common/ui/form/components";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  DropdownMenuLabel,
  Form,
  FormField,
  LabeledIcon,
  Switch,
} from "@/common/ui/layout/components";
import { useToast } from "@/common/ui/layout/hooks";
import { cn } from "@/common/ui/layout/utils";
import { useWalletDaoStore } from "@/common/wallet";

import { DaoAuthOption } from "./option";
import { useDaoAuthNewOptionForm } from "../hooks/new-option-form";

const LISTING_FORM_ACCORDION_ID = "add-dao-address";

export type DaoAuthMenuProps = {
  memberAccountId: AccountId;
};

export const DaoAuthMenu = ({ memberAccountId }: DaoAuthMenuProps) => {
  const { toast } = useToast();

  const {
    listedAccountIds: options,
    delistDao,
    tryActivate,
    deactivate,
    isActive,
    activeAccountId,
  } = useWalletDaoStore();

  const [isExpanded, setIsExpanded] = useState(isActive);

  const onSwitch = useCallback(
    (checked: boolean) => {
      if (checked) {
        setIsExpanded(true);
      } else {
        setIsExpanded(false);
        deactivate();
      }
    },

    [deactivate],
  );

  const [activeAccordionValue, setActiveAccordionValue] = useState<EmptyString | string>(
    options.length === 0 ? LISTING_FORM_ACCORDION_ID : EMPTY_STRING,
  );

  const isNewOptionFormActive = useMemo(
    () => activeAccordionValue === LISTING_FORM_ACCORDION_ID,
    [activeAccordionValue],
  );

  const resetAccordionValue = useCallback(() => setActiveAccordionValue(EMPTY_STRING), []);

  const {
    form: newOptionForm,
    handleReset,
    handleSubmit: handleNewOptionSubmit,
  } = useDaoAuthNewOptionForm({
    memberAccountId,
    onSubmit: resetAccordionValue,
  });

  const handleActivateOption = useCallback(
    (optionIndex: number) =>
      tryActivate({
        memberAccountId,
        optionIndex,

        onError: (error: Error) => {
          toast({ title: "Error", description: error.message, variant: "destructive" });
        },
      }),

    [memberAccountId, toast, tryActivate],
  );

  const handleAddOptionCancel = useCallback(() => {
    handleReset();
    resetAccordionValue();
  }, [handleReset, resetAccordionValue]);

  return (
    <DropdownMenuLabel className="flex flex-col items-center gap-2 p-0">
      <div className="flex w-full items-center justify-between">
        <LabeledIcon
          bold
          caption="Act as a DAO"
          positioning="text-icon"
          htmlFor="act-as-dao-switch"
        >
          <Info size={16} />
        </LabeledIcon>

        <Switch id="act-as-dao-switch" checked={isExpanded} onCheckedChange={onSwitch} />
      </div>

      {isExpanded && (
        <Accordion
          type="single"
          collapsible
          value={activeAccordionValue}
          onValueChange={setActiveAccordionValue}
          className="flex w-full flex-col gap-2"
        >
          {options.map((optionAccountId: string, accountIndex: number) => (
            <DaoAuthOption
              key={optionAccountId}
              accountId={optionAccountId}
              isActive={optionAccountId === activeAccountId}
              onActivateClick={() => handleActivateOption(accountIndex)}
              onRemoveClick={() => delistDao(optionAccountId)}
            />
          ))}

          <AccordionItem
            value={LISTING_FORM_ACCORDION_ID}
            className="flex flex-col rounded-md border border-neutral-200"
          >
            <AccordionTrigger
              hiddenChevron
              className={cn("justify-center gap-2", { hidden: isNewOptionFormActive })}
            >
              <Plus className="color-neutral-400" size={14} />
              <span>{`Add ${options.length === 0 ? "" : "another"} DAO`}</span>
            </AccordionTrigger>

            <AccordionContent className="flex flex-col pb-0">
              <Form {...newOptionForm}>
                <form
                  className="flex w-full flex-col gap-3 p-3"
                  onSubmit={handleNewOptionSubmit}
                  onReset={handleAddOptionCancel}
                >
                  <FormField
                    name="accountId"
                    control={newOptionForm.control}
                    render={({ field }) => (
                      <TextField
                        required
                        label="DAO Address"
                        type="text"
                        hint={newOptionForm.formState.isValidating ? "Validating..." : undefined}
                        classNames={{ root: "w-full" }}
                        {...field}
                      />
                    )}
                  />

                  <div className="flex flex-nowrap justify-between gap-2">
                    <Button type="submit">{"Submit"}</Button>

                    <Button type="reset" variant="brand-outline">
                      <span>{"Cancel"}</span>
                    </Button>
                  </div>
                </form>
              </Form>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </DropdownMenuLabel>
  );
};
