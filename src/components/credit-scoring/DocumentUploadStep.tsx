import { Upload, Check } from "lucide-react";

export function DocumentUploadStep() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">Xây dựng câu chuyện tài chính của bạn</h3>
        <p className="text-sm text-gray-600 mb-6">
          Cung cấp thêm tài liệu giúp AI của chúng tôi tạo ra điểm số chính xác và công bằng hơn cho bạn.
        </p>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-transparent hover:bg-gradient-to-r hover:from-[#015aad] hover:to-[#00b74f] hover:text-white transition-all cursor-pointer group">
          <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-white mb-4" />
          <p className="text-sm font-medium text-gray-700 group-hover:text-white mb-2">Kéo thả tệp hoặc nhấn để tải lên</p>
          <p className="text-xs text-gray-500 group-hover:text-white/80">Chấp nhận: PDF, JPG, PNG. Tối đa 5MB.</p>
        </div>

        <div className="mt-4">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <Check className="h-4 w-4 text-[#00b74f]" />
            <span className="text-sm text-gray-700">utility_bill_may.pdf</span>
            <span className="text-xs text-[#00b74f] ml-auto">Đã tải lên</span>
          </div>
        </div>
      </div>
    </div>
  );
} 