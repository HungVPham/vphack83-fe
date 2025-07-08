import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { StepProgress } from "../ui/step-progress";
import { ChevronLeft } from "lucide-react";
import { PersonalInformationStep } from "./PersonalInformationStep";
import { ProfessionalProfileStep } from "./ProfessionalProfileStep";
import { DocumentUploadStep } from "./DocumentUploadStep";
import LoanInformationStep from "./LoanInformationStep";

export function DataInputForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [userType, setUserType] = useState<string>("");

  const totalSteps = 4;

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInformationStep />;
      case 2:
        return <LoanInformationStep />;
      case 3:
        return (
          <ProfessionalProfileStep
            userType={userType}
            setUserType={setUserType}
          />
        );
      case 4:
        return <DocumentUploadStep />;
      default:
        return <PersonalInformationStep />;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Thông tin cá nhân";
      case 2:
        return "Thông tin vay";
      case 3:
        return "Hồ sơ nghề nghiệp";
      case 4:
        return "Tài liệu tài chính";
      default:
        return "Thông tin cá nhân";
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-xl font-semibold text-gray-800">
            Đánh giá tín dụng AI
          </CardTitle>
          <span className="text-sm text-gray-500">{getStepTitle()}</span>
        </div>
        <StepProgress
          currentStep={currentStep}
          totalSteps={totalSteps}
          onStepClick={handleStepClick}
          className="mb-2"
        />
        <div className="text-center">
          <span className="text-sm text-gray-500">
            Bước {currentStep} / {totalSteps}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {renderCurrentStep()}

        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Quay lại
          </Button>

          <Button
            onClick={handleNextStep}
            disabled={currentStep === totalSteps}
          >
            {currentStep === totalSteps ? "Hoàn thành" : "Tiếp tục"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
