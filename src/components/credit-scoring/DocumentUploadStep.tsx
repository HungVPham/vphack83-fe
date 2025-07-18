import {
  Upload,
  Check,
  Receipt,
  ShoppingCart,
  MessageSquare,
  FileText,
  X,
} from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";
import { useForm } from "../../lib/FormContext";
import { useAuth } from "react-oidc-context";
import { useState, useCallback, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

interface UploadedFile {
  file: File;
  s3Key: string;
  uuid: string;
  uploading: boolean;
  error?: string;
  url?: string; // Added for S3-uploaded files
  contentType?: string; // Added for S3-uploaded files
  isS3?: boolean; // Added to distinguish S3 files
}

// Function to get a presigned download URL for a given S3 key
export async function getPresignedDownloadUrl(s3Key: string, idToken?: string): Promise<string | null> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (idToken) {
      headers['Authorization'] = `Bearer ${idToken}`;
    }
    const response = await fetch(import.meta.env.VITE_S3_UPLOAD_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        operation: 'download',
        s3Key,
      })
    });
    if (!response.ok) {
      throw new Error(`Failed to get presigned download URL: ${response.status}`);
    }
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'Failed to get presigned download URL');
    }
    return data.data.presignedUrl;
  } catch (error) {
    console.error('Error getting presigned download URL:', error);
    return null;
  }
}

export function DocumentUploadStep() {
  const { t } = useLanguage();
  const { formData, updateFormData } = useForm();
  const auth = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState<string | null>(null); // s3Key of file being downloaded

  // Add S3-uploaded files to uploadedFiles on mount or when formData.file_uploads changes
  useEffect(() => {
    if (formData.file_uploads && Array.isArray(formData.file_uploads)) {
      const s3Files = formData.file_uploads.map((upload) => ({
        file: { name: upload.filename } as File,
        s3Key: upload.s3_key,
        uuid: upload.s3_key,
        uploading: false,
        url: (upload as any).url,
        contentType: upload.content_type,
        isS3: true,
      }));
      setUploadedFiles((prev) => {
        // Remove local files that have the same name as an S3 file
        const s3FileNames = new Set(s3Files.map(f => f.file.name));
        const filteredPrev = prev.filter(
          f => !(s3FileNames.has(f.file.name) && !f.isS3)
        );
        // Remove S3 files that are no longer in formData.file_uploads
        const existingS3Keys = new Set(s3Files.map(f => f.s3Key));
        const filteredPrevS3 = filteredPrev.filter(
          f => !f.isS3 || existingS3Keys.has(f.s3Key)
        );
        // Add new S3 files
        const existingS3KeysInPrev = new Set(filteredPrevS3.filter(f => f.isS3).map(f => f.s3Key));
        const newS3Files = s3Files.filter(f => !existingS3KeysInPrev.has(f.s3Key));
        return [...filteredPrevS3, ...newS3Files];
      });
    }
  }, [formData.file_uploads]);

  // Helper function to get content type from file extension
  const getContentTypeFromExtension = (filename: string): string => {
    const extension = filename.toLowerCase().split(".").pop();
    const contentTypeMap: { [key: string]: string } = {
      pdf: "application/pdf",
      txt: "text/plain",
      csv: "text/csv",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      html: "text/html",
      css: "text/css",
      js: "application/javascript",
      json: "application/json",
      xml: "application/xml",
      md: "text/markdown",
      rtf: "application/rtf",
    };
    return contentTypeMap[extension || ""] || "application/octet-stream";
  };

  const uploadFileToS3 = async (
    file: File
  ): Promise<{ s3Key: string; uuid: string } | null> => {
    try {
      if (!auth.user?.id_token) {
        throw new Error("User not authenticated");
      }

      // Get presigned URL from /uploadS3 endpoint
      const presignedResponse = await fetch(import.meta.env.VITE_S3_UPLOAD_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.user.id_token}`
        },
        body: JSON.stringify({
          filename: file.name,
          contentType: getContentTypeFromExtension(file.name)
        })
      });

      if (!presignedResponse.ok) {
        throw new Error(
          `Failed to get presigned URL: ${presignedResponse.status}`
        );
      }

      const presignedData = await presignedResponse.json();

      if (!presignedData.success) {
        throw new Error(presignedData.error || "Failed to get presigned URL");
      }

      const { presignedUrl, s3Key, uuid } = presignedData.data;

      // Upload file to S3 using presigned URL
      const uploadResponse = await fetch(presignedUrl, {
        method: "PUT",
        headers: {
          'Content-Type': getContentTypeFromExtension(file.name)
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error(`Failed to upload file: ${uploadResponse.status}`);
      }

      return { s3Key, uuid };
    } catch (error) {
      console.error("Upload error:", error);
      return null;
    }
  };

  const handleFileUpload = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);

    for (const file of fileArray) {
      const uploadedFile: UploadedFile = {
        file,
        s3Key: "",
        uuid: "",
        uploading: true,
      };

      // Add file to uploaded files list immediately
      setUploadedFiles((prev) => [...prev, uploadedFile]);

      // Upload file
      const result = await uploadFileToS3(file);

      // Update the file in the list
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.file === file
            ? {
                ...f,
                uploading: false,
                s3Key: result?.s3Key || "",
                uuid: result?.uuid || "",
                error: result ? undefined : "Upload failed",
              }
            : f
        )
      );

      // Update form data with uploaded files
      if (result) {
        updateFormData({ 
          documents: [...(formData.documents || []), file],
          file_uploads: [
            ...(formData.file_uploads || []),
            {
              filename: file.name,
              s3_key: result.s3Key,
              content_type: getContentTypeFromExtension(file.name),
            },
          ],
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
    if (fileToRemove.isS3) {
      // Remove from file_uploads
      updateFormData({
        file_uploads: (formData.file_uploads || []).filter(upload => upload.s3_key !== fileToRemove.s3Key),
        documents: (formData.documents || []).filter(f => f.name !== fileToRemove.file.name)
      });
    } else {
      // Remove from local uploads
      updateFormData({
        documents: (formData.documents || []).filter(f => f !== fileToRemove.file),
        file_uploads: (formData.file_uploads || []).filter(upload => upload.filename !== fileToRemove.file.name)
      });
    }
  };

  // const handleSampleDataUpload = () => {
  //   // Create a mock File object for display purposes
  //   const mockFile = new File(
  //     ["Sample social media data content"],
  //     "test_document.txt",
  //     {
  //       type: "text/plain",
  //     }
  //   );

  //   const sampleFileData: UploadedFile = {
  //     file: mockFile,
  //     s3Key: "a9c713a3-c695-4239-9f52-e46ab7ad5bff.txt",
  //     uuid: "sample-uuid",
  //     uploading: false,
  //     url: "https://example.com/test_document.txt", // Mock URL for sample data
  //     contentType: "text/plain",
  //     isS3: true,
  //   };

  //   // Add sample file to uploaded files list
  //   setUploadedFiles((prev) => [...prev, sampleFileData]);

  //   // Update form data with sample file information
  //   updateFormData({ 
  //     documents: [...(formData.documents || []), mockFile],
  //     file_uploads: [
  //       ...(formData.file_uploads || []),
  //       {
  //         filename: "test_document.txt",
  //         s3_key: "a9c713a3-c695-4239-9f52-e46ab7ad5bff.txt",
  //         content_type: "text/plain",
  //       },
  //     ],
  //   });
  // };

  // Handler for S3 file download
  const handleS3Download = async (uploadedFile: UploadedFile) => {
    setDownloadLoading(uploadedFile.s3Key);
    try {
      const url = await getPresignedDownloadUrl(uploadedFile.s3Key, auth.user?.id_token);
      if (url) {
        window.open(url, '_blank');
      } else {
        alert('Failed to get download link.');
      }
    } catch (e) {
      alert('Failed to get download link.');
    } finally {
      setDownloadLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">
          {t("documentUpload.title")}
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          {t("documentUpload.description")}
        </p>

        {/* Alternative Data Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 border rounded-lg bg-blue-50 border-blue-200 flex flex-col items-center">
            <div className="flex items-center justify-center mb-2">
              <Receipt className="h-5 w-5 text-blue-600 mr-2" />
              <h4 className="font-medium text-blue-900 text-center">
                {t("alternativeData.bills.title")}
              </h4>
            </div>
            <p className="text-sm text-blue-700 text-center">
              {t("alternativeData.bills.description")}
            </p>
          </div>

          <div className="p-4 border rounded-lg bg-green-50 border-green-200 flex flex-col items-center">
            <div className="flex items-center justify-center mb-2">
              <ShoppingCart className="h-5 w-5 text-green-600 mr-2" />
              <h4 className="font-medium text-green-900 text-center">
                {t("alternativeData.shopping.title")}
              </h4>
            </div>
            <p className="text-sm text-green-700 text-center">
              {t("alternativeData.shopping.description")}
            </p>
          </div>

          <div className="p-4 border rounded-lg bg-purple-50 border-purple-200 flex flex-col items-center">
            <div className="flex items-center justify-center mb-2">
              <MessageSquare className="h-5 w-5 text-purple-600 mr-2" />
              <h4 className="font-medium text-purple-900 text-center">
                {t("alternativeData.socialMedia.title")}
              </h4>
            </div>
            <p className="text-sm text-purple-700 text-center">
              {t("alternativeData.socialMedia.description")}
            </p>
          </div>

          <div className="p-4 border rounded-lg bg-orange-50 border-orange-200 flex flex-col items-center">
            <div className="flex items-center justify-center mb-2">
              <FileText className="h-5 w-5 text-orange-600 mr-2" />
              <h4 className="font-medium text-orange-900 text-center">
                {t("alternativeData.other.title")}
              </h4>
            </div>
            <p className="text-sm text-orange-700 text-center">
              {t("alternativeData.other.description")}
            </p>
          </div>
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer group ${
            isDragging
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-transparent hover:bg-gray-100"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm font-medium text-gray-700 mb-2">
            {t("documentUpload.dragDrop")}
          </p>
          <p className="text-xs text-gray-500">
            {t("documentUpload.acceptedFormats")}
          </p>
          <input
            id="file-input"
            type="file"
            multiple
            accept=".pdf,.txt,.csv,.docx,.xlsx,.pptx,.html,.css,.js,.json,.xml,.md,.rtf"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Sample Data Upload Button */}
        {/* <div className="mt-4 text-center">
          <button
            onClick={handleSampleDataUpload}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#015aad] transition-colors"
          >
            <FileText className="h-4 w-4 mr-2" />
            {t("documentUpload.uploadSampleData") || "Upload Sample Data"}
          </button>
          <p className="text-xs text-gray-500 mt-1">
            {t("documentUpload.sampleDataDescription") ||
              "Use sample social media data for testing"}
          </p>
        </div> */}

        {uploadedFiles.length > 0 && (
          <div className="mt-4 space-y-2">
            {uploadedFiles.map((uploadedFile, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 p-3 rounded-lg ${
                  uploadedFile.error
                    ? "bg-red-50"
                    : uploadedFile.uploading
                    ? "bg-yellow-50"
                    : "bg-green-50"
                }`}
              >
                {uploadedFile.uploading ? (
                  <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                ) : uploadedFile.error ? (
                  <X className="h-4 w-4 text-red-600" />
                ) : (
                  <Check className="h-4 w-4 text-[#00b74f]" />
                )}
                <span className="text-sm text-gray-700 flex-1">
                  {uploadedFile.file.name}
                </span>
                {/* Download button for S3 files */}
                {uploadedFile.isS3 && (
                  <button
                    type="button"
                    className="text-blue-600 hover:underline text-xs px-2 disabled:opacity-50"
                    onClick={() => handleS3Download(uploadedFile)}
                    disabled={downloadLoading === uploadedFile.s3Key}
                  >
                    <FontAwesomeIcon icon={faDownload} />
                  </button>
                )}
                <span
                  className={`text-xs ml-auto ${
                    uploadedFile.error
                      ? "text-red-600"
                      : uploadedFile.uploading
                      ? "text-yellow-600"
                      : "text-[#00b74f]"
                  }`}
                >
                  {uploadedFile.error
                    ? "Failed"
                    : uploadedFile.uploading
                    ? "Uploading..."
                    : t("documentUpload.uploaded")}
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
