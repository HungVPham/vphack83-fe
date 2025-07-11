import { useState } from "react";
import { Label } from "../ui/label";
import { Select } from "../ui/select";
import { RadioGroup } from "../ui/radio";
import { NumberInput } from "../ui/number-input";
import { useLanguage } from "../../lib/LanguageContext";

export function PersonalPropertyStep() {
  const { t } = useLanguage();
  const [ownsRealty, setOwnsRealty] = useState<string>("no");
  const [housingType, setHousingType] = useState<string>("");
  const [ownsVehicle, setOwnsVehicle] = useState<string>("no");
  const [vehicleAge, setVehicleAge] = useState<number>(1);

  // Realty ownership options
  const realtyOptions = [
    { value: "no", label: t("personalProperty.ownsRealty.no") },
    { value: "yes", label: t("personalProperty.ownsRealty.yes") },
  ];

  // Vehicle ownership options
  const vehicleOptions = [
    { value: "no", label: t("personalProperty.ownsVehicle.no") },
    { value: "yes", label: t("personalProperty.ownsVehicle.yes") },
  ];

  // Housing type options
  const housingTypeOptions = [
    { value: "house_apartment", label: t("housing.houseApartment") },
    { value: "rented_apartment", label: t("housing.rentedApartment") },
    { value: "with_parents", label: t("housing.withParents") },
    { value: "municipal_apartment", label: t("housing.municipalApartment") },
    { value: "office_apartment", label: t("housing.officeApartment") },
    { value: "coop_apartment", label: t("housing.coopApartment") },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">{t("personalProperty.title")}</h3>
        <div className="space-y-4">
          <div className="text-left">
            <Label className="text-sm font-medium text-gray-700">
              {t("personalProperty.ownsRealty")}
            </Label>
            <RadioGroup
              options={realtyOptions}
              value={ownsRealty}
              onChange={setOwnsRealty}
              name="ownsRealty"
              direction="horizontal"
              className="mt-2"
            />
          </div>

          <div className="text-left">
            <Label htmlFor="housingType" className="text-sm font-medium text-gray-700">
              {t("personalProperty.housingType")}
            </Label>
            <Select
              id="housingType"
              options={housingTypeOptions}
              value={housingType}
              onChange={setHousingType}
              placeholder={t("personalProperty.housingType.placeholder")}
              className="mt-1"
            />
          </div>

          <div className="text-left">
            <Label className="text-sm font-medium text-gray-700">
              {t("personalProperty.ownsVehicle")}
            </Label>
            <RadioGroup
              options={vehicleOptions}
              value={ownsVehicle}
              onChange={setOwnsVehicle}
              name="ownsVehicle"
              direction="horizontal"
              className="mt-2"
            />
          </div>

          {ownsVehicle === "yes" && (
            <div className="text-left">
              <Label htmlFor="vehicleAge" className="text-sm font-medium text-gray-700">
                {t("personalProperty.vehicleAge")}
              </Label>
              <NumberInput
                id="vehicleAge"
                value={vehicleAge}
                onChange={setVehicleAge}
                min={1}
                max={100}
                className="mt-1 w-32"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
