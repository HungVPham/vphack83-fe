import { useState } from "react";
import { Header } from "./Header";
import { DataInputForm } from "./DataInputForm";
import { CreditScoreResults } from "./CreditScoreResults";
import { IntroductionSection } from "./IntroductionSection";

export function CreditScoringApp() {
  const [showScoreCard, setShowScoreCard] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleFormSubmit = () => {
    setShowScoreCard(true);
  };

  const handleStartAssessment = () => {
    setShowForm(true);
  };

  const handleStartNewForm = () => {
    setShowScoreCard(false);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Header />
      
      <div className="max-w-7xl mx-auto">
        {!showForm ? (
          <IntroductionSection onStart={handleStartAssessment} />
        ) : !showScoreCard ? (
          <DataInputForm onSubmit={handleFormSubmit} onBack={() => setShowForm(false)} />
        ) : (
          <CreditScoreResults onStartNewForm={handleStartNewForm} />
        )}
      </div>
    </div>
  );
} 