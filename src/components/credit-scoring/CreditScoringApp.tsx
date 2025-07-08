import { Header } from "./Header";
import { DataInputForm } from "./DataInputForm";
import { CreditScoreResults } from "./CreditScoreResults";

export function CreditScoringApp() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Header />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Panel: Multi-Step Data Input Form */}
        <DataInputForm />
        
        {/* Right Panel: Credit Score Results Dashboard */}
        <CreditScoreResults />
      </div>
    </div>
  );
} 