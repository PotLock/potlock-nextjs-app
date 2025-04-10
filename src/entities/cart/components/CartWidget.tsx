import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
} from "@/common/ui/layout/components";

import { CartBreakdown } from "./CartBreakdown";
import { useCart } from "../hooks";

export type CartWidgetProps = {};

export const CartWidget: React.FC<CartWidgetProps> = () => {
  const { items } = useCart();
  const [matchingAmount, setMatchingAmount] = useState(0);
  const [directAmount, setDirectAmount] = useState(0);

  return (
    <div className="flex h-fit flex-col gap-6 p-6 md:flex-row">
      <div className="flex h-fit flex-1 flex-col gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-green-500" />
              <CardTitle>Food Bank Wallet</CardTitle>
            </div>

            <div className="flex items-center gap-1">
              <span className="font-bold">50</span>
              <span className="text-xs">Ⓝ</span>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <p className="text-muted-foreground text-sm">Matching Round 2: NDC Grassroots</p>

            <div className="flex items-center justify-between">
              <span>NEAR</span>
              <span>$ {matchingAmount.toFixed(2)}</span>
            </div>

            <Input
              type="number"
              placeholder="0.00"
              value={matchingAmount || ""}
              onChange={(e) => setMatchingAmount(Number(e.target.value))}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-2">
              <Checkbox id="terms" />
              <CardTitle>Food Bank Wallet</CardTitle>
            </div>

            <div className="flex items-center gap-1">
              <span className="font-bold">50</span>
              <span className="text-xs">Ⓝ</span>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <p className="text-muted-foreground text-sm">Direct Donation</p>

            <div className="flex items-center justify-between">
              <span>NEAR</span>
              <span>$ {directAmount.toFixed(2)}</span>
            </div>

            <Input
              type="number"
              placeholder="0.00"
              value={directAmount || ""}
              onChange={(e) => setDirectAmount(Number(e.target.value))}
            />

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="breakdown">
                <AccordionTrigger>Show breakdown</AccordionTrigger>

                <AccordionContent className="gap-2">
                  <div className="flex justify-between text-sm">
                    <span>Project allocation (92.5%)</span>
                    <div className="flex items-center gap-1">
                      <span>{(directAmount * 0.925).toFixed(2)}</span>
                      <span className="text-xs">Ⓝ</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Protocol fees (5%)</span>
                    <div className="flex items-center gap-1">
                      <span>{(directAmount * 0.05).toFixed(2)}</span>
                      <span className="text-xs">Ⓝ</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Referral fees (2.5%)</span>
                    <div className="flex items-center gap-1">
                      <span>{(directAmount * 0.025).toFixed(2)}</span>
                      <span className="text-xs">Ⓝ</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Chef fees (5%)</span>
                    <div className="flex items-center gap-1">
                      <span>{(directAmount * 0.05).toFixed(2)}</span>
                      <span className="text-xs">Ⓝ</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>

      <CartBreakdown />
    </div>
  );
};
