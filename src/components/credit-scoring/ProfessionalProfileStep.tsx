import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectOption } from "../ui/select";

// Employment type options with Vietnamese localization
const employmentOptions: SelectOption[] = [
  { value: "working", label: "Đang làm việc" },
  { value: "state_servant", label: "Công chức nhà nước" },
  { value: "commercial_associate", label: "Cộng tác viên thương mại" },
  { value: "pensioner", label: "Nghỉ hưu" },
  { value: "unemployed", label: "Thất nghiệp" },
  { value: "student", label: "Sinh viên" },
  { value: "businessman", label: "Doanh nhân" },
  { value: "maternity_leave", label: "Nghỉ thai sản" },
];

interface ProfessionalProfileStepProps {
  userType: string;
  setUserType: (type: string) => void;
}

export function ProfessionalProfileStep({
  userType,
  setUserType,
}: ProfessionalProfileStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          Bạn làm nghề gì?
        </h3>

        <div className="space-y-4">
          <div className="text-left">
            <Label
              htmlFor="employmentType"
              className="text-sm font-medium text-gray-700"
            >
              Tình trạng việc làm
            </Label>
            <Select
              id="employmentType"
              options={employmentOptions}
              value={userType}
              placeholder="Chọn tình trạng việc làm của bạn"
              onChange={(value) => {
                setUserType(value);
              }}
              className="mt-1"
            />
          </div>

          <div className="space-y-4">
            <div className="text-left">
              <Label
                htmlFor="workDescription"
                className="text-sm font-medium text-gray-700"
              >
                Mô tả ngắn gọn về công việc hoặc dịch vụ của bạn
              </Label>
              <Textarea
                id="workDescription"
                placeholder="Ví dụ: Thiết kế đồ họa, viết content, phát triển web..."
                className="mt-1 min-h-[80px]"
              />
            </div>

            <div className="text-left">
              <Label
                htmlFor="businessPage"
                className="text-sm font-medium text-gray-700"
              >
                Link Facebook Business (tùy chọn)
              </Label>
              <Input
                id="businessPage"
                placeholder="https://facebook.com/your-business"
                className="mt-1"
              />
            </div>

            <div className="text-left">
              <Label
                htmlFor="businessWebsite"
                className="text-sm font-medium text-gray-700"
              >
                Link Website Công Ty (tùy chọn)
              </Label>
              <Input
                id="businessWebsite"
                placeholder="https://your-business.com"
                className="mt-1"
              />
            </div>

            <div className="text-left">
              <Label
                htmlFor="linkedinCompany"
                className="text-sm font-medium text-gray-700"
              >
                LinkedIn Công Ty (tùy chọn)
              </Label>
              <Input
                id="linkedinCompany"
                placeholder="@company-linkedin"
                className="mt-1"
              />
            </div>
          </div>
          <div className="space-y-4">
           

            <div className="text-left">
              <Label
                htmlFor="linkedinPersonal"
                className="text-sm font-medium text-gray-700"
              >
                LinkedIn Cá Nhân (tùy chọn)
              </Label>
              <Input
                id="linkedinPersonal"
                placeholder="@linkedin-personal"
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
