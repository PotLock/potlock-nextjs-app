import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
} from "@/common/ui/components";

export type CartWidgetProps = {};

export const CartWidget: React.FC<CartWidgetProps> = () => {
  const [matchingAmount, setMatchingAmount] = useState(0);
  const [directAmount, setDirectAmount] = useState(0);

  const totalFeeBasisPoints = 500;
  const totalAmount = (matchingAmount + directAmount) * totalFeeBasisPoints;

  const breakdown = (
    <Card className="md:w-80 h-fit w-full">
      <CardHeader>
        <CardTitle>Breakdown Summary</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="flex justify-between">
          <span>Currency</span>
          <span>USD</span>
        </div>

        <div className="flex justify-between">
          <div className="flex items-center gap-1">
            <span className="text-xs">Ⓝ</span>
            <span>{matchingAmount.toFixed(2)}</span>
          </div>
          <span>${(matchingAmount * 1.195).toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <div className="flex items-center gap-1">
            <span className="text-xs">Ⓝ</span>
            <span>{directAmount.toFixed(2)}</span>
          </div>
          <span>${(directAmount * 1.195).toFixed(2)}</span>
        </div>

        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>

        <Button className="w-full bg-red-500 text-white hover:bg-red-600">
          Donate ${totalAmount.toFixed(2)}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="md:flex-row flex min-h-screen flex-col gap-6 p-6">
      <div className="flex flex-1 flex-col gap-6">
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
            <p className="text-sm text-muted-foreground">
              Matching Round 2: NDC Grassroots
            </p>

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
            <p className="text-sm text-muted-foreground">Direct Donation</p>

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

                <AccordionContent>
                  <div className="flex flex-col gap-2">
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
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {breakdown}
    </div>
  );
};