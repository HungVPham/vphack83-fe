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
import { FormProvider, useForm } from "../../lib/FormContext";

interface DataInputFormContentProps {
  onSubmit?: () => void;
  onBack?: () => void;
}

function DataInputFormContent({ onSubmit, onBack }: DataInputFormContentProps) {
  const { t, interpolate } = useLanguage();
  const { submitForm, isSubmitting, submitError, submitSuccess } = useForm();
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
    } else if (currentStep === 1 && onBack) {
      onBack();
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

        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-600">
            <strong>Error:</strong> {submitError}
          </div>
        )}

        {submitSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 text-sm text-green-600">
            <strong>Success:</strong> Form submitted successfully!
          </div>
        )}

        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={handlePrevStep}
            disabled={currentStep === 1 && !onBack}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("dataInputForm.button.back")}
          </Button>

          <Button
            onClick={currentStep === totalSteps ? async () => { 
              await submitForm(); 
              if (submitSuccess) {
                onSubmit?.(); 
              }
            } : handleNextStep}
            variant={currentStep === totalSteps ? "default" : "next"}
            disabled={isSubmitting}
          >
            {currentStep === totalSteps
              ? isSubmitting 
                ? t("dataInputForm.button.submitting") || "Submitting..." 
                : t("dataInputForm.button.complete")
              : t("dataInputForm.button.continue")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface DataInputFormProps {
  onSubmit?: () => void;
  onBack?: () => void;
}

export function DataInputForm({ onSubmit, onBack }: DataInputFormProps) {
  return (
    <FormProvider>
      <DataInputFormContent onSubmit={onSubmit} onBack={onBack} />
    </FormProvider>
  );
}
