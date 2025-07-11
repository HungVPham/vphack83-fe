import { Upload, Check } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";

export function DocumentUploadStep() {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">{t("documentUpload.title")}</h3>
        <p className="text-sm text-gray-600 mb-6">
          {t("documentUpload.description")}
        </p>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-transparent hover:bg-gray-100 transition-all cursor-pointer group">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm font-medium text-gray-700 mb-2">{t("documentUpload.dragDrop")}</p>
          <p className="text-xs text-gray-500">{t("documentUpload.acceptedFormats")}</p>
        </div>

        <div className="mt-4">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <Check className="h-4 w-4 text-[#00b74f]" />
            <span className="text-sm text-gray-700">utility_bill_may.pdf</span>
            <span className="text-xs text-[#00b74f] ml-auto">{t("documentUpload.uploaded")}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 