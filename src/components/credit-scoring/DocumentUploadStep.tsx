import { Upload, Check, Receipt, ShoppingCart, MessageSquare, FileText, X } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";
import { useForm } from "../../lib/FormContext";
import { useAuth } from "react-oidc-context";
import { useState, useCallback } from "react";

interface UploadedFile {
  file: File;
  s3Key: string;
  uuid: string;
  uploading: boolean;
  error?: string;
}

export function DocumentUploadStep() {
  const { t } = useLanguage();
  const { formData, updateFormData } = useForm();
  const auth = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const uploadFileToS3 = async (file: File): Promise<{ s3Key: string; uuid: string } | null> => {
    try {
      if (!auth.user?.id_token) {
        throw new Error('User not authenticated');
      }

      // Get presigned URL from /uploadS3 endpoint
      const presignedResponse = await fetch('https://uufa8ybm3a.execute-api.ap-southeast-1.amazonaws.com/Stage0/uploadS3', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.user.id_token}`
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: file.type
        })
      });

      if (!presignedResponse.ok) {
        throw new Error(`Failed to get presigned URL: ${presignedResponse.status}`);
      }

      const presignedData = await presignedResponse.json();
      
      if (!presignedData.success) {
        throw new Error(presignedData.error || 'Failed to get presigned URL');
      }

      const { presignedUrl, s3Key, uuid } = presignedData.data;

      // Upload file to S3 using presigned URL
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type
        },
        body: file
      });

      if (!uploadResponse.ok) {
        throw new Error(`Failed to upload file: ${uploadResponse.status}`);
      }

      return { s3Key, uuid };
    } catch (error) {
      console.error('Upload error:', error);
      return null;
    }
  };

  const handleFileUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    for (const file of fileArray) {
      const uploadedFile: UploadedFile = {
        file,
        s3Key: '',
        uuid: '',
        uploading: true
      };

      // Add file to uploaded files list immediately
      setUploadedFiles(prev => [...prev, uploadedFile]);

      // Upload file
      const result = await uploadFileToS3(file);
      
      // Update the file in the list
      setUploadedFiles(prev => 
        prev.map(f => 
          f.file === file 
            ? { 
                ...f, 
                uploading: false, 
                s3Key: result?.s3Key || '', 
                uuid: result?.uuid || '',
                error: result ? undefined : 'Upload failed'
              }
            : f
        )
      );

      // Update form data with uploaded files
      if (result) {
        updateFormData({ 
          documents: [...formData.documents, file],
          file_uploads: [
            ...formData.file_uploads,
            {
              filename: file.name,
              s3_key: result.s3Key
            }
          ]
        });
      }
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  const removeFile = (fileToRemove: UploadedFile) => {
    setUploadedFiles(prev => prev.filter(f => f !== fileToRemove));
    updateFormData({ 
      documents: formData.documents.filter(f => f !== fileToRemove.file),
      file_uploads: formData.file_uploads.filter(upload => upload.filename !== fileToRemove.file.name)
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">{t("documentUpload.title")}</h3>
        <p className="text-sm text-gray-600 mb-6">
          {t("documentUpload.description")}
        </p>

        {/* Alternative Data Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
            <div className="flex items-center mb-2">
              <Receipt className="h-5 w-5 text-blue-600 mr-2" />
              <h4 className="font-medium text-blue-900">{t("alternativeData.bills.title")}</h4>
            </div>
            <p className="text-sm text-blue-700">{t("alternativeData.bills.description")}</p>
          </div>
          
          <div className="p-4 border rounded-lg bg-green-50 border-green-200">
            <div className="flex items-center mb-2">
              <ShoppingCart className="h-5 w-5 text-green-600 mr-2" />
              <h4 className="font-medium text-green-900">{t("alternativeData.shopping.title")}</h4>
            </div>
            <p className="text-sm text-green-700">{t("alternativeData.shopping.description")}</p>
          </div>
          
          <div className="p-4 border rounded-lg bg-purple-50 border-purple-200">
            <div className="flex items-center mb-2">
              <MessageSquare className="h-5 w-5 text-purple-600 mr-2" />
              <h4 className="font-medium text-purple-900">{t("alternativeData.socialMedia.title")}</h4>
            </div>
            <p className="text-sm text-purple-700">{t("alternativeData.socialMedia.description")}</p>
          </div>
          
          <div className="p-4 border rounded-lg bg-orange-50 border-orange-200">
            <div className="flex items-center mb-2">
              <FileText className="h-5 w-5 text-orange-600 mr-2" />
              <h4 className="font-medium text-orange-900">{t("alternativeData.other.title")}</h4>
            </div>
            <p className="text-sm text-orange-700">{t("alternativeData.other.description")}</p>
          </div>
        </div>

        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer group ${
            isDragging 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-transparent hover:bg-gray-100'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm font-medium text-gray-700 mb-2">{t("documentUpload.dragDrop")}</p>
          <p className="text-xs text-gray-500">{t("documentUpload.acceptedFormats")}</p>
          <input
            id="file-input"
            type="file"
            multiple
            accept=".pdf,.txt,.csv,.docx,.xlsx,.pptx,.jpg,.jpeg,.png,.gif,.webp,.html,.css,.js,.json,.xml,.md,.rtf"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {uploadedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            {uploadedFiles.map((uploadedFile, index) => (
              <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${
                uploadedFile.error ? 'bg-red-50' : uploadedFile.uploading ? 'bg-yellow-50' : 'bg-green-50'
              }`}>
                {uploadedFile.uploading ? (
                  <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                ) : uploadedFile.error ? (
                  <X className="h-4 w-4 text-red-600" />
                ) : (
                  <Check className="h-4 w-4 text-[#00b74f]" />
                )}
                <span className="text-sm text-gray-700 flex-1">{uploadedFile.file.name}</span>
                <span className={`text-xs ml-auto ${
                  uploadedFile.error ? 'text-red-600' : uploadedFile.uploading ? 'text-yellow-600' : 'text-[#00b74f]'
                }`}>
                  {uploadedFile.error ? 'Failed' : uploadedFile.uploading ? 'Uploading...' : t("documentUpload.uploaded")}
                </span>
                {!uploadedFile.uploading && (
                  <button
                    onClick={() => removeFile(uploadedFile)}
                    className="text-gray-400 hover:text-red-600 ml-2"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 