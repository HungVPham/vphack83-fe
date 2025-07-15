import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ArrowRight } from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(true);
  
  // Load API response from localStorage on component mount
  useEffect(() => {
    const checkForResult = () => {
      const storedResult = localStorage.getItem('creditScoreResult');
      if (storedResult) {
        try {
          const parsed = JSON.parse(storedResult);
          setApiScoreData(parsed);
          setIsLoading(false);
        } catch (error) {
          console.error('Error parsing stored credit score result:', error);
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
  
  // Use API data if available, otherwise use lambda data prop, otherwise use mock data for demo
  const currentScore = apiScoreData?.xgboost_score 
    ? Math.round(apiScoreData.xgboost_score * 100) // Convert 0.5229 to 52 (out of 100)
    : lambdaData?.score ?? 100;
  const maxScore = 100; // Always out of 100 for percentage-based scoring

  const getScoreData = (score: number): ScoreData => {
    if (score >= 75) {
      return {
        score,
        maxScore,
        color: "#00b74f",
        label: t('creditScore.lowRisk'),
        labelColor: "from-[#00b74f] to-[#00b74f]"
      };
    } else if (score >= 50) {
      return {
        score,
        maxScore,
        color: "#90EE90",
        label: t('creditScore.mediumLowRisk'),
        labelColor: "from-[#90EE90] to-[#00b74f]"
      };
    } else if (score >= 25) {
      return {
        score,
        maxScore,
        color: "#FFD700",
        label: t('creditScore.mediumRisk'),
        labelColor: "from-[#FFD700] to-[#90EE90]"
      };
    } else {
      return {
        score,
        maxScore,
        color: "#E70000",
        label: t('creditScore.highRisk'),
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

  // Show loading state while waiting for API response
  if (isLoading) {
    return (
      <Card className="h-fit">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl font-bold text-gray-800">{t('creditScore.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#015aad] mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {language === 'vi' ? 'Đang phân tích dữ liệu...' : 'Analyzing your data...'}
            </h3>
            <p className="text-sm text-gray-600">
              {language === 'vi' 
                ? 'Vui lòng chờ trong giây lát, chúng tôi đang xử lý thông tin của bạn.'
                : 'Please wait a moment while we process your information.'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

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