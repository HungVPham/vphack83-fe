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

export function PersonalInformationStep() {
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [isLoadingWards, setIsLoadingWards] = useState(false);
  const [isLoadingProvinces, setIsLoadingProvinces] = useState(false);
  const [selectedWard, setSelectedWard] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string>("M");
  const [hasChildren, setHasChildren] = useState<string>("no");
  const [numberOfChildren, setNumberOfChildren] = useState<number>(1);

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
    setSelectedProvince(provinceValue);
    setSelectedWard(""); // Reset ward selection
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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          {t("personalInfo.title")}
        </h3>
        <div className="space-y-4">
          <div className="text-left">
            <Label
              htmlFor="fullName"
              className="text-sm font-medium text-gray-700"
            >
              {t("personalInfo.fullName")}
            </Label>
            <Input
              id="fullName"
              placeholder={t("personalInfo.fullName.placeholder")}
              className="mt-1"
            />
          </div>

          <div className="text-left">
            <Label className="text-sm font-medium text-gray-700">
              {t("personalInfo.gender")}
            </Label>
            <RadioGroup
              options={genderOptions}
              value={selectedGender}
              onChange={setSelectedGender}
              name="gender"
              direction="horizontal"
              className="mt-2"
            />
          </div>

          <div className="text-left">
            <Label className="text-sm font-medium text-gray-700">
              {t("personalInfo.hasChildren")}
            </Label>
            <RadioGroup
              options={hasChildrenOptions}
              value={hasChildren}
              onChange={setHasChildren}
              name="hasChildren"
              direction="horizontal"
              className="mt-2"
            />
          </div>

          {hasChildren === "yes" && (
            <div className="text-left">
              <Label
                htmlFor="numberOfChildren"
                className="text-sm font-medium text-gray-700"
              >
                {t("personalInfo.numberOfChildren")}
              </Label>
              <NumberInput
                id="numberOfChildren"
                value={numberOfChildren}
                onChange={setNumberOfChildren}
                min={1}
                max={10}
                className="mt-1 w-32"
              />
            </div>
          )}

          <div className="text-left">
            <Label htmlFor="dob" className="text-sm font-medium text-gray-700">
              {t("personalInfo.dateOfBirth")}
            </Label>
            <div className="relative mt-1">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
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

          <div className="text-left">
            <Label
              htmlFor="phone"
              className="text-sm font-medium text-gray-700"
            >
              {t("personalInfo.phoneNumber")}
            </Label>
            <div className="relative mt-1">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <span className="text-sm">🇻🇳</span>
                <span className="text-sm text-gray-600">+84</span>
              </div>
              <Input
                id="phone"
                placeholder={t("personalInfo.phoneNumber.placeholder")}
                className="pl-16"
              />
            </div>
          </div>

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
              value={selectedProvince}
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
              value={selectedWard}
              onChange={setSelectedWard}
              placeholder={
                isLoadingWards
                  ? t("personalInfo.ward.loading")
                  : !selectedProvince
                  ? t("personalInfo.ward.placeholderNoProvince")
                  : t("personalInfo.ward.placeholder")
              }
              searchable={!!selectedProvince && !isLoadingWards}
              searchPlaceholder={t("personalInfo.ward.searchPlaceholder")}
              disabled={!selectedProvince || isLoadingWards}
              className="mt-1"
            />
          </div>

          <div className="text-left">
            <Label
              htmlFor="facebookHandle"
              className="text-sm font-medium text-gray-700"
            >
              {t("personalInfo.facebook")}
            </Label>
            <Input
              id="facebookHandle"
              placeholder={t("personalInfo.facebook.placeholder")}
              className="mt-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
