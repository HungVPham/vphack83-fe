import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from 'react-oidc-context';

// Define the complete form data structure
export interface FormData {
  // Personal Information
  fullName: string | null;
  CODE_GENDER: string | null;
  NAME_FAMILY_STATUS: string | null;
  hasChildren: string | null;
  CNT_CHILDREN: number | null;
  DAYS_BIRTH: number | null;
  phoneNumber: string | null;
  FLAG_MOBIL: 0 | 1 | null;
  email: string | null;
  FLAG_EMAIL: 0 | 1 | null;
  province: string | null;
  ward: string | null;
  REGION_RATING_CLIENT: number | null;
  REGION_RATING_CLIENT_W_CITY: number | null;
  REGION_POPULATION_RELATIVE: number | null;
  facebookHandle: string | null;

  // Personal Property
  FLAG_OWN_REALTY: "Y" | "N" | null;
  NAME_HOUSING_TYPE: string | null;
  FLAG_OWN_CAR: "Y" | "N" | null;
  OWN_CAR_AGE: number | null;

  // Loan Information
  NAME_CONTRACT_TYPE: "Cash loans" | "Revolving loans" | null;
  AMT_CREDIT: number | null;
  hasPurchase: 'yes' | 'no' | null;
  AMT_GOODS_PRICE: number | null;
  AMT_ANNUITY: number | null;
  WEEKDAY_APPR_PROCESS_START: string | null;
  HOUR_APPR_PROCESS_START: number | null;

  // Professional Profile
  NAME_EDUCATION_TYPE: string | null;
  NAME_INCOME_TYPE: string | null; 
  AMT_INCOME_TOTAL: number | null;
  incomeMonthly: number | null;
  OCCUPATION_TYPE: string | null;
  ORGANIZATION_TYPE: string | null;
  workProvince: string | null;
  workWard: string | null;
  REG_REGION_NOT_WORK_REGION: number | null;

  // Document Upload
  documents: File[];
}

// Initial form data
const initialFormData: FormData = {
  // Personal Information
  fullName: null,
  CODE_GENDER: null,
  NAME_FAMILY_STATUS: null,
  hasChildren: null,
  CNT_CHILDREN: null,
  DAYS_BIRTH: null,
  phoneNumber: null,
  FLAG_MOBIL: null,
  email: null,
  FLAG_EMAIL: null,
  province: null,
  ward: null,
  REGION_RATING_CLIENT: null,
  REGION_RATING_CLIENT_W_CITY: null,
  REGION_POPULATION_RELATIVE: null,
  facebookHandle: null,

  // Personal Property
  FLAG_OWN_REALTY: null,
  NAME_HOUSING_TYPE: null,
  FLAG_OWN_CAR: null,
  OWN_CAR_AGE: null,

  // Loan Information
  NAME_CONTRACT_TYPE: null,
  AMT_CREDIT: null,
  hasPurchase: null,
  AMT_GOODS_PRICE: null,
  AMT_ANNUITY: null,
  WEEKDAY_APPR_PROCESS_START: null,
  HOUR_APPR_PROCESS_START: null,

  // Professional Profile
  NAME_EDUCATION_TYPE: null,
  NAME_INCOME_TYPE: null,
  AMT_INCOME_TOTAL: null,
  incomeMonthly: null,
  OCCUPATION_TYPE: null,
  ORGANIZATION_TYPE: null,
  workProvince: null,
  workWard: null,
  REG_REGION_NOT_WORK_REGION: null,

  // Document Upload
  documents: [],
};

// Context type
interface FormContextType {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  resetForm: () => void;
  submitForm: () => Promise<void>;
  isSubmitting: boolean;
  submitError: string | null;
  submitSuccess: boolean;
}

// Create context
const FormContext = createContext<FormContextType | undefined>(undefined);

// Provider component
export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const auth = useAuth();

  // Function to calculate monthly annuity payment
  const calculateAnnuity = (loanAmount: number, annualRate: number = 0.18, termYears: number = 5): number => {
    // Calculate monthly rate and number of payments
    const monthlyRate = annualRate / 12;
    const numPayments = termYears * 12;

    if (monthlyRate === 0) {
      // Handle the edge case of a 0% interest loan
      return numPayments > 0 ? loanAmount / numPayments : 0;
    }

    // Apply the standard annuity formula
    const annuity = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);

    // Return rounded result
    return Math.round(annuity * 100) / 100; // Round to 2 decimal places
  };

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => {
      const newData = { ...prev, ...updates };
      
      // Automatically set FLAG_MOBIL based on phoneNumber
      if ('phoneNumber' in updates) {
        newData.FLAG_MOBIL = (updates.phoneNumber && updates.phoneNumber.trim() !== '') ? 1 : 0;
      }

      if ('incomeMonthly' in updates && updates.incomeMonthly !== undefined && updates.incomeMonthly !== null) {
        newData.AMT_INCOME_TOTAL = updates.incomeMonthly * 12;
      }
      
      // Automatically set FLAG_EMAIL based on email
      if ('email' in updates) {
        newData.FLAG_EMAIL = (updates.email && updates.email.trim() !== '') ? 1 : 0;
      }
      
      // Automatically calculate AMT_ANNUITY based on AMT_CREDIT
      if ('AMT_CREDIT' in updates && updates.AMT_CREDIT !== undefined && updates.AMT_CREDIT !== null && updates.AMT_CREDIT > 0) {
        newData.AMT_ANNUITY = calculateAnnuity(updates.AMT_CREDIT);
      }
      
      // Automatically set REG_REGION_NOT_WORK_REGION based on province vs workProvince mismatch
      if ('province' in updates || 'workProvince' in updates) {
        const homeProvince = 'province' in updates ? updates.province : newData.province;
        const workProvince = 'workProvince' in updates ? updates.workProvince : newData.workProvince;
        
        // Set to 1 if regions don't match, 0 if they match, null if either is missing
        if (homeProvince && workProvince) {
          newData.REG_REGION_NOT_WORK_REGION = (homeProvince !== workProvince) ? 1 : 0;
        } else {
          newData.REG_REGION_NOT_WORK_REGION = null;
        }
      }
      
      return newData;
    });
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Check if user is authenticated
      if (!auth.user?.id_token) {
        throw new Error('User not authenticated');
      }

      // Auto-fill submission date/time fields
      const now = new Date();
      const weekdays = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
      const weekdayName = weekdays[now.getDay()];
      const currentHour = now.getHours();
      
      // Update form data with auto-filled submission time fields
      const finalFormData = {
        ...formData,
        WEEKDAY_APPR_PROCESS_START: weekdayName,
        HOUR_APPR_PROCESS_START: currentHour
      };

      // Filter only fully capitalized fields (excluding documents)
      const filteredFormData: Record<string, any> = {};
      Object.entries(finalFormData).forEach(([key, value]) => {
        if (key === key.toUpperCase() && key !== 'DOCUMENTS' && value !== null && value !== undefined) {
          filteredFormData[key] = value;
        }
      });

      console.log('📋 Submitting filtered form data:', filteredFormData);

      // Make API call to backend
      const response = await fetch('https://uufa8ybm3a.execute-api.ap-southeast-1.amazonaws.com/Stage0/getScore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.user.id_token}`
        },
        body: JSON.stringify({
          form_data: filteredFormData
        })
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('📊 API Response:', result);

      // Parse the response body if it's a string
      let scoreData;
      if (typeof result.body === 'string') {
        scoreData = JSON.parse(result.body);
      } else {
        scoreData = result.body || result;
      }

      // Store the score result for access by other components
      localStorage.setItem('creditScoreResult', JSON.stringify(scoreData));
      
      setSubmitSuccess(true);
      
    } catch (error) {
      console.error('❌ Form submission error:', error);
      setSubmitError(error instanceof Error ? error.message : 'An error occurred during submission');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContext.Provider value={{ formData, updateFormData, resetForm, submitForm, isSubmitting, submitError, submitSuccess }}>
      {children}
    </FormContext.Provider>
  );
};

// Custom hook to use the form context
export const useForm = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
}; 