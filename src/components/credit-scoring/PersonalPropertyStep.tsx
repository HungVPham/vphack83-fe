import { Label } from "../ui/label";
import { Select } from "../ui/select";
import { RadioGroup } from "../ui/radio";
import { NumberInput } from "../ui/number-input";
import { useLanguage } from "../../lib/LanguageContext";
import { useForm } from "../../lib/FormContext";

export function PersonalPropertyStep() {
  const { t } = useLanguage();
  const { formData, updateFormData } = useForm();

  // Realty ownership options
  const realtyOptions = [
    { value: "N", label: t("personalProperty.ownsRealty.no") },
    { value: "Y", label: t("personalProperty.ownsRealty.yes") },
  ];

  // Vehicle ownership options
  const vehicleOptions = [
    { value: "N", label: t("personalProperty.ownsVehicle.no") },
    { value: "Y", label: t("personalProperty.ownsVehicle.yes") },
  ];

  // Housing type options
  const housingTypeOptions = [
    { value: "House / apartment", label: t("housing.houseApartment") },
    { value: "Rented apartment", label: t("housing.rentedApartment") },
    { value: "With parents", label: t("housing.withParents") },
    { value: "Municipal apartment", label: t("housing.municipalApartment") },
    { value: "Office apartment", label: t("housing.officeApartment") },
    { value: "Co-op apartment", label: t("housing.coopApartment") },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">{t("personalProperty.title")}</h3>
        <div className="space-y-4">
          {/* Row 1: Owns Realty and Owns Vehicle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-left">
              <Label className="text-sm font-medium text-gray-700">
                {t("personalProperty.ownsRealty")}
              </Label>
              <RadioGroup
                options={realtyOptions}
                value={formData.FLAG_OWN_REALTY || ""}
                onChange={(value) => updateFormData({ FLAG_OWN_REALTY: value as "Y" | "N" })}
                name="ownsRealty"
                direction="horizontal"
                className="mt-2"
              />
            </div>

            <div className="text-left">
              <Label className="text-sm font-medium text-gray-700">
                {t("personalProperty.ownsVehicle")}
              </Label>
              <RadioGroup
                options={vehicleOptions}
                value={formData.FLAG_OWN_CAR || ""}
                onChange={(value) => updateFormData({ FLAG_OWN_CAR: value as "Y" | "N" })}
                name="ownsVehicle"
                direction="horizontal"
                className="mt-2"
              />
            </div>
          </div>

          {/* Row 2: Housing Type and Vehicle Age */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-left">
              <Label htmlFor="housingType" className="text-sm font-medium text-gray-700">
                {t("personalProperty.housingType")}
              </Label>
              <Select
                id="housingType"
                options={housingTypeOptions}
                value={formData.NAME_HOUSING_TYPE || ""}
                onChange={(value) => updateFormData({ NAME_HOUSING_TYPE: value })}
                placeholder={t("personalProperty.housingType.placeholder")}
                className="mt-1"
              />
            </div>

            {formData.FLAG_OWN_CAR === "Y" && (
              <div className="text-left">
                <Label htmlFor="vehicleAge" className="text-sm font-medium text-gray-700">
                  {t("personalProperty.vehicleAge")}
                </Label>
                <NumberInput
                  id="vehicleAge"
                  value={formData.OWN_CAR_AGE || 0}
                  onChange={(value) => updateFormData({ OWN_CAR_AGE: value })}
                  min={1}
                  max={100}
                  className="mt-1 w-32"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
