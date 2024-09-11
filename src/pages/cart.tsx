import { ChevronDown, ChevronUp } from "lucide-react";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Checkbox,
  Input,
} from "@/common/ui/components";

export default function CartPage() {
  return (
    <div className="md:flex-row flex min-h-screen flex-col gap-6 bg-gray-100 p-6">
      <div className="flex-1 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-green-500" />
              <CardTitle>Food Bank Wallet</CardTitle>
            </div>

            <div className="flex items-center space-x-1">
              <span className="font-bold">50</span>
              <span className="text-xs">Ⓝ</span>
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              Matching Round 2: NDC Grassroots
            </p>

            <div className="mt-4 flex items-center justify-between">
              <span>NEAR</span>
              <span>$ 0.00</span>
            </div>

            <Input type="number" placeholder="0.00" className="mt-2" />

            <Button className="mt-2 flex w-full items-center justify-center">
              <span>Show breakdown</span>
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <CardTitle>Food Bank Wallet</CardTitle>
            </div>

            <div className="flex items-center space-x-1">
              <span className="font-bold">50</span>
              <span className="text-xs">Ⓝ</span>
            </div>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">Direct Donation</p>

            <div className="mt-4 flex items-center justify-between">
              <span>NEAR</span>
              <span>$ 0.00</span>
            </div>

            <Input type="number" placeholder="0.00" className="mt-2" />

            <Button className="mt-2 flex w-full items-center justify-center">
              <span>Hide breakdown</span>
              <ChevronUp className="ml-2 h-4 w-4" />
            </Button>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Project allocation (92.5%)</span>
                <div className="flex items-center space-x-1">
                  <span>46.25</span>
                  <span className="text-xs">Ⓝ</span>
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <span>Protocol fees (5%)</span>
                <div className="flex items-center space-x-1">
                  <span>2.5</span>
                  <span className="text-xs">Ⓝ</span>
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <span>Referral fees (2.5%)</span>
                <div className="flex items-center space-x-1">
                  <span>1.25</span>
                  <span className="text-xs">Ⓝ</span>
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <span>Chef fees (5%)</span>
                <div className="flex items-center space-x-1">
                  <span>2.5</span>
                  <span className="text-xs">Ⓝ</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="md:w-80 w-full">
        <CardHeader>
          <CardTitle>Breakdown Summary</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Currency</span>
              <span>USD</span>
            </div>

            <div className="flex justify-between">
              <div className="flex items-center space-x-1">
                <span className="text-xs">Ⓝ</span>
                <span>46.25</span>
              </div>
              <span>$55.26</span>
            </div>

            <div className="flex justify-between">
              <div className="flex items-center space-x-1">
                <span className="text-xs">Ⓝ</span>
                <span>46.25</span>
              </div>
              <span>$55.26</span>
            </div>

            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>$110.52</span>
            </div>

            <Button className="w-full bg-red-500 text-white hover:bg-red-600">
              Donate $110.52
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
