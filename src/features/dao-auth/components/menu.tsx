import { useCallback, useMemo, useState } from "react";

import { Info, Plus } from "lucide-react";

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
import { useWalletDaoStore } from "@/common/wallet";

import { DaoAuthOption } from "./option";
import { useDaoAuthNewOptionForm } from "../hooks/new-option-form";

const LISTING_FORM_ACCORDION_ID = "add-dao-address";

export type DaoAuthMenuProps = {
  userAccountId: AccountId;
};

export const DaoAuthMenu = ({ userAccountId }: DaoAuthMenuProps) => {
  const { toast } = useToast();

  const { listedAccountIds, delistDao, tryActivate, deactivate, isActive, activeAccountId } =
    useWalletDaoStore();

  const [isExpanded, setIsExpanded] = useState(isActive);
  const [activeAccordionValue, setActiveAccordionValue] = useState<string>("");
  const { form: newOptionForm, onSubmit: onDaoAuthOptionSubmit } = useDaoAuthNewOptionForm();

  const isNewOptionFormActive = useMemo(
    () => activeAccordionValue === LISTING_FORM_ACCORDION_ID,
    [activeAccordionValue],
  );

  console.log("activeAccordionValue", activeAccordionValue);

  const handleAddOptionCancel = useCallback(() => {
    newOptionForm.reset();
  }, [newOptionForm]);

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

  const handleActivate = useCallback(
    (listedDaoAccountIdIndex: number) =>
      tryActivate({
        userAccountId,
        listingIndex: listedDaoAccountIdIndex,

        onError: (error: Error) => {
          toast({ title: "Error", description: error.message, variant: "destructive" });
        },
      }),

    [toast, tryActivate, userAccountId],
  );

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
          defaultValue={listedAccountIds.length === 0 ? LISTING_FORM_ACCORDION_ID : undefined}
          onValueChange={setActiveAccordionValue}
          className="flex w-full flex-col gap-2"
        >
          {listedAccountIds.map((optionAccountId: string, accountIndex: number) => (
            <DaoAuthOption
              key={optionAccountId}
              accountId={optionAccountId}
              isActive={optionAccountId === activeAccountId}
              onActivateClick={() => handleActivate(accountIndex)}
              onRemoveClick={() => delistDao(optionAccountId)}
            />
          ))}

          <AccordionItem
            value={LISTING_FORM_ACCORDION_ID}
            className="flex flex-col rounded-md border border-neutral-200"
          >
            <AccordionTrigger
              hiddenChevron
              onClick={isNewOptionFormActive ? handleAddOptionCancel : undefined}
              rootClassName="order-1"
              className="justify-center gap-2"
            >
              {isNewOptionFormActive ? (
                "Cancel"
              ) : (
                <>
                  <Plus className="color-neutral-400" size={14} />
                  <span>{`Add ${listedAccountIds.length === 0 ? "" : "another"} DAO`}</span>
                </>
              )}
            </AccordionTrigger>

            <AccordionContent className="order-0 flex flex-col pb-0">
              <Form {...newOptionForm}>
                <form className="flex w-full flex-col gap-3 p-3" onSubmit={onDaoAuthOptionSubmit}>
                  <FormField
                    name="accountId"
                    control={newOptionForm.control}
                    render={({ field }) => (
                      <TextField
                        required
                        label="DAO Address"
                        type="text"
                        hint={
                          newOptionForm.formState.errors.accountId === undefined
                            ? `${
                                newOptionForm.formState.isValidating
                                  ? "Validating..."
                                  : "Press Enter to submit"
                              }`
                            : undefined
                        }
                        classNames={{ root: "w-full" }}
                        {...field}
                      />
                    )}
                  />

                  <Button type="reset" variant="brand-outline" className="w-full">
                    <span>{"Cancel"}</span>
                  </Button>
                </form>
              </Form>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </DropdownMenuLabel>
  );
};
