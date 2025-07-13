import { useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Select, SelectOption } from "../ui/select";
import { useLanguage } from "../../lib/LanguageContext";
import { useForm } from "../../lib/FormContext";

// Mock API delay function for realistic behavior
const mockApiDelay = (ms: number = 100) =>
  new Promise((resolve) => setTimeout(resolve, ms));

interface Ward {
  name: string;
  mergedFrom: string[];
}

interface Province {
  province: string;
  id: string;
  wards: Ward[];
}

interface ProvincesResponse {
  success: boolean;
  data: Province[];
}

// Employment type options with Vietnamese localization
const getEmploymentOptions = (t: (key: string) => string): SelectOption[] => [
  { value: "Working", label: t("employment.working") },
  { value: "State servant", label: t("employment.stateServant") },
  { value: "Commercial associate", label: t("employment.commercialAssociate") },
  { value: "Pensioner", label: t("employment.pensioner") },
  { value: "Unemployed", label: t("employment.unemployed") },
  { value: "Student", label: t("employment.student") },
  { value: "Businessman", label: t("employment.businessman") },
  { value: "Maternity leave", label: t("employment.maternityLeave") },
];

// Occupation type options
const getOccupationOptions = (t: (key: string) => string): SelectOption[] => [
  { value: "Accountants", label: t("occupation.accountants") },
  { value: "Cleaning staff", label: t("occupation.cleaningStaff") },
  { value: "Cooking staff", label: t("occupation.cookingStaff") },
  { value: "Core staff", label: t("occupation.coreStaff") },
  { value: "Drivers", label: t("occupation.drivers") },
  { value: "HR staff", label: t("occupation.hrStaff") },
  { value: "High skill tech staff", label: t("occupation.highSkillTechStaff") },
  { value: "IT staff", label: t("occupation.itStaff") },
  { value: "Laborers", label: t("occupation.laborers") },
  { value: "Low-skill Laborers", label: t("occupation.lowSkillLaborers") },
  { value: "Managers", label: t("occupation.managers") },
  { value: "Medicine staff", label: t("occupation.medicineStaff") },
  { value: "Private service staff", label: t("occupation.privateServiceStaff") },
  { value: "Realty agents", label: t("occupation.realtyAgents") },
  { value: "Sales staff", label: t("occupation.salesStaff") },
  { value: "Secretaries", label: t("occupation.secretaries") },
  { value: "Security staff", label: t("occupation.securityStaff") },
  { value: "Waiters/barmen staff", label: t("occupation.waitersBarmenStaff") },
];

// Organization type options
const getOrganizationOptions = (t: (key: string) => string): SelectOption[] => [
  { value: "Self-employed", label: t("organization.selfEmployed") },
  { value: "Advertising", label: t("organization.advertising") },
  { value: "Agriculture", label: t("organization.agriculture") },
  { value: "Bank", label: t("organization.bank") },
  { value: "Business Entity Type 1", label: t("organization.businessEntityType1") },
  { value: "Business Entity Type 2", label: t("organization.businessEntityType2") },
  { value: "Business Entity Type 3", label: t("organization.businessEntityType3") },
  { value: "Cleaning", label: t("organization.cleaning") },
  { value: "Construction", label: t("organization.construction") },
  { value: "Electricity", label: t("organization.electricity") },
  { value: "Emergency", label: t("organization.emergency") },
  { value: "Government", label: t("organization.government") },
  { value: "Hotel", label: t("organization.hotel") },
  { value: "Housing", label: t("organization.housing") },
  { value: "Insurance", label: t("organization.insurance") },
  { value: "Kindergarten", label: t("organization.kindergarten") },
  { value: "Legal Services", label: t("organization.legalServices") },
  { value: "Medicine", label: t("organization.medicine") },
  { value: "Military", label: t("organization.military") },
  { value: "Mobile", label: t("organization.mobile") },
  { value: "Police", label: t("organization.police") },
  { value: "Postal", label: t("organization.postal") },
  { value: "Realtor", label: t("organization.realtor") },
  { value: "Religion", label: t("organization.religion") },
  { value: "Restaurant", label: t("organization.restaurant") },
  { value: "School", label: t("organization.school") },
  { value: "University", label: t("organization.university") },
  { value: "Security", label: t("organization.security") },
  { value: "Security Ministries", label: t("organization.securityMinistries") },
  { value: "Services", label: t("organization.services") },
  { value: "Telecom", label: t("organization.telecom") },
  { value: "Industry: type 1", label: t("organization.industryType1") },
  { value: "Industry: type 2", label: t("organization.industryType2") },
  { value: "Industry: type 3", label: t("organization.industryType3") },
  { value: "Industry: type 4", label: t("organization.industryType4") },
  { value: "Industry: type 5", label: t("organization.industryType5") },
  { value: "Industry: type 6", label: t("organization.industryType6") },
  { value: "Industry: type 7", label: t("organization.industryType7") },
  { value: "Industry: type 8", label: t("organization.industryType8") },
  { value: "Industry: type 9", label: t("organization.industryType9") },
  { value: "Industry: type 10", label: t("organization.industryType10") },
  { value: "Industry: type 11", label: t("organization.industryType11") },
  { value: "Industry: type 12", label: t("organization.industryType12") },
  { value: "Industry: type 13", label: t("organization.industryType13") },
  { value: "Trade: type 1", label: t("organization.tradeType1") },
  { value: "Trade: type 2", label: t("organization.tradeType2") },
  { value: "Trade: type 3", label: t("organization.tradeType3") },
  { value: "Trade: type 4", label: t("organization.tradeType4") },
  { value: "Trade: type 5", label: t("organization.tradeType5") },
  { value: "Trade: type 6", label: t("organization.tradeType6") },
  { value: "Trade: type 7", label: t("organization.tradeType7") },
  { value: "Transport: type 1", label: t("organization.transportType1") },
  { value: "Transport: type 2", label: t("organization.transportType2") },
  { value: "Transport: type 3", label: t("organization.transportType3") },
  { value: "Transport: type 4", label: t("organization.transportType4") },
  { value: "XNA", label: t("organization.xna") },
];

// Education options
const getEducationOptions = (t: (key: string) => string): SelectOption[] => [
  { value: "Academic degree", label: t("education.academicDegree") },
  { value: "Higher education", label: t("education.higherEducation") },
  { value: "Incomplete higher", label: t("education.incompleteHigher") },
  { value: "Lower secondary", label: t("education.lowerSecondary") },
  { value: "Secondary / secondary special", label: t("education.secondarySpecial") },
];

export function ProfessionalProfileStep() {
  const { t } = useLanguage();
  const { formData, updateFormData } = useForm();
  const [workProvinces, setWorkProvinces] = useState<Province[]>([]);
  const [workWards, setWorkWards] = useState<Ward[]>([]);
  const [isLoadingWorkWards, setIsLoadingWorkWards] = useState(false);
  const [isLoadingWorkProvinces, setIsLoadingWorkProvinces] = useState(false);

  // Get translated options
  const employmentOptions = getEmploymentOptions(t);
  const occupationOptions = getOccupationOptions(t);
  const organizationOptions = getOrganizationOptions(t);
  const educationOptions = getEducationOptions(t);

  // Load provinces from local JSON file
  useEffect(() => {
    const loadProvinces = async () => {
      setIsLoadingWorkProvinces(true);
      try {
        // Add a small delay to simulate API call
        await mockApiDelay(200);

        const response = await fetch("/provinces.json");
        const data: ProvincesResponse = await response.json();

        if (data.success && Array.isArray(data.data)) {
          setWorkProvinces(data.data);
        }
      } catch (error) {
        console.error("Error loading provinces:", error);
      } finally {
        setIsLoadingWorkProvinces(false);
      }
    };

    loadProvinces();
  }, []);

  const handleWorkProvinceChange = async (provinceValue: string) => {
    updateFormData({ workProvince: provinceValue, workWard: "" }); // Reset ward selection
    setWorkWards([]); // Clear wards

    if (provinceValue && Array.isArray(workProvinces)) {
      setIsLoadingWorkWards(true);
      try {
        // Add a small delay to simulate API call
        await mockApiDelay(100);

        // Find the selected province object
        const selectedProvinceObj = workProvinces.find(
          (p) => p && (p.id === provinceValue || p.province === provinceValue)
        );

        // Use the wards data that's already available in the province object
        if (selectedProvinceObj && selectedProvinceObj.wards) {
          setWorkWards(selectedProvinceObj.wards);
        }
      } catch (error) {
        console.error("Error loading wards:", error);
      } finally {
        setIsLoadingWorkWards(false);
      }
    }
  };

  // Convert provinces to Select options
  const workProvinceOptions = Array.isArray(workProvinces)
    ? workProvinces
        .filter((province) => province && (province.province || province.id))
        .map((province, index) => ({
          value: province.id || province.province || `province-${index}`,
          label: province.province || `Province ${index + 1}`,
        }))
    : [];

  // Convert wards to Select options
  const workWardOptions = Array.isArray(workWards)
    ? workWards
        .filter((ward) => ward && ward.name)
        .map((ward, index) => ({
          value: ward.name || `ward-${index}`,
          label: ward.name || `Ward ${index + 1}`,
        }))
    : [];

  // Format number to Vietnamese currency format
  const formatCurrency = (value: string) => {
    if (!value) return "";
    const number = value.replace(/\D/g, "");
    if (!number) return "";
    return new Intl.NumberFormat("vi-VN").format(parseInt(number));
  };

  const handleAmountChange = (
    value: string,
    setter: (value: string) => void
  ) => {
    if (!value) {
      setter("");
      return;
    }
    const numericValue = value.replace(/\D/g, "");
    setter(numericValue);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          {t("professionalProfile.title")}
        </h3>
        <div className="space-y-4">
          <div className="text-left">
            <Label
              htmlFor="educationType"
              className="text-sm font-medium text-gray-700"
            >
              {t("professionalProfile.educationLevel")}
            </Label>
            <Select
              id="educationType"
              options={educationOptions}
              value={formData.NAME_EDUCATION_TYPE || ""}
              placeholder={t("professionalProfile.educationLevel.placeholder")}
              onChange={(value) => {
                updateFormData({ NAME_EDUCATION_TYPE: value });
              }}
              className="mt-1"
            />
          </div>
          <div className="text-left">
            <Label
              htmlFor="employmentType"
              className="text-sm font-medium text-gray-700"
            >
              {t("professionalProfile.employmentStatus")}
            </Label>
            <Select
              id="employmentType"
              options={employmentOptions}
              value={formData.NAME_INCOME_TYPE || ""}
              placeholder={t("professionalProfile.employmentStatus.placeholder")}
              onChange={(value) => {
                updateFormData({ NAME_INCOME_TYPE: value });
              }}
              className="mt-1"
            />
          </div>

          <div className="text-left">
            <Label
              htmlFor="monthlyIncome"
              className="text-sm font-medium text-gray-700"
            >
              {t("professionalProfile.monthlyIncome")}
            </Label>
            <div className="relative mt-1">
              <input
                id="monthlyIncome"
                type="text"
                value={formatCurrency(formData.incomeMonthly?.toString() || "")}
                onChange={(e) =>
                  handleAmountChange(e.target.value, (value) => updateFormData({ incomeMonthly: parseInt(value) }))
                }
                placeholder="0"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-12"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                VND
              </div>
            </div>
          </div>

          <div className="text-left">
            <Label
              htmlFor="occupationType"
              className="text-sm font-medium text-gray-700"
            >
              {t("professionalProfile.occupationType")}
            </Label>
            <Select
              id="occupationType"
              options={occupationOptions}
              value={formData.OCCUPATION_TYPE || ""}
              placeholder={t("professionalProfile.occupationType.placeholder")}
              onChange={(value) => {
                updateFormData({ OCCUPATION_TYPE: value });
              }}
              className="mt-1"
            />
          </div>

          <div className="text-left">
            <Label
              htmlFor="organizationType"
              className="text-sm font-medium text-gray-700"
            >
              {t("professionalProfile.organizationType")}
            </Label>
            <Select
              id="organizationType"
              options={organizationOptions}
              value={formData.ORGANIZATION_TYPE || ""}
              placeholder={t("professionalProfile.organizationType.placeholder")}
              onChange={(value) => {
                updateFormData({ ORGANIZATION_TYPE: value });
              }}
              className="mt-1"
            />
          </div>

          <div className="text-left">
            <Label
              htmlFor="workProvince"
              className="text-sm font-medium text-gray-700"
            >
              {t("professionalProfile.workProvince")}
            </Label>
            <Select
              id="workProvince"
              options={workProvinceOptions}
              value={formData.workProvince || ""}
              onChange={handleWorkProvinceChange}
              placeholder={
                isLoadingWorkProvinces ? t("common.loading") : t("professionalProfile.workProvince.placeholder")
              }
              searchable={!isLoadingWorkProvinces}
              searchPlaceholder={t("common.searchPlaceholder")}
              disabled={isLoadingWorkProvinces}
              className="mt-1"
            />
          </div>

          <div className="text-left">
            <Label htmlFor="workWard" className="text-sm font-medium text-gray-700">
              {t("professionalProfile.workWard")}
            </Label>
            <Select
              id="workWard"
              options={workWardOptions}
              value={formData.workWard || ""}
              onChange={(value) => updateFormData({ workWard: value })}
              placeholder={
                isLoadingWorkWards
                  ? t("common.loading")
                  : !formData.workProvince
                  ? t("professionalProfile.workWard.placeholderNoProvince")
                  : t("professionalProfile.workWard.placeholder")
              }
              searchable={!!formData.workProvince && !isLoadingWorkWards}
              searchPlaceholder={t("common.searchPlaceholder")}
              disabled={!formData.workProvince || isLoadingWorkWards}
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
