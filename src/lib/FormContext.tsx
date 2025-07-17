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
  file_uploads: Array<{
    filename: string;
    s3_key: string;
    content_type: string;
  }>;
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
  file_uploads: [],
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

    // Clear any previous results from localStorage to ensure fresh loading state
    localStorage.removeItem('creditScoreResult');

    try {
      // Check if user is authenticated
      if (!auth.user?.id_token) {
        throw new Error('User not authenticated');
      }

      const finalFormData = {
        ...formData
      };

      // Filter only fully capitalized fields (excluding documents and file_uploads)
      const filteredFormData: Record<string, any> = {};
      Object.entries(finalFormData).forEach(([key, value]) => {
        if (key === key.toUpperCase() && key !== 'DOCUMENTS' && key !== 'FILE_UPLOADS' && value !== null && value !== undefined) {
          filteredFormData[key] = value;
        }
      });
      
      // Prepare the request body with form_data and file_uploads at the same level
      const requestBody: any = {
        form_data: filteredFormData
      };
      
      // Add file_uploads at the same level as form_data if available
      if (finalFormData.file_uploads && finalFormData.file_uploads.length > 0) {
        requestBody.file_uploads = finalFormData.file_uploads;
      }

      console.log('📋 Submitting request body:', requestBody);

      // Make API call to backend
      const response = await fetch('https://uufa8ybm3a.execute-api.ap-southeast-1.amazonaws.com/Stage0/getScore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.user.id_token}`
        },
        body: JSON.stringify(requestBody)
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