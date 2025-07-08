import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Calendar } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { vi } from "date-fns/locale";

// CSS to hide the datepicker arrow
const datePickerStyles = `
  .react-datepicker__triangle {
    display: none !important;
  }
`;

export function PersonalInformationStep() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div className="space-y-6">
      <style>{datePickerStyles}</style>
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">Hãy cho chúng tôi biết về bạn</h3>
        <div className="space-y-4">
          <div className="text-left">
            <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
              Họ và Tên
            </Label>
            <Input id="fullName" placeholder="Nhập họ và tên đầy đủ" className="mt-1" />
          </div>

          <div className="text-left">
            <Label htmlFor="dob" className="text-sm font-medium text-gray-700">
              Ngày sinh
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
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Số điện thoại
            </Label>
            <div className="relative mt-1">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                <div className="w-4 h-3 bg-red-500 rounded-sm"></div>
                <span className="text-sm text-gray-600">+84</span>
              </div>
              <Input id="phone" placeholder="Nhập số điện thoại" className="pl-16" />
            </div>
          </div>

          <div className="text-left">
              <Label
                htmlFor="facebookHandle"
                className="text-sm font-medium text-gray-700"
              >
                Facebook Cá Nhân (tùy chọn)
              </Label>
              <Input
                id="facebookHandle"
                placeholder="@facebook-personal"
                className="mt-1"
              />
            </div>
        </div>
      </div>
    </div>
  );
} 