import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CheckCircle, Check, ArrowRight } from "lucide-react";

interface ScoreData {
  score: number;
  maxScore: number;
  color: string;
  label: string;
  labelColor: string;
}

export function CreditScoreResults() {
  const currentScore = 100;
  const maxScore = 100;

  const getScoreData = (score: number): ScoreData => {
    const percentage = (score / maxScore) * 100;

    if (percentage >= 80) {
      return {
        score,
        maxScore,
        color: "#00b74f",
        label: "Xuất sắc",
        labelColor: "from-[#00b74f] to-[#00b74f]"
      };
    } else if (percentage >= 60) {
      return {
        score,
        maxScore,
        color: "#90EE90",
        label: "Rất tốt",
        labelColor: "from-[#90EE90] to-[#00b74f]"
      };
    } else if (percentage >= 40) {
      return {
        score,
        maxScore,
        color: "#FFD700",
        label: "Tốt",
        labelColor: "from-[#FFD700] to-[#90EE90]"
      };
    } else if (percentage >= 20) {
      return {
        score,
        maxScore,
        color: "#FF8C00",
        label: "Khá",
        labelColor: "from-[#FF8C00] to-[#FFD700]"
      };
    } else {
      return {
        score,
        maxScore,
        color: "#E70000",
        label: "Yếu",
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
        <CardTitle className="text-2xl font-bold text-gray-800">Điểm tín dụng của bạn</CardTitle>
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
          <h4 className="text-lg font-semibold text-gray-800 mb-3">Ý nghĩa điểm số của bạn</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {percentage >= 80
              ? "Điểm số của bạn rất tốt, chủ yếu dựa trên lịch sử nghề nghiệp ổn định và việc thanh toán hóa đơn tiện ích đúng hạn. Điều này cho thấy độ tin cậy tài chính cao."
              : percentage >= 60
              ? "Điểm số của bạn khá tốt, cho thấy khả năng quản lý tài chính ổn định. Một số cải thiện nhỏ có thể giúp nâng cao điểm số."
              : percentage >= 40
              ? "Điểm số của bạn ở mức trung bình. Có nhiều cơ hội để cải thiện hồ sơ tín dụng thông qua việc quản lý tài chính tốt hơn."
              : percentage >= 20
              ? "Điểm số của bạn cần được cải thiện. Chúng tôi khuyến nghị bạn tập trung vào việc xây dựng lịch sử tín dụng tích cực."
              : "Điểm số của bạn cần được cải thiện đáng kể. Hãy bắt đầu với những bước cơ bản để xây dựng hồ sơ tín dụng."
            }
          </p>
        </div>

        {/* Strengths & Suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
              <CheckCircle className="h-4 w-4 text-[#00b74f] mr-2" />
              Điểm mạnh
            </h5>
            <div className="space-y-2">
              {percentage >= 40 && (
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="h-4 w-4 text-[#00b74f] mr-2 flex-shrink-0" />
                  Thanh toán hóa đơn tiện ích đúng hạn
                </div>
              )}
              {percentage >= 60 && (
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="h-4 w-4 text-[#00b74f] mr-2 flex-shrink-0" />
                  Hoạt động nghề nghiệp ổn định
                </div>
              )}
              {percentage >= 80 && (
                <div className="flex items-center text-sm text-gray-600">
                  <Check className="h-4 w-4 text-[#00b74f] mr-2 flex-shrink-0" />
                  Lịch sử tín dụng tích cực
                </div>
              )}
            </div>
          </div>

          <div>
            <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
              <ArrowRight className="h-4 w-4 text-[#015aad] mr-2" />
              Gợi ý cải thiện
            </h5>
            <div className="space-y-2">
              {percentage < 80 && (
                <div className="flex items-start text-sm text-gray-600">
                  <ArrowRight className="h-4 w-4 text-[#015aad] mr-2 flex-shrink-0 mt-0.5" />
                  Liên kết tài khoản ngân hàng chính để có bức tranh hoàn chỉnh hơn
                </div>
              )}
              {percentage < 60 && (
                                 <div className="flex items-start text-sm text-gray-600">
                  <ArrowRight className="h-4 w-4 text-[#015aad] mr-2 flex-shrink-0 mt-0.5" />
                  Thiết lập thanh toán tự động cho các hóa đơn thường xuyên
                </div>
              )}
              {percentage < 40 && (
                <div className="flex items-start text-sm text-gray-600">
                  <ArrowRight className="h-4 w-4 text-[#015aad] mr-2 flex-shrink-0 mt-0.5" />
                  Xây dựng lịch sử thu nhập ổn định qua các kênh chính thức
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}