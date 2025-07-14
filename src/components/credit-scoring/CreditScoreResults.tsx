import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CheckCircle, Check, ArrowRight } from "lucide-react";
import { useLanguage } from "../../lib/LanguageContext";
import { useState, useEffect } from "react";

interface ScoreData {
  score: number;
  maxScore: number;
  color: string;
  label: string;
  labelColor: string;
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

export function CreditScoreResults({ lambdaData, onStartNewForm }: CreditScoreResultsProps) {
  const { t, language } = useLanguage();
  const [apiScoreData, setApiScoreData] = useState<any>(null);
  
  // Load API response from localStorage on component mount
  useEffect(() => {
    const storedResult = localStorage.getItem('creditScoreResult');
    if (storedResult) {
      try {
        const parsed = JSON.parse(storedResult);
        setApiScoreData(parsed);
      } catch (error) {
        console.error('Error parsing stored credit score result:', error);
      }
    }
  }, []);
  
  // Use API data if available, otherwise use lambda data prop, otherwise use mock data for demo
  const currentScore = apiScoreData?.xgboost_score 
    ? Math.round(apiScoreData.xgboost_score * 100) // Convert 0.5229 to 52 (out of 100)
    : lambdaData?.score ?? 100;
  const maxScore = 100; // Always out of 100 for percentage-based scoring

  const getScoreData = (score: number): ScoreData => {
    const percentage = (score / maxScore) * 100;

    if (percentage >= 80) {
      return {
        score,
        maxScore,
        color: "#00b74f",
        label: t('creditScore.excellent'),
        labelColor: "from-[#00b74f] to-[#00b74f]"
      };
    } else if (percentage >= 60) {
      return {
        score,
        maxScore,
        color: "#90EE90",
        label: t('creditScore.veryGood'),
        labelColor: "from-[#90EE90] to-[#00b74f]"
      };
    } else if (percentage >= 40) {
      return {
        score,
        maxScore,
        color: "#FFD700",
        label: t('creditScore.good'),
        labelColor: "from-[#FFD700] to-[#90EE90]"
      };
    } else if (percentage >= 20) {
      return {
        score,
        maxScore,
        color: "#FF8C00",
        label: t('creditScore.fair'),
        labelColor: "from-[#FF8C00] to-[#FFD700]"
      };
    } else {
      return {
        score,
        maxScore,
        color: "#E70000",
        label: t('creditScore.poor'),
        labelColor: "from-[#E70000] to-[#FF8C00]"
      };
    }
  };

  const scoreData = getScoreData(currentScore);
  const percentage = (currentScore / maxScore) * 100;

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

  return (
    <Card className="h-fit">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl font-bold text-gray-800">{t('creditScore.title')}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Credit Score Gauge */}
        <div className="text-center">
          <div className="relative w-48 h-48 mx-auto mb-4">
            <svg className="w-full h-full transform -rotate-270" viewBox="0 0 200 200">
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
            </svg>

            {/* Score Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-gray-800">{scoreData.score}</span>
              <span className="text-sm text-gray-600">/ {scoreData.maxScore}</span>
            </div>
          </div>

          <div
            className={`inline-block px-4 py-2 text-white rounded-full text-sm font-medium`}
            style={{ backgroundColor: scoreData.color }}
          >
            {scoreData.label}
          </div>
        </div>

        {/* AI Explanation */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-3">{t('creditScore.meaningTitle')}</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {lambdaData?.explanation?.[language] || 
              (percentage >= 80
                ? (language === 'vi' 
                    ? "Điểm số của bạn rất tốt, chủ yếu dựa trên lịch sử nghề nghiệp ổn định và việc thanh toán hóa đơn tiện ích đúng hạn. Điều này cho thấy độ tin cậy tài chính cao."
                    : "Your score is excellent, mainly based on stable career history and timely utility bill payments. This shows high financial reliability.")
                : percentage >= 60
                ? (language === 'vi' 
                    ? "Điểm số của bạn khá tốt, cho thấy khả năng quản lý tài chính ổn định. Một số cải thiện nhỏ có thể giúp nâng cao điểm số."
                    : "Your score is quite good, showing stable financial management capabilities. Some minor improvements could help boost your score.")
                : percentage >= 40
                ? (language === 'vi' 
                    ? "Điểm số của bạn ở mức trung bình. Có nhiều cơ hội để cải thiện hồ sơ tín dụng thông qua việc quản lý tài chính tốt hơn."
                    : "Your score is at an average level. There are many opportunities to improve your credit profile through better financial management.")
                : percentage >= 20
                ? (language === 'vi' 
                    ? "Điểm số của bạn cần được cải thiện. Chúng tôi khuyến nghị bạn tập trung vào việc xây dựng lịch sử tín dụng tích cực."
                    : "Your score needs improvement. We recommend focusing on building positive credit history.")
                : (language === 'vi' 
                    ? "Điểm số của bạn cần được cải thiện đáng kể. Hãy bắt đầu với những bước cơ bản để xây dựng hồ sơ tín dụng."
                    : "Your score needs significant improvement. Start with the basic steps to build your credit profile.")
              )
            }
          </p>
        </div>

        {/* Strengths & Suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
              <CheckCircle className="h-4 w-4 text-[#00b74f] mr-2" />
              {t('creditScore.strengths')}
            </h5>
            <div className="space-y-2">
              {lambdaData?.strengths?.[language] ? (
                lambdaData.strengths[language].map((strength, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <Check className="h-4 w-4 text-[#00b74f] mr-2 flex-shrink-0" />
                    {strength}
                  </div>
                ))
              ) : (
                <>
                  {percentage >= 40 && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Check className="h-4 w-4 text-[#00b74f] mr-2 flex-shrink-0" />
                      {t('creditScore.strength.utilityPayments')}
                    </div>
                  )}
                  {percentage >= 60 && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Check className="h-4 w-4 text-[#00b74f] mr-2 flex-shrink-0" />
                      {t('creditScore.strength.stableCareer')}
                    </div>
                  )}
                  {percentage >= 80 && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Check className="h-4 w-4 text-[#00b74f] mr-2 flex-shrink-0" />
                      {t('creditScore.strength.positiveCreditHistory')}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
              <ArrowRight className="h-4 w-4 text-[#015aad] mr-2" />
              {t('creditScore.suggestions')}
            </h5>
            <div className="space-y-2">
              {lambdaData?.suggestions?.[language] ? (
                lambdaData.suggestions[language].map((suggestion, index) => (
                  <div key={index} className="flex items-start text-sm text-gray-600">
                    <ArrowRight className="h-4 w-4 text-[#015aad] mr-2 flex-shrink-0 mt-0.5" />
                    {suggestion}
                  </div>
                ))
              ) : (
                <>
                  {percentage < 80 && (
                    <div className="flex items-start text-sm text-gray-600">
                      <ArrowRight className="h-4 w-4 text-[#015aad] mr-2 flex-shrink-0 mt-0.5" />
                      {t('creditScore.suggestion.linkBankAccount')}
                    </div>
                  )}
                  {percentage < 60 && (
                    <div className="flex items-start text-sm text-gray-600">
                      <ArrowRight className="h-4 w-4 text-[#015aad] mr-2 flex-shrink-0 mt-0.5" />
                      {t('creditScore.suggestion.autoPayments')}
                    </div>
                  )}
                  {percentage < 40 && (
                    <div className="flex items-start text-sm text-gray-600">
                      <ArrowRight className="h-4 w-4 text-[#015aad] mr-2 flex-shrink-0 mt-0.5" />
                      {t('creditScore.suggestion.buildIncomeHistory')}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Start New Form Button */}
        {onStartNewForm && (
          <div className="pt-6 border-t border-gray-200">
            <div className="flex justify-center">
              <button
                onClick={onStartNewForm}
                className="inline-flex items-center px-6 py-3 bg-[#015aad] text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                {t('creditScore.startNewForm')}
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}