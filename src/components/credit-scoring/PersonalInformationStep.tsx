import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select } from "../ui/select";
import { RadioGroup } from "../ui/radio";
import { NumberInput } from "../ui/number-input";
import { Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi } from "date-fns/locale";
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
  population: number;
  population_normalized: number;
  region_rating: number;
  region_rating_w_city: number;
}

interface ProvincesResponse {
  success: boolean;
  data: Province[];
}

export function PersonalInformationStep() {
  const { t } = useLanguage();
  const { formData, updateFormData } = useForm();
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [isLoadingWards, setIsLoadingWards] = useState(false);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);

  // Load provinces from local JSON file
  useEffect(() => {
    const loadProvinces = async () => {
      setIsLoadingProvinces(true);
      try {
        // Add a small delay to simulate API call
        await mockApiDelay(200);

        const response = await fetch("/provinces.json");
        const data: ProvincesResponse = await response.json();

        if (data.success && Array.isArray(data.data)) {
          setProvinces(data.data);
        }
      } catch (error) {
        console.error("Error loading provinces:", error);
      } finally {
        setIsLoadingProvinces(false);
      }
    };

    loadProvinces();
  }, []);

  const handleProvinceChange = async (provinceValue: string) => {
    updateFormData({ province: provinceValue, ward: "" }); // Reset ward selection
    setWards([]); // Clear wards

    if (provinceValue && Array.isArray(provinces)) {
      setIsLoadingWards(true);
      try {
        // Add a small delay to simulate API call
        await mockApiDelay(100);

        // Find the selected province object
        const selectedProvinceObj = provinces.find(
          (p) => p && (p.id === provinceValue || p.province === provinceValue)
        );

        // Use the wards data that's already available in the province object
        if (selectedProvinceObj && selectedProvinceObj.wards) {
          setWards(selectedProvinceObj.wards);
          
          // Set region rating fields based on selected province
          updateFormData({
            province: provinceValue,
            ward: "",
            REGION_POPULATION_RELATIVE: selectedProvinceObj.population_normalized,
            REGION_RATING_CLIENT: selectedProvinceObj.region_rating,
            REGION_RATING_CLIENT_W_CITY: selectedProvinceObj.region_rating_w_city
          });
        }
      } catch (error) {
        console.error("Error loading wards:", error);
      } finally {
        setIsLoadingWards(false);
      }
    }
  };

  // Convert provinces to Select options
  const provinceOptions = Array.isArray(provinces)
    ? provinces
        .filter((province) => province && (province.province || province.id))
        .map((province, index) => ({
          value: province.id || province.province || `province-${index}`,
          label: province.province || `Province ${index + 1}`,
        }))
    : [];

  // Convert wards to Select options
  const wardOptions = Array.isArray(wards)
    ? wards
        .filter((ward) => ward && ward.name)
        .map((ward, index) => ({
          value: ward.name || `ward-${index}`,
          label: ward.name || `Ward ${index + 1}`,
        }))
    : [];

  // Gender options
  const genderOptions = [
    { value: "M", label: t("personalInfo.gender.male") },
    { value: "F", label: t("personalInfo.gender.female") },
  ];

  // Children options
  const hasChildrenOptions = [
    { value: "no", label: t("personalInfo.hasChildren.no") },
    { value: "yes", label: t("personalInfo.hasChildren.yes") },
  ];

  // Family status options
  const familyStatusOptions = [
    { value: "Single / not married", label: t("personalInfo.familyStatus.single") },
    { value: "Married", label: t("personalInfo.familyStatus.married") },
    { value: "Civil marriage", label: t("personalInfo.familyStatus.civilMarriage") },
    { value: "Separated", label: t("personalInfo.familyStatus.separated") },
    { value: "Widow", label: t("personalInfo.familyStatus.widow") },
    { value: "Unknown", label: t("personalInfo.familyStatus.unknown") },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          {t("personalInfo.title")}
        </h3>
        <div className="space-y-4">
          {/* Row 1: Full Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-left">
              <Label
                htmlFor="fullName"
                className="text-sm font-medium text-gray-700"
              >
                {t("personalInfo.fullName")}
              </Label>
              <Input
                id="fullName"
                value={formData.fullName || ""}
                onChange={(e) => updateFormData({ fullName: e.target.value })}
                placeholder={t("personalInfo.fullName.placeholder")}
                className="mt-1"
              />
            </div>

            <div className="text-left">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                {t("personalInfo.email")}
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => updateFormData({ email: e.target.value })}
                placeholder={t("personalInfo.email.placeholder")}
                className="mt-1"
              />
            </div>
          </div>

          {/* Row 2: Gender and Date of Birth */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-left">
              <Label className="text-sm font-medium text-gray-700">
                {t("personalInfo.gender")}
              </Label>
              <RadioGroup
                options={genderOptions}
                value={formData.CODE_GENDER || ""}
                onChange={(value) => updateFormData({ CODE_GENDER: value })}
                name="gender"
                direction="horizontal"
                className="mt-2"
              />
            </div>

            <div className="text-left">
              <Label htmlFor="dob" className="text-sm font-medium text-gray-700">
                {t("personalInfo.dateOfBirth")}
              </Label>
              <div className="relative mt-1">
                <DatePicker
                  id="dob"
                  selected={(() => {
                    if (!formData.DAYS_BIRTH) return null;
                    // Calculate date by adding days to today (simple date arithmetic)
                    const today = new Date();
                    const calculatedDate = new Date(today);
                    calculatedDate.setDate(today.getDate() + formData.DAYS_BIRTH);
                  
                    return calculatedDate;
                  })()}
                  onChange={(date) => {                 
                    if (date) {
                      // Calculate days difference using simple date arithmetic
                      const today = new Date();
                      
                      // Reset time to midnight for both dates to avoid time-of-day issues
                      const selectedDateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                      const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                      
                      const timeDiff = selectedDateOnly.getTime() - todayOnly.getTime();
                      const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                  
                      updateFormData({ DAYS_BIRTH: daysDiff });
                    } else {
                      updateFormData({ DAYS_BIRTH: null });
                    }
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="DD/MM/YYYY"
                  maxDate={new Date()}
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                  locale={vi}
                  popperPlacement="bottom-end"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pr-10"
                  wrapperClassName="w-full"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Row 3: Family Status and Has Children with Number of Children */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-left">
              <Label
                htmlFor="familyStatus"
                className="text-sm font-medium text-gray-700"
              >
                {t("personalInfo.familyStatus")}
              </Label>
              <Select
                id="familyStatus"
                options={familyStatusOptions}
                value={formData.NAME_FAMILY_STATUS || ""}
                onChange={(value) => updateFormData({ NAME_FAMILY_STATUS: value })}
                placeholder={t("personalInfo.familyStatus.placeholder")}
                className="mt-1"
              />
            </div>

            <div className="text-left">
              <Label className="text-sm font-medium text-gray-700">
                {t("personalInfo.hasChildren")}
              </Label>
              <div className="flex items-center space-x-4 mt-2">
                <RadioGroup
                  options={hasChildrenOptions}
                  value={formData.hasChildren || ""}
                  onChange={(value) => {
                    updateFormData({ hasChildren: value });
                    // Reset number of children when "no" is selected
                    if (value === "no") {
                      updateFormData({ CNT_CHILDREN: 0 });
                    }
                  }}
                  name="hasChildren"
                  direction="horizontal"
                  className="flex-1"
                />
                {formData.hasChildren === "yes" && (
                <div className="flex items-center space-x-2">
                  <Label
                    htmlFor="numberOfChildren"
                    className={`text-sm font-medium`}
                  >
                    {t("personalInfo.numberOfChildren")}:
                  </Label>
                  <NumberInput
                    id="numberOfChildren"
                    value={formData.CNT_CHILDREN || 0}
                    onChange={(value) => updateFormData({ CNT_CHILDREN: value })}
                    min={1}
                    max={10}
                    disabled={formData.hasChildren !== "yes"}
                    className={`w-20 ${
                      formData.hasChildren !== "yes" ? "opacity-50" : ""
                    }`}
                  />
                </div>
                )}
              </div>
            </div>
          </div>

          {/* Row 4: Province and Ward */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-left">
              <Label
                htmlFor="province"
                className="text-sm font-medium text-gray-700"
              >
                {t("personalInfo.province")}
              </Label>
              <Select
                id="province"
                options={provinceOptions}
                value={formData.province || ""}
                onChange={handleProvinceChange}
                placeholder={
                  isLoadingProvinces ? t("personalInfo.province.loading") : t("personalInfo.province.placeholder")
                }
                searchable={!isLoadingProvinces}
                searchPlaceholder={t("personalInfo.province.searchPlaceholder")}
                disabled={isLoadingProvinces}
                className="mt-1"
              />
            </div>

            <div className="text-left">
              <Label htmlFor="ward" className="text-sm font-medium text-gray-700">
                {t("personalInfo.ward")}
              </Label>
              <Select
                id="ward"
                options={wardOptions}
                value={formData.ward || ""}
                onChange={(value) => updateFormData({ ward: value })}
                placeholder={
                  isLoadingWards
                    ? t("personalInfo.ward.loading")
                    : !formData.province
                    ? t("personalInfo.ward.placeholderNoProvince")
                    : t("personalInfo.ward.placeholder")
                }
                searchable={!!formData.province && !isLoadingWards}
                searchPlaceholder={t("personalInfo.ward.searchPlaceholder")}
                disabled={!formData.province || isLoadingWards}
                className="mt-1"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
