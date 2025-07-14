import { CheckCircle, Brain, Clock, Shield, Target, User, Home, CreditCard, Briefcase, FileText } from 'lucide-react';
import { useLanguage } from '../../lib/LanguageContext';

interface IntroductionSectionProps {
  onStart: () => void;
}

export function IntroductionSection({ onStart }: IntroductionSectionProps) {
  const { t } = useLanguage();

  const features = [
    {
      icon: Brain,
      title: t('introduction.features.ai'),
      color: 'text-blue-600'
    },
    {
      icon: Clock,
      title: t('introduction.features.fast'),
      color: 'text-green-600'
    },
    {
      icon: Shield,
      title: t('introduction.features.secure'),
      color: 'text-red-600'
    },
    {
      icon: Target,
      title: t('introduction.features.accurate'),
      color: 'text-purple-600'
    }
  ];

  const steps = [
    {
      icon: User,
      title: t('introduction.steps.personal'),
      color: 'text-blue-500'
    },
    {
      icon: Home,
      title: t('introduction.steps.property'),
      color: 'text-green-500'
    },
    {
      icon: CreditCard,
      title: t('introduction.steps.loan'),
      color: 'text-orange-500'
    },
    {
      icon: Briefcase,
      title: t('introduction.steps.professional'),
      color: 'text-purple-500'
    },
    {
      icon: FileText,
      title: t('introduction.steps.documents'),
      color: 'text-red-500'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('introduction.title')}
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          {t('introduction.subtitle')}
        </p>
        <p className="text-gray-500 max-w-2xl mx-auto">
          {t('introduction.description')}
        </p>
      </div>

      {/* Features Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          {t('introduction.features.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
              <feature.icon className={`w-8 h-8 ${feature.color}`} />
              <span className="text-gray-700 font-medium">{feature.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Steps Overview */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          {t('introduction.steps.title')}
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-full">
              <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full">
                <span className="text-sm font-bold text-gray-600">{index + 1}</span>
              </div>
              <step.icon className={`w-5 h-5 ${step.color}`} />
              <span className="text-sm text-gray-700">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <div className="text-center">
        <button
          onClick={onStart}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200 flex items-center justify-center space-x-2 mx-auto"
        >
          <CheckCircle className="w-6 h-6" />
          <span>{t('introduction.button.start')}</span>
        </button>
      </div>
    </div>
  );
}