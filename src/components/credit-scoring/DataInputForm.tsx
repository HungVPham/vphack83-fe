import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { StepProgress } from "../ui/step-progress";
import { ChevronLeft } from "lucide-react";
import { PersonalInformationStep } from "./PersonalInformationStep";
import { PersonalPropertyStep } from "./PersonalPropertyStep";
import { ProfessionalProfileStep } from "./ProfessionalProfileStep";
import { DocumentUploadStep } from "./DocumentUploadStep";
import LoanInformationStep from "./LoanInformationStep";
import { useLanguage } from "../../lib/LanguageContext";

export function DataInputForm() {
  const { t, interpolate } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);

  const totalSteps = 5;

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
        return <PersonalPropertyStep />;
      case 3:
        return <LoanInformationStep />;
      case 4:
        return <ProfessionalProfileStep />;
      case 5:
        return <DocumentUploadStep />;
      default:
        return <PersonalInformationStep />;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return t("dataInputForm.step.personalInfo");
      case 2:
        return t("dataInputForm.step.personalProperty");
      case 3:
        return t("dataInputForm.step.loanInfo");
      case 4:
        return t("dataInputForm.step.professionalProfile");
      case 5:
        return t("dataInputForm.step.financialDocuments");
      default:
        return t("dataInputForm.step.personalInfo");
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-xl font-semibold text-gray-800">
            {t("dataInputForm.title")}
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
            {interpolate(t("dataInputForm.stepCounter"), {
              current: currentStep,
              total: totalSteps,
            })}
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
            {t("dataInputForm.button.back")}
          </Button>

          <Button
            onClick={handleNextStep}
            disabled={currentStep === totalSteps}
            variant={currentStep === totalSteps ? "default" : "next"}
          >
            {currentStep === totalSteps
              ? t("dataInputForm.button.complete")
              : t("dataInputForm.button.continue")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
