import { useState } from "react";

import { Box, Plus, Trash } from "lucide-react";
import Image from "next/image";

import { _address } from "@/common/lib";
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
import { toggleDao } from "@/modules/profile/utils";

import { dispatch, useTypedSelector } from "../_store";

const ActAsDao = () => {
  const [inputActive, setInputActive] = useState(false);

  const { addresses, toggle, defaultAddress } = useTypedSelector(
    (state) => state.nav.actAsDao,
  );

  const { markDaoAsDefault, addOrRemoveDaoAddress } = dispatch.nav;

  return (
    <DropdownMenuLabel className="flex flex-col items-start gap-2">
      <div className="flex w-full items-center justify-between">
        <Label htmlFor="act-dao" className="flex items-center gap-2">
          Act as DAO
          <Image
            src="/assets/icons/info-icon.svg"
            width={18}
            height={18}
            alt="info"
          />
        </Label>
        <Switch id="act-dao" checked={toggle} onCheckedChange={toggleDao} />
      </div>
      <Accordion className="w-full" type="single" collapsible>
        {addresses?.map((address: string) => (
          <AccordionItem
            key={address}
            value="item-1"
            className="rounded-md border border-[#DBDBDB]"
          >
            <AccordionTrigger className="color-[#656565] flex items-center justify-start gap-2 px-3 py-[10px] text-[#656565] [&[data-state=open]]:text-[#33DDCB]">
              <Box size={16} className="text-inherit" />
              {_address(address, 22)}
            </AccordionTrigger>
            <AccordionContent className="flex items-center gap-2 px-3 py-[10px]">
              <Checkbox className="h-6 w-6 border-[#A6A6A6]" id="dao-default" />
              <label
                htmlFor="dao-default"
                className="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Set as default
              </label>
              <Button className="ml-auto" variant={"standard-plain"} asChild>
                <Trash size={20} strokeWidth={3} color="#A6A6A6" />
              </Button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {inputActive ? (
        <Input />
      ) : (
        <Button
          onClick={() => setInputActive(!inputActive)}
          variant="standard-plain"
        >
          <Plus color="#A6A6A6" size={14} />
          Add another DAO
        </Button>
      )}
    </DropdownMenuLabel>
  );
};

export default ActAsDao;
