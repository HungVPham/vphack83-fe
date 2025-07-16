import React, { useState } from 'react';
import { Button } from '../ui/button';
import { ChevronDown, User } from 'lucide-react';
import { useForm } from '../../lib/FormContext';
import { useLanguage } from '../../lib/LanguageContext';

interface PersonaData {
  nameKey: string;
  data: {
    fullName: string;
    CODE_GENDER: string;
    NAME_FAMILY_STATUS: string;
    hasChildren: string;
    CNT_CHILDREN: number | null;
    DAYS_BIRTH: number;
    phoneNumber: string;
    FLAG_MOBIL: 0 | 1;
    email: string;
    FLAG_EMAIL: 0 | 1;
    province: string;
    ward: string;
    REGION_RATING_CLIENT: number;
    REGION_RATING_CLIENT_W_CITY: number;
    REGION_POPULATION_RELATIVE: number;
    facebookHandle: string | null;
    FLAG_OWN_REALTY: "Y" | "N";
    NAME_HOUSING_TYPE: string;
    FLAG_OWN_CAR: "Y" | "N";
    OWN_CAR_AGE: number | null;
    NAME_EDUCATION_TYPE: string;
    NAME_INCOME_TYPE: string;
    AMT_INCOME_TOTAL: number;
    incomeMonthly: number;
    OCCUPATION_TYPE: string;
    ORGANIZATION_TYPE: string;
    workProvince: string;
    workWard: string;
    REG_REGION_NOT_WORK_REGION: number;
    documents: File[];
    file_uploads: Array<{
      filename: string;
      s3_key: string;
      content_type: string;
    }>;
  };
}

const personas: PersonaData[] = [
  {
    nameKey: "formPrefill.persona.youngGenz",
    data: {
      fullName: "Nguyễn Thị Mai",
      CODE_GENDER: "F",
      NAME_FAMILY_STATUS: "Single / not married",
      hasChildren: "No",
      CNT_CHILDREN: 0,
      DAYS_BIRTH: -7300, // ~20 years old
      phoneNumber: "0987654321",
      FLAG_MOBIL: 1,
      email: "mai.nguyen@gmail.com",
      FLAG_EMAIL: 1,
      province: "Đồng Nai",
      ward: "Phường Biên Hòa",
      REGION_RATING_CLIENT: 1,
      REGION_RATING_CLIENT_W_CITY: 1,
      REGION_POPULATION_RELATIVE: 0.325355652,
      facebookHandle: null,
      FLAG_OWN_REALTY: "N",
      NAME_HOUSING_TYPE: "Rented apartment",
      FLAG_OWN_CAR: "N",
      OWN_CAR_AGE: null,
      NAME_EDUCATION_TYPE: "Higher education",
      NAME_INCOME_TYPE: "Student",
      AMT_INCOME_TOTAL: 24000000, // incomeMonthly * 12
      incomeMonthly: 2000000,
      OCCUPATION_TYPE: "Student",
      ORGANIZATION_TYPE: "School",
      workProvince: "Hồ Chí Minh",
      workWard: "Phường Vũng Tàu",
      REG_REGION_NOT_WORK_REGION: 1, // Different provinces
      documents: [],
      file_uploads: []
    }
  },
  {
    nameKey: "formPrefill.persona.middleAgedWorker",
    data: {
      fullName: "Trần Văn Minh",
      CODE_GENDER: "M",
      NAME_FAMILY_STATUS: "Separated",
      hasChildren: "Yes",
      CNT_CHILDREN: 2,
      DAYS_BIRTH: -16425, // ~45 years old
      phoneNumber: "0912345678",
      FLAG_MOBIL: 1,
      email: "minh.tran@yahoo.com",
      FLAG_EMAIL: 1,
      province: "Hồ Chí Minh",
      ward: "Phường Vũng Tàu",
      REGION_RATING_CLIENT: 1,
      REGION_RATING_CLIENT_W_CITY: 1,
      REGION_POPULATION_RELATIVE: 1.0,
      facebookHandle: null,
      FLAG_OWN_REALTY: "Y",
      NAME_HOUSING_TYPE: "House / apartment",
      FLAG_OWN_CAR: "N",
      OWN_CAR_AGE: null,
      NAME_EDUCATION_TYPE: "Secondary / secondary special",
      NAME_INCOME_TYPE: "Working",
      AMT_INCOME_TOTAL: 180000000, // incomeMonthly * 12
      incomeMonthly: 15000000,
      OCCUPATION_TYPE: "Laborers",
      ORGANIZATION_TYPE: "Business Entity Type 3",
      workProvince: "Hồ Chí Minh",
      workWard: "Phường Tam Thắng",
      REG_REGION_NOT_WORK_REGION: 0, // Same province
      documents: [],
      file_uploads: []
    }
  },
  {
    nameKey: "formPrefill.persona.retiredNurse",
    data: {
      fullName: "Lê Thị Hồng",
      CODE_GENDER: "F",
      NAME_FAMILY_STATUS: "Widow",
      hasChildren: "Yes",
      CNT_CHILDREN: 3,
      DAYS_BIRTH: -23725, // ~65 years old
      phoneNumber: "0903456789",
      FLAG_MOBIL: 1,
      email: "hong.le@gmail.com",
      FLAG_EMAIL: 1,
      province: "Đồng Nai",
      ward: "Phường Trấn Biên",
      REGION_RATING_CLIENT: 1,
      REGION_RATING_CLIENT_W_CITY: 1,
      REGION_POPULATION_RELATIVE: 0.325355652,
      facebookHandle: null,
      FLAG_OWN_REALTY: "N",
      NAME_HOUSING_TYPE: "Rented apartment",
      FLAG_OWN_CAR: "N",
      OWN_CAR_AGE: null,
      NAME_EDUCATION_TYPE: "Higher education",
      NAME_INCOME_TYPE: "Pensioner",
      AMT_INCOME_TOTAL: 96000000, // incomeMonthly * 12
      incomeMonthly: 8000000,
      OCCUPATION_TYPE: "Medicine staff",
      ORGANIZATION_TYPE: "Government",
      workProvince: "Đồng Nai",
      workWard: "Phường Trấn Biên",
      REG_REGION_NOT_WORK_REGION: 0, // Same province
      documents: [],
      file_uploads: []
    }
  }
];

export function FormPrefill() {
  const [isOpen, setIsOpen] = useState(false);
  const { updateFormData } = useForm();
  const { t } = useLanguage();

  const handlePersonaSelect = (persona: PersonaData) => {
    updateFormData(persona.data);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <User className="h-4 w-4" />
        {t("formPrefill.demoPersonas")}
        <ChevronDown className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 min-w-[200px]">
          <div className="p-2">
            <div className="text-sm font-medium text-gray-700 mb-2">{t("formPrefill.selectPersona")}:</div>
            {personas.map((persona, index) => (
              <button
                key={index}
                onClick={() => handlePersonaSelect(persona)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded-md block"
              >
                {t(persona.nameKey)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}