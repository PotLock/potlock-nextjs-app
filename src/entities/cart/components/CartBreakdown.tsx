import { useState } from "react";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@/common/ui/layout/components";

import { useCart } from "../hooks";

export type CartBreakdownProps = {};

export const CartBreakdown: React.FC<CartBreakdownProps> = () => {
  const { items, checkout } = useCart();

  const [matchingAmount, setMatchingAmount] = useState(0);
  const [directAmount, setDirectAmount] = useState(0);
  const totalAmount = matchingAmount + directAmount;

  const handleDonate = () => {
    checkout();
  };

  return (
    <Card className="h-fit w-full md:w-80">
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

        <Button className="w-full bg-red-500 text-white hover:bg-red-600" onClick={handleDonate}>
          Donate ${totalAmount.toFixed(2)}
        </Button>
      </CardContent>
    </Card>
  );
};
