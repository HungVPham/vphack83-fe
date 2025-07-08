import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface StepProgressProps extends HTMLAttributes<HTMLDivElement> {
  currentStep: number;
  totalSteps: number;
  onStepClick: (step: number) => void;
}

const StepProgress = forwardRef<HTMLDivElement, StepProgressProps>(
  ({ className, currentStep, totalSteps, onStepClick, ...props }, ref) => {
    const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

    return (
      <div
        ref={ref}
        className={cn('w-full px-4', className)}
        {...props}
      >
        <div className="flex items-center justify-between w-full relative">
          {/* Background line that spans the full width */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 transform -translate-y-1/2" />
          
          {/* Progress line */}
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-[#0052FF] transform -translate-y-1/2 transition-all duration-300"
            style={{ 
              width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` 
            }}
          />

          {/* Step circles */}
          {steps.map((step) => (
            <button
              key={step}
              onClick={() => onStepClick(step)}
              className={cn(
                'relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 border-2 z-10',
                step <= currentStep
                  ? 'bg-[#015aad] text-white border-[#015aad]'
                  : 'bg-white text-gray-500 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              )}
            >
              {step}
            </button>
          ))}
        </div>
      </div>
    );
  }
);

StepProgress.displayName = 'StepProgress';

export { StepProgress }; 