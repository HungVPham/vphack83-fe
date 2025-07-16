import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";
import { useState, useEffect } from "react";

interface ScoreData {
  score: number;
  maxScore: number;
  color: string;
  label: string;
  labelColor: string;
}

// Types for the new API response
interface IndividualScores {
  financial_responsibility: number;
  stability_consistency: number;
  planning_execution: number;
  stress_resilience: number;
  social_professional_responsibility: number;
}

interface ScoreDetail {
  score: number;
  confidence: number;
}

interface LLMDetails {
  filename: string;
  classification: string;
  scores: {
    [key: string]: ScoreDetail;
  };
  evidence: {
    [key: string]: string;
  };
  key_findings: string;
  data_quality: string;
}

interface ApiResponse {
  overall_score: number;
  individual_scores: IndividualScores;
  llm_details: LLMDetails[];
  debug_info: any;
  timestamp: string;
  request_id: string;
}

// Types for dynamic content from Lambda
interface LambdaResponse {
  score: number;
  maxScore: number;
  explanation: {
    vi: string;
    en: string;
  };
  strengths: {
    vi: string[];
    en: string[];
  };
  suggestions: {
    vi: string[];
    en: string[];
  };
}

interface CreditScoreResultsProps {
  // For demo purposes, we'll use mock data, but in production this would come from Lambda
  lambdaData?: LambdaResponse;
  onStartNewForm?: () => void;
}

export function CreditScoreResults({
  lambdaData,
  onStartNewForm,
}: CreditScoreResultsProps) {
  const { t, language } = useLanguage();
  const [apiScoreData, setApiScoreData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingTime, setLoadingTime] = useState(0);
  const [expandedFiles, setExpandedFiles] = useState<Set<number>>(new Set());

  // Load API response from localStorage on component mount
  useEffect(() => {
    const checkForResult = () => {
      const storedResult = localStorage.getItem("creditScoreResult");
      if (storedResult) {
        try {
          const parsed = JSON.parse(storedResult);
          // Handle the case where the response is wrapped in a body string
          if (parsed.body && typeof parsed.body === "string") {
            const bodyData = JSON.parse(parsed.body);
            setApiScoreData(bodyData);
          } else {
            setApiScoreData(parsed);
          }
          setIsLoading(false);
        } catch (error) {
          console.error("Error parsing stored credit score result:", error);
          setIsLoading(false);
        }
      }
    };

    checkForResult();

    // Poll for result every 1 second if not found
    const interval = setInterval(() => {
      if (isLoading) {
        checkForResult();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoading]);

  // Timer for loading screen
  useEffect(() => {
    if (isLoading) {
      const timer = setInterval(() => {
        setLoadingTime((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setLoadingTime(0);
    }
  }, [isLoading]);

  // Use API data if available, otherwise use lambda data prop, no fallback to mock data
  const currentScore = apiScoreData?.overall_score
    ? Math.round(apiScoreData.overall_score * 100) // Convert 0.379 to 38 (out of 100)
    : lambdaData?.score ?? null;
  const maxScore = 100; // Always out of 100 for percentage-based scoring

  const getScoreData = (score: number): ScoreData => {
    if (score >= 75) {
      return {
        score,
        maxScore,
        color: "#00b74f", // No change
        label: t("creditScore.lowRisk"),
        labelColor: "from-[#00b74f] to-[#00b74f]",
      };
    } else if (score >= 50) {
      return {
        score,
        maxScore,
        color: "#80be27", // Updated from #90EE90
        label: t("creditScore.mediumLowRisk"),
        labelColor: "from-[#80be27] to-[#00b74f]", // Updated
      };
    } else if (score >= 25) {
      return {
        score,
        maxScore,
        color: "#e66200", // Updated from #FFD700
        label: t("creditScore.mediumRisk"),
        labelColor: "from-[#e66200] to-[#80be27]", // Updated
      };
    } else {
      return {
        score,
        maxScore,
        color: "#E70000", // No change
        label: t("creditScore.highRisk"),
        labelColor: "from-[#E70000] to-[#e66200]", // Updated
      };
    }
  };

  const scoreData = currentScore !== null ? getScoreData(currentScore) : null;
  const percentage =
    currentScore !== null ? (currentScore / maxScore) * 100 : 0;

  // Helper function to get score labels
  const getScoreLabel = (key: string, language: string): string => {
    const labels: { [key: string]: { vi: string; en: string } } = {
      financial_responsibility: {
        vi: "Trách nhiệm tài chính",
        en: "Financial Responsibility",
      },
      stability_consistency: {
        vi: "Ổn định & Nhất quán",
        en: "Stability & Consistency",
      },
      planning_execution: {
        vi: "Lập kế hoạch & Thực hiện",
        en: "Planning & Execution",
      },
      stress_resilience: {
        vi: "Khả năng chống chịu stress",
        en: "Stress Resilience",
      },
      social_professional_responsibility: {
        vi: "Trách nhiệm xã hội & nghề nghiệp",
        en: "Social & Professional Responsibility",
      },
    };
    return labels[key]?.[language as "vi" | "en"] || key;
  };

  // Helper function to get score color
  const getScoreColor = (score: number): string => {
    if (score >= 75) return "#00b74f";
    if (score >= 50) return "#80be27"; // Updated from #90EE90
    if (score >= 25) return "#e66200"; // Updated from #FFD700
    return "#E70000";
  };

  // Helper function to get risk category label
  const getRiskCategoryLabel = (score: number, language: string): string => {
    const scorePercentage = Math.round(score * 100);
    if (scorePercentage >= 75) {
      return language === "vi" ? "Rủi ro thấp" : "Low Risk";
    } else if (scorePercentage >= 50) {
      return language === "vi" ? "Rủi ro trung bình thấp" : "Medium-Low Risk";
    } else if (scorePercentage >= 25) {
      return language === "vi" ? "Rủi ro trung bình" : "Medium Risk";
    } else {
      return language === "vi" ? "Rủi ro cao" : "High Risk";
    }
  };

  const getClassificationLabel = (
    classification: string,
    language: string
  ): string => {
    const labels: { [key: string]: { vi: string; en: string } } = {
      social_media: { vi: "Mạng Xã Hội", en: "Social Media" },
      shopping_history: { vi: "Lịch Sử Mua Sắm", en: "Shopping History" },
      utility_bill: { vi: "Hóa Đơn Tiện Ích", en: "Utility Bill" },
      other: { vi: "Khác", en: "Other" },
    };
    return labels[classification]?.[language as "vi" | "en"] || classification;
  };

  // Toggle function for expanding/collapsing file details
  const toggleFileExpansion = (fileIndex: number) => {
    setExpandedFiles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(fileIndex)) {
        newSet.delete(fileIndex);
      } else {
        newSet.add(fileIndex);
      }
      return newSet;
    });
  };

  // Gauge calculations
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const gaugeLength = circumference * 0.75; // 3/4 of the circle (270 degrees)
  const gapOffset = circumference * 0.25; // Start at left side (90 degrees from top)

  // Background: Full gauge track (3/4 circle)
  const backgroundDashArray = `${gaugeLength} ${circumference - gaugeLength}`;
  const backgroundDashOffset = gapOffset;

  // Progress: Filled portion based on percentage
  const fillLength = gaugeLength * (percentage / 100);
  const progressDashArray = `${fillLength} ${circumference - fillLength}`;
  const progressDashOffset = gapOffset; // Same starting point as background

  // Show loading state while waiting for API response
  if (isLoading || currentScore === null) {
    return (
      <Card className="h-fit">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-gray-800">
            {t("creditScore.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#015aad] mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {language === "vi"
                ? "Đang phân tích dữ liệu..."
                : "Analyzing your data..."}
            </h3>
            <p className="text-sm text-gray-600">
              {language === "vi"
                ? "Vui lòng chờ trong giây lát, chúng tôi đang xử lý thông tin của bạn."
                : "Please wait a moment while we process your information."}
            </p>
            <div className="mt-4 text-center">
              <div className="text-lg font-mono text-gray-700">
                {Math.floor(loadingTime / 60)
                  .toString()
                  .padStart(2, "0")}
                :{(loadingTime % 60).toString().padStart(2, "0")}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {language === "vi" ? "Thời gian đã trôi qua" : "Time elapsed"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold text-gray-800">
          {t("creditScore.title")}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Credit Score Gauge */}
        <div className="text-center">
          <div className="relative w-48 h-48 mx-auto mb-4">
            <svg
              className="w-full h-full transform -rotate-270"
              viewBox="0 0 200 200"
            >
              {/* Background gauge track */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="16"
                strokeDasharray={backgroundDashArray}
                strokeDashoffset={backgroundDashOffset}
                strokeLinecap="round"
              />
              {/* Progress fill */}
              {scoreData && (
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke={scoreData.color}
                  strokeWidth="16"
                  strokeDasharray={progressDashArray}
                  strokeDashoffset={progressDashOffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              )}
            </svg>

            {/* Score Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {scoreData ? (
                <>
                  <span className="text-4xl font-bold text-gray-800">
                    {scoreData.score}
                  </span>
                  <span className="text-sm text-gray-600">
                    / {scoreData.maxScore}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-gray-500">--</span>
              )}
            </div>
          </div>

          {scoreData && (
            <div
              className={`inline-block px-4 py-2 text-white rounded-full text-sm font-medium`}
              style={{ backgroundColor: scoreData.color }}
            >
              {scoreData.label}
            </div>
          )}
        </div>

        {apiScoreData?.llm_details && apiScoreData.llm_details.length > 0 && (
          <div className="my-6 border-t border-dashed border-gray-300 w-full" />
        )}

        {/* Individual Scores */}
        {apiScoreData?.individual_scores &&
          apiScoreData.llm_details.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 text-center">
                {language === "vi"
                  ? "Điểm Cá Nhân Dựa Trên Dữ Liệu Bổ Sung"
                  : "Trait Scores Based On Uploaded Documents"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(apiScoreData.individual_scores).map(
                  ([key, value]) => {
                    const scorePercentage = Math.round(value * 100);
                    const scoreLabel = getScoreLabel(key, language);
                    const scoreColor = getScoreColor(scorePercentage);
                    const riskCategory = getRiskCategoryLabel(value, language);

                    return (
                      <div key={key} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700 text-left">
                            {scoreLabel}
                          </span>
                          <span
                            className="text-sm text-white px-2 py-1 rounded-md text-right"
                            style={{ backgroundColor: scoreColor }}
                          >
                            {riskCategory}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${scorePercentage}%`,
                              backgroundColor: scoreColor,
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed mb-2">
                          {scorePercentage}%
                        </p>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}

        {apiScoreData?.llm_details && apiScoreData.llm_details.length > 0 && (
          <div className="my-6 border-t border-dashed border-gray-300 w-full" />
        )}

        {/* Evidence/Explanations per File */}
        {apiScoreData?.llm_details && apiScoreData.llm_details.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800 text-center">
              {language === "vi"
                ? "Giải Thích Chi Tiết Theo Tệp"
                : "Detailed Explanations by File"}
            </h3>
            {apiScoreData.llm_details.map((fileDetail, fileIndex) => {
              const isExpanded = expandedFiles.has(fileIndex);

              return (
                <div
                  key={fileIndex}
                  className="border border-gray-300 rounded-lg"
                >
                  {/* File header - always visible and clickable */}
                  <div
                    className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleFileExpansion(fileIndex)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-left">
                        <h4 className="font-semibold text-gray-800 mb-1">
                          {language === "vi" ? "Tên Tệp:" : "File Name:"}{" "}
                          {fileDetail.filename}
                        </h4>
                        <p className="text-sm text-gray-600 capitalize">
                          {language === "vi" ? "Loại:" : "Type:"}{" "}
                          {getClassificationLabel(
                            fileDetail.classification,
                            language
                          )}
                        </p>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {/* Expandable content */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 p-4">
                      {/* Key Findings */}
                      {fileDetail.key_findings && (
                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <h5 className="text-sm font-medium text-yellow-800 mb-1">
                            {language === "vi"
                              ? "Phát Hiện Chính"
                              : "Key Findings"}
                          </h5>
                          <p className="text-sm text-yellow-700 leading-relaxed">
                            {fileDetail.key_findings}
                          </p>
                        </div>
                      )}

                      {/* Evidence Details */}
                      <div className="space-y-3 mb-4">
                        {Object.entries(fileDetail.evidence).map(
                          ([key, explanation]) => {
                            const categoryLabel = getScoreLabel(key, language);
                            const categoryScore =
                              fileDetail.scores[key]?.score || 0;
                            const scorePercentage = Math.round(
                              (categoryScore / 10) * 100
                            ); // Convert 1-10 scale to percentage
                            const scoreColor = getScoreColor(scorePercentage);
                            const riskCategory = getRiskCategoryLabel(
                              categoryScore / 10,
                              language
                            ); // Convert to 0-1 scale for risk category

                            return (
                              <div
                                key={key}
                                className="bg-gray-50 rounded-lg p-3"
                              >
                                <div className="flex justify-between items-center mb-2">
                                  <h5 className="text-sm font-medium text-gray-700">
                                    {categoryLabel}
                                  </h5>
                                  <span
                                    className="text-xs font-bold"
                                    style={{ color: scoreColor }}
                                  >
                                    {riskCategory}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600 leading-relaxed mb-2">
                                  {explanation}
                                </p>
                                <div className="w-full bg-gray-200 rounded-full h-1">
                                  <div
                                    className="h-1 rounded-full transition-all duration-500"
                                    style={{
                                      width: `${scorePercentage}%`,
                                      backgroundColor: scoreColor,
                                    }}
                                  />
                                </div>
                                <p className="text-xs text-gray-600 leading-relaxed mb-2">
                                  {scorePercentage}%
                                </p>
                              </div>
                            );
                          }
                        )}
                      </div>

                      {/* Data Quality */}
                      {fileDetail.data_quality && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <h5 className="text-sm font-medium text-blue-800 mb-1">
                            {language === "vi"
                              ? "Đánh Giá Chất Lượng Dữ Liệu"
                              : "Data Quality Assessment"}
                          </h5>
                          <p className="text-xs text-blue-700 leading-relaxed">
                            {fileDetail.data_quality}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Start New Form Button */}
        {onStartNewForm && (
          <div className="pt-6 border-t border-gray-200">
            <div className="flex justify-center">
              <button
                onClick={onStartNewForm}
                className="inline-flex items-center px-6 py-3 bg-[#015aad] text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                {t("creditScore.startNewForm")}
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
