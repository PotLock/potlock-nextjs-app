import { FocusEvent, FormEvent, useState } from "react";

import { Box, Plus, Trash } from "lucide-react";
import Image from "next/image";

import { truncate } from "@/common/lib";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Checkbox,
  DropdownMenuLabel,
  Input,
  Label,
  Switch,
} from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { validateUserInDao } from "@/modules/core";
import { addOrRemoveDaoAddress, markDaoAsDefault, toggleDao } from "@/modules/profile/utils";
import { useTypedSelector } from "@/store";

const ActAsDao = () => {
  const [inputActive, setInputActive] = useState(false);
  const [daoAddress, setDaoAddress] = useState("");
  const [daoError, setDaoError] = useState("");

  const { accountId, actAsDao } = useTypedSelector((state) => state.nav);

  const { addresses, defaultAddress, toggle } = actAsDao;

  const handleAddDao = async (e: FormEvent<HTMLFormElement> | FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!daoAddress && addresses.length) return;
    else setDaoError("Please enter a valid DAO address.");
    const check = await validateUserInDao(daoAddress, accountId);
    if (check) setDaoError(check);
    else if (addresses.includes(daoAddress)) {
      setDaoError("DAO address already exists.");
    } else {
      if (addresses.length === 0) markDaoAsDefault(daoAddress);
      addOrRemoveDaoAddress([...addresses, daoAddress]);
      setInputActive(false);
    }
  };

  const handleDefaultCheck = (checked: boolean, address: string) => {
    if (checked) markDaoAsDefault(address);
  };

  const removeDao = (index: number) => {
    // Create a new array excluding the item at the specified index
    const newAddresses = addresses.filter((_, i) => i !== index);
    addOrRemoveDaoAddress(newAddresses);
  };

  return (
    <DropdownMenuLabel className="flex flex-col items-start gap-2">
      <div className="flex w-full items-center justify-between">
        <Label htmlFor="act-dao" className="flex items-center gap-2">
          Act as DAO
          <Image src="/assets/icons/info-icon.svg" width={18} height={18} alt="info" />
        </Label>
        <Switch
          checked={toggle}
          id="act-dao"
          onClick={() => {
            toggleDao(!toggle);
            setInputActive(false);
            setDaoError("");
          }}
        />
      </div>
      {toggle && (
        <>
          <Accordion className="flex w-full flex-col gap-2" type="single" collapsible>
            {addresses?.map((address: string, idx: number) => {
              const isActive = address === defaultAddress;
              return (
                <AccordionItem
                  key={address}
                  value={address}
                  style={{
                    borderColor: isActive ? "#33DDCB" : "",
                  }}
                  className="rounded-md border border-[#DBDBDB]"
                >
                  <AccordionTrigger
                    hiddenChevron
                    className={cn(
                      "flex items-center justify-start gap-2 px-3 py-2.5",

                      {
                        "color-[#0B7A74]": isActive,
                        "color-[#656565]": !isActive,
                      },
                    )}
                  >
                    <Box
                      size={16}
                      className="text-inherit"
                      color={isActive ? "#33DDCB" : "#656565"}
                    />
                    {truncate(address, 22)}
                  </AccordionTrigger>
                  <AccordionContent className="flex items-center gap-2 px-3 py-[10px]">
                    <Checkbox
                      onCheckedChange={(checked) => handleDefaultCheck(!!checked, address)}
                      checked={isActive}
                      className="h-6 w-6 border-[#A6A6A6]"
                      id={`${address}-dao-default`}
                    />
                    <label
                      htmlFor={`${address}-dao-default`}
                      className="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {isActive ? "Default" : "Set as default"}
                    </label>
                    <Button className="ml-auto" variant={"standard-plain"} asChild>
                      <div>
                        <Trash
                          width={14}
                          onClick={() => removeDao(idx)}
                          strokeWidth={3}
                          color="#A6A6A6"
                        />
                      </div>
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
          {inputActive || !addresses?.length ? (
            <form className="flex w-full" onSubmit={handleAddDao}>
              <Input
                onChange={(e) => setDaoAddress(e.target.value)}
                onBlur={handleAddDao}
                error={daoError}
              />
              <button type="submit" className="h-0 w-0 opacity-0">
                Submit
              </button>
            </form>
          ) : (
            <Button onClick={() => setInputActive(!inputActive)} variant="standard-plain">
              <Plus color="#A6A6A6" size={14} />
              Add {!addresses?.length ? "" : "another"} DAO
            </Button>
          )}
        </>
      )}
    </DropdownMenuLabel>
  );
};

export default ActAsDao;
