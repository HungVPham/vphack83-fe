import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup } from "@/components/ui/radio";
import { useLanguage } from "../../lib/LanguageContext";

const LoanInformationStep = () => {
  const { t } = useLanguage();
  const [loanType, setLoanType] = useState<"cash" | "revolving">("cash");
  const [loanAmount, setLoanAmount] = useState("");
  const [hasPurchase, setHasPurchase] = useState<"yes" | "no">("no");
  const [purchaseAmount, setPurchaseAmount] = useState("");

  // Format number to Vietnamese currency format
  const formatCurrency = (value: string) => {
    const number = value.replace(/\D/g, '');
    if (!number) return '';
    return new Intl.NumberFormat('vi-VN').format(parseInt(number));
  };

  const handleAmountChange = (value: string, setter: (value: string) => void) => {
    const numericValue = value.replace(/\D/g, '');
    setter(numericValue);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          {t("loanInfo.title")}
        </h3>

        {/* Loan Type Selection */}
        <div className="space-y-4">
          <div className="text-left">
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              {t("loanInfo.loanType")}
            </Label>
            <RadioGroup
              options={[
                { value: "cash", label: t("loanInfo.loanType.cash") },
                { value: "revolving", label: t("loanInfo.loanType.revolving") }
              ]}
              value={loanType}
              onChange={(value) => setLoanType(value as "cash" | "revolving")}
              name="loanType"
              direction="horizontal"
              className="mt-2"
            />
          </div>

          {/* Loan Amount */}
          <div className="text-left">
            <Label htmlFor="loanAmount" className="text-sm font-medium text-gray-700">
              {t("loanInfo.loanAmount")}
            </Label>
            <div className="relative mt-1">
              <input
                id="loanAmount"
                type="text"
                value={formatCurrency(loanAmount)}
                onChange={(e) => handleAmountChange(e.target.value, setLoanAmount)}
                placeholder="0"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-12"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                VND
              </div>
            </div>
          </div>

          {/* Purchase Funding Question */}
          <div className="text-left">
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              {t("loanInfo.hasPurchase")}
            </Label>
            <RadioGroup
              options={[
                { value: "yes", label: t("loanInfo.hasPurchase.yes") },
                { value: "no", label: t("loanInfo.hasPurchase.no") }
              ]}
              value={hasPurchase}
              onChange={(value) => setHasPurchase(value as "yes" | "no")}
              name="hasPurchase"
              direction="horizontal"
              className="mt-2"
            />
          </div>

          {/* Purchase Amount (conditionally shown) */}
          {hasPurchase === "yes" && (
            <div className="text-left">
              <Label htmlFor="purchaseAmount" className="text-sm font-medium text-gray-700">
                {t("loanInfo.purchaseAmount")}
              </Label>
              <div className="relative mt-1">
                <input
                  id="purchaseAmount"
                  type="text"
                  value={formatCurrency(purchaseAmount)}
                  onChange={(e) => handleAmountChange(e.target.value, setPurchaseAmount)}
                  placeholder="0"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-12"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                  VND
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanInformationStep;