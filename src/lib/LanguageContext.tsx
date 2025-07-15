import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'vi' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  interpolate: (template: string, values: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Static translations for UI elements
const translations = {
  vi: {
    // Header
    'header.logout.confirm': 'Bạn có chắc chắn muốn đăng xuất?',
    'header.logout.error': 'Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại.',
    'header.logout.loading': 'Đang đăng xuất...',
    
    // Credit Score Results
    'creditScore.title': 'Điểm tín dụng của bạn',
    'creditScore.meaningTitle': 'Ý nghĩa điểm số của bạn',
    'creditScore.strengths': 'Điểm mạnh',
    'creditScore.suggestions': 'Gợi ý cải thiện',
    
    // Score labels
    'creditScore.lowRisk': 'Rủi ro thấp',
    'creditScore.mediumLowRisk': 'Rủi ro trung bình thấp',
    'creditScore.mediumRisk': 'Rủi ro trung bình',
    'creditScore.highRisk': 'Rủi ro cao',
    
    // Static strengths
    'creditScore.strength.utilityPayments': 'Thanh toán hóa đơn tiện ích đúng hạn',
    'creditScore.strength.stableCareer': 'Hoạt động nghề nghiệp ổn định',
    'creditScore.strength.positiveCreditHistory': 'Lịch sử tín dụng tích cực',
    
    // Static suggestions
    'creditScore.suggestion.linkBankAccount': 'Liên kết tài khoản ngân hàng chính để có bức tranh hoàn chỉnh hơn',
    'creditScore.suggestion.autoPayments': 'Thiết lập thanh toán tự động cho các hóa đơn thường xuyên',
    'creditScore.suggestion.buildIncomeHistory': 'Xây dựng lịch sử thu nhập ổn định qua các kênh chính thức',
    'creditScore.startNewForm': 'Bắt đầu đánh giá mới',
    
    // Data Input Form
    'dataInputForm.title': 'Đánh giá tín dụng AI',
    'dataInputForm.step.personalInfo': 'Thông Tin Cá Nhân',
    'dataInputForm.step.personalPropertyAndProfessional': 'Thông Tin Tài Sản & Nghề Nghiệp',
    'dataInputForm.step.financialDocuments': 'Dữ Liệu Thay Thế',
    'dataInputForm.stepCounter': 'Bước {current} / {total}',
    'dataInputForm.button.back': 'Quay lại',
    'dataInputForm.button.continue': 'Tiếp tục',
    'dataInputForm.button.complete': 'Hoàn thành',
    'dataInputForm.button.submitting': 'Đang xử lý...',

    // Personal Information Step
    'personalInfo.title': 'Thông Tin Cá Nhân',
    'personalInfo.fullName': 'Họ và Tên',
    'personalInfo.fullName.placeholder': 'Nhập họ và tên đầy đủ',
    'personalInfo.gender': 'Giới tính',
    'personalInfo.gender.male': 'Nam',
    'personalInfo.gender.female': 'Nữ',
    'personalInfo.familyStatus': 'Tình trạng hôn nhân',
    'personalInfo.familyStatus.placeholder': 'Chọn tình trạng hôn nhân',
    'personalInfo.familyStatus.single': 'Độc thân / Chưa kết hôn',
    'personalInfo.familyStatus.married': 'Đã kết hôn',
    'personalInfo.familyStatus.civilMarriage': 'Kết hôn dân sự',
    'personalInfo.familyStatus.separated': 'Ly thân',
    'personalInfo.familyStatus.widow': 'Góa phụ',
    'personalInfo.familyStatus.unknown': 'Không rõ',
    'personalInfo.email': 'Email',
    'personalInfo.email.placeholder': 'Nhập địa chỉ email',
    'personalInfo.hasChildren': 'Bạn có con không?',
    'personalInfo.hasChildren.no': 'Không',
    'personalInfo.hasChildren.yes': 'Có',
    'personalInfo.numberOfChildren': 'Số con',
    'personalInfo.dateOfBirth': 'Ngày sinh',
    'personalInfo.phoneNumber': 'Số điện thoại',
    'personalInfo.phoneNumber.placeholder': 'Nhập số điện thoại',
    'personalInfo.province': 'Tỉnh/Thành phố',
    'personalInfo.province.loading': 'Đang tải...',
    'personalInfo.province.placeholder': 'Chọn tỉnh/thành phố',
    'personalInfo.province.searchPlaceholder': 'Tìm kiếm tỉnh/thành phố...',
    'personalInfo.ward': 'Phường/Xã',
    'personalInfo.ward.loading': 'Đang tải...',
    'personalInfo.ward.placeholder': 'Chọn phường/xã',
    'personalInfo.ward.placeholderNoProvince': 'Vui lòng chọn tỉnh/thành phố trước',
    'personalInfo.ward.searchPlaceholder': 'Tìm kiếm phường/xã...',
    'personalInfo.facebook': 'Facebook Cá Nhân (tùy chọn)',
    'personalInfo.facebook.placeholder': '@facebook-personal',

    // Professional Profile Step
    'professionalProfile.title': 'Hồ Sơ Nghề Nghiệp',
    'professionalProfile.educationLevel': 'Trình độ học vấn',
    'professionalProfile.educationLevel.placeholder': 'Chọn trình độ học vấn',
    'professionalProfile.employmentStatus': 'Tình trạng việc làm',
    'professionalProfile.employmentStatus.placeholder': 'Chọn tình trạng việc làm của bạn',
    'professionalProfile.monthlyIncome': 'Thu nhập hàng tháng',
    'professionalProfile.occupationType': 'Loại nghề nghiệp',
    'professionalProfile.occupationType.placeholder': 'Chọn loại nghề nghiệp',
    'professionalProfile.organizationType': 'Loại tổ chức',
    'professionalProfile.organizationType.placeholder': 'Chọn loại tổ chức',
    'professionalProfile.workProvince': 'Nơi làm việc - Tỉnh/Thành phố',
    'professionalProfile.workProvince.placeholder': 'Chọn tỉnh/thành phố nơi làm việc',
    'professionalProfile.workWard': 'Nơi làm việc - Phường/Xã',
    'professionalProfile.workWard.placeholder': 'Chọn phường/xã nơi làm việc',
    'professionalProfile.workWard.placeholderNoProvince': 'Vui lòng chọn tỉnh/thành phố trước',


    // Document Upload Step
    'documentUpload.title': 'Dữ Liệu Thay Thế',
    'documentUpload.description': 'Cung cấp dữ liệu thay thế để AI có thể đánh giá tín dụng một cách toàn diện và chính xác hơn.',
    'documentUpload.dragDrop': 'Kéo thả tệp hoặc nhấn để tải lên',
    'documentUpload.acceptedFormats': 'Chấp nhận: JSON, CSV, PDF, JPG, PNG. Tối đa 10MB.',
    'documentUpload.uploaded': 'Đã tải lên',
    // Alternative Data Categories
    'alternativeData.bills.title': 'Hóa Đơn & Chứng Từ',
    'alternativeData.bills.description': 'Hóa đơn điện, nước, internet, điện thoại, thuê nhà',
    'alternativeData.shopping.title': 'Lịch Sử Mua Sắm',
    'alternativeData.shopping.description': 'Giao dịch online, lịch sử đơn hàng, thói quen chi tiêu',
    'alternativeData.socialMedia.title': 'Mạng Xã Hội',
    'alternativeData.socialMedia.description': 'Dữ liệu Facebook, Instagram, TikTok, LinkedIn',
    'alternativeData.other.title': 'Tài Liệu Khác',
    'alternativeData.other.description': 'Bảng điểm, chứng chỉ, giấy tờ cá nhân, báo cáo y tế',

    // Personal Property Step
    'personalProperty.title': 'Thông Tin Tài Sản Cá Nhân',
    'personalProperty.ownsRealty': 'Bạn có sở hữu bất động sản không?',
    'personalProperty.ownsRealty.no': 'Không',
    'personalProperty.ownsRealty.yes': 'Có',
    'personalProperty.housingType': 'Loại hình nhà ở',
    'personalProperty.housingType.placeholder': 'Chọn loại hình nhà ở',
    'personalProperty.ownsVehicle': 'Bạn có sở hữu phương tiện di chuyển không? (ô tô hoặc xe máy)',
    'personalProperty.ownsVehicle.no': 'Không',
    'personalProperty.ownsVehicle.yes': 'Có',
    'personalProperty.vehicleAge': 'Phương tiện di chuyển của bạn đã sử dụng bao lâu? (tháng)',

    // Introduction Section
    'introduction.title': 'Đánh giá tín dụng AI',
    'introduction.subtitle': 'Hệ thống đánh giá tín dụng thông minh và chính xác',
    'introduction.description': 'Chúng tôi sử dụng trí tuệ nhân tạo tiên tiến để đánh giá điểm tín dụng của bạn một cách nhanh chóng, chính xác và công bằng. Quy trình đơn giản chỉ với 3 bước.',
    'introduction.features.title': 'Tính năng nổi bật',
    'introduction.features.ai': 'Đánh giá bằng AI tiên tiến',
    'introduction.features.fast': 'Kết quả nhanh chóng trong vài phút',
    'introduction.features.secure': 'Bảo mật thông tin tuyệt đối',
    'introduction.features.accurate': 'Độ chính xác cao với dữ liệu toàn diện',
    'introduction.button.start': 'Bắt đầu đánh giá',
    'introduction.steps.title': 'Quy trình đánh giá gồm 3 bước',
    'introduction.steps.personal': 'Thông tin cá nhân',
    'introduction.steps.propertyProfessional': 'Thông tin tài sản & nghề nghiệp',
    'introduction.steps.alternativeData': 'Dữ liệu thay thế',

    // Common
    'common.loading': 'Đang tải...',
    'common.searchPlaceholder': 'Tìm kiếm...',

    // Employment Status Options
    'employment.working': 'Đang làm việc',
    'employment.stateServant': 'Công chức nhà nước',
    'employment.commercialAssociate': 'Cộng tác viên thương mại',
    'employment.pensioner': 'Nghỉ hưu',
    'employment.unemployed': 'Thất nghiệp',
    'employment.student': 'Sinh viên',
    'employment.businessman': 'Doanh nhân',
    'employment.maternityLeave': 'Nghỉ thai sản',

    // Education Level Options
    'education.academicDegree': 'Bằng cử nhân',
    'education.higherEducation': 'Giáo dục đại học',
    'education.incompleteHigher': 'Đại học chưa hoàn thành',
    'education.lowerSecondary': 'Trung học cơ sở',
    'education.secondarySpecial': 'Trung học phổ thông / Trung cấp',

    // Occupation Options
    'occupation.accountants': 'Kế toán',
    'occupation.cleaningStaff': 'Nhân viên vệ sinh',
    'occupation.cookingStaff': 'Nhân viên bếp',
    'occupation.coreStaff': 'Nhân viên cốt cán',
    'occupation.drivers': 'Lái xe',
    'occupation.hrStaff': 'Nhân viên nhân sự',
    'occupation.highSkillTechStaff': 'Nhân viên kỹ thuật cao',
    'occupation.itStaff': 'Nhân viên IT',
    'occupation.laborers': 'Công nhân',
    'occupation.lowSkillLaborers': 'Công nhân phổ thông',
    'occupation.managers': 'Quản lý',
    'occupation.medicineStaff': 'Nhân viên y tế',
    'occupation.privateServiceStaff': 'Nhân viên dịch vụ tư nhân',
    'occupation.realtyAgents': 'Đại lý bất động sản',
    'occupation.salesStaff': 'Nhân viên bán hàng',
    'occupation.secretaries': 'Thư ký',
    'occupation.securityStaff': 'Nhân viên bảo vệ',
    'occupation.waitersBarmenStaff': 'Nhân viên phục vụ/Pha chế',

    // Organization Options
    'organization.selfEmployed': 'Tự kinh doanh',
    'organization.advertising': 'Quảng cáo',
    'organization.agriculture': 'Nông nghiệp',
    'organization.bank': 'Ngân hàng',
    'organization.businessEntityType1': 'Hợp danh / Công ty cổ phần',
    'organization.businessEntityType2': 'Doanh nghiệp tư nhân',
    'organization.businessEntityType3': 'Doanh nghiệp vừa và nhỏ / Công ty TNHH',
    'organization.cleaning': 'Vệ sinh',
    'organization.construction': 'Xây dựng',
    'organization.electricity': 'Điện lực',
    'organization.emergency': 'Cấp cứu',
    'organization.government': 'Chính phủ',
    'organization.hotel': 'Khách sạn',
    'organization.housing': 'Nhà ở',
    'organization.insurance': 'Bảo hiểm',
    'organization.kindergarten': 'Mẫu giáo',
    'organization.legalServices': 'Dịch vụ pháp lý',
    'organization.medicine': 'Y tế',
    'organization.military': 'Quân đội',
    'organization.mobile': 'Di động',
    'organization.police': 'Cảnh sát',
    'organization.postal': 'Bưu điện',
    'organization.realtor': 'Bất động sản',
    'organization.religion': 'Tôn giáo',
    'organization.restaurant': 'Nhà hàng',
    'organization.school': 'Trường học',
    'organization.university': 'Đại học',
    'organization.security': 'An ninh',
    'organization.securityMinistries': 'Bộ An ninh',
    'organization.services': 'Dịch vụ',
    'organization.telecom': 'Viễn thông',
    'organization.industryType1': 'Sản xuất',
    'organization.industryType2': 'Bất động sản',
    'organization.industryType3': 'Chăm sóc sức khỏe',
    'organization.industryType4': 'Thương mại bán sỉ và lẻ',
    'organization.industryType5': 'Dịch vụ ăn uống',
    'organization.industryType6': 'Dịch vụ chuyên nghiệp, khoa học và kỹ thuật',
    'organization.industryType7': 'Khách sạn',
    'organization.industryType8': 'Cung cấp nước và quản lý chất thải',
    'organization.industryType9': 'Dịch vụ hành chính và hỗ trợ',
    'organization.industryType10': 'Khai thác mỏ và đá',
    'organization.industryType11': 'Công nghệ thông tin',
    'organization.industryType12': 'Nghệ thuật và giải trí',
    'organization.industryType13': 'Tiện ích',
    'organization.tradeType1': 'Bán lẻ: Thực phẩm và đồ uống',
    'organization.tradeType2': 'Bán lẻ: Điện tử và thiết bị',
    'organization.tradeType3': 'Bán lẻ: Ô tô',
    'organization.tradeType4': 'Bán lẻ: Quần áo và dệt may',
    'organization.tradeType5': 'Bán lẻ: Khác',
    'organization.tradeType6': 'Bán sỉ: Hàng tiêu dùng',
    'organization.tradeType7': 'Bán sỉ: Nguyên liệu thô',
    'organization.transportType1': 'Vận tải: Vận tải đường bộ và xe tải',
    'organization.transportType2': 'Vận tải: Kho bãi và logistics',
    'organization.transportType3': 'Vận tải: Vận tải hành khách (Xe buýt, Tàu hỏa)',
    'organization.transportType4': 'Vận tải: Vận tải đường thủy và hàng không',
    'organization.xna': 'Không áp dụng / Nghỉ hưu',

    // Housing Type Options
    'housing.houseApartment': 'Nhà/Căn hộ',
    'housing.rentedApartment': 'Căn hộ thuê',
    'housing.withParents': 'Ở với bố mẹ',
    'housing.municipalApartment': 'Căn hộ dân cư',
    'housing.officeApartment': 'Căn hộ văn phòng',
    'housing.coopApartment': 'Căn hộ hợp tác xã',
  },
  en: {
    // Header
    'header.logout.confirm': 'Are you sure you want to logout?',
    'header.logout.error': 'An error occurred while logging out. Please try again.',
    'header.logout.loading': 'Logging out...',
    
    // Credit Score Results
    'creditScore.title': 'Your Credit Score',
    'creditScore.meaningTitle': 'What Your Score Means',
    'creditScore.strengths': 'Strengths',
    'creditScore.suggestions': 'Suggestions for Improvement',
    
    // Score labels
    'creditScore.lowRisk': 'Low Risk',
    'creditScore.mediumLowRisk': 'Medium Low Risk',
    'creditScore.mediumRisk': 'Medium Risk',
    'creditScore.highRisk': 'High Risk',
    
    // Static strengths
    'creditScore.strength.utilityPayments': 'Timely utility bill payments',
    'creditScore.strength.stableCareer': 'Stable career activity',
    'creditScore.strength.positiveCreditHistory': 'Positive credit history',
    
    // Static suggestions
    'creditScore.suggestion.linkBankAccount': 'Link your primary bank account for a more complete picture',
    'creditScore.suggestion.autoPayments': 'Set up automatic payments for regular bills',
    'creditScore.suggestion.buildIncomeHistory': 'Build stable income history through official channels',
    'creditScore.startNewForm': 'Start New Assessment',
    
    // Data Input Form
    'dataInputForm.title': 'AI Credit Assessment',
    'dataInputForm.step.personalInfo': 'Personal Information',
    'dataInputForm.step.personalPropertyAndProfessional': 'Property & Professional Information',
    'dataInputForm.step.financialDocuments': 'Alternative Data',
    'dataInputForm.stepCounter': 'Step {current} / {total}',
    'dataInputForm.button.back': 'Back',
    'dataInputForm.button.continue': 'Continue',
    'dataInputForm.button.complete': 'Complete',
    'dataInputForm.button.submitting': 'Processing...',

    // Personal Information Step
    'personalInfo.title': 'Personal Information',
    'personalInfo.fullName': 'Full Name',
    'personalInfo.fullName.placeholder': 'Enter your full name',
    'personalInfo.gender': 'Gender',
    'personalInfo.gender.male': 'Male',
    'personalInfo.gender.female': 'Female',
    'personalInfo.familyStatus': 'Family Status',
    'personalInfo.familyStatus.placeholder': 'Choose family status',
    'personalInfo.familyStatus.single': 'Single / not married',
    'personalInfo.familyStatus.married': 'Married',
    'personalInfo.familyStatus.civilMarriage': 'Civil marriage',
    'personalInfo.familyStatus.separated': 'Separated',
    'personalInfo.familyStatus.widow': 'Widow',
    'personalInfo.familyStatus.unknown': 'Unknown',
    'personalInfo.email': 'Email',
    'personalInfo.email.placeholder': 'Enter email address',
    'personalInfo.hasChildren': 'Do you have children?',
    'personalInfo.hasChildren.no': 'No',
    'personalInfo.hasChildren.yes': 'Yes',
    'personalInfo.numberOfChildren': 'Number of children',
    'personalInfo.dateOfBirth': 'Date of birth',
    'personalInfo.phoneNumber': 'Phone number',
    'personalInfo.phoneNumber.placeholder': 'Enter phone number',
    'personalInfo.province': 'Province/City',
    'personalInfo.province.loading': 'Loading...',
    'personalInfo.province.placeholder': 'Choose province/city',
    'personalInfo.province.searchPlaceholder': 'Search province/city...',
    'personalInfo.ward': 'Ward/Commune',
    'personalInfo.ward.loading': 'Loading...',
    'personalInfo.ward.placeholder': 'Choose ward/commune',
    'personalInfo.ward.placeholderNoProvince': 'Please choose province/city first',
    'personalInfo.ward.searchPlaceholder': 'Search ward/commune...',
    'personalInfo.facebook': 'Personal Facebook (optional)',
    'personalInfo.facebook.placeholder': '@facebook-personal',

    // Professional Profile Step
    'professionalProfile.title': 'Professional Profile',
    'professionalProfile.educationLevel': 'Education Level',
    'professionalProfile.educationLevel.placeholder': 'Choose education level',
    'professionalProfile.employmentStatus': 'Employment Status',
    'professionalProfile.employmentStatus.placeholder': 'Choose your employment status',
    'professionalProfile.monthlyIncome': 'Monthly Income',
    'professionalProfile.occupationType': 'Occupation Type',
    'professionalProfile.occupationType.placeholder': 'Choose occupation type',
    'professionalProfile.organizationType': 'Organization Type',
    'professionalProfile.organizationType.placeholder': 'Choose organization type',
    'professionalProfile.workProvince': 'Work Location - Province/City',
    'professionalProfile.workProvince.placeholder': 'Choose work province/city',
    'professionalProfile.workWard': 'Work Location - Ward/Commune',
    'professionalProfile.workWard.placeholder': 'Choose work ward/commune',
    'professionalProfile.workWard.placeholderNoProvince': 'Please choose province/city first',


    // Document Upload Step
    'documentUpload.title': 'Alternative Data',
    'documentUpload.description': 'Provide alternative data sources to help AI assess your creditworthiness more comprehensively and accurately.',
    'documentUpload.dragDrop': 'Drag and drop files or click to upload',
    'documentUpload.acceptedFormats': 'Accepts: JSON, CSV, PDF, JPG, PNG. Maximum 10MB.',
    'documentUpload.uploaded': 'Uploaded',
    // Alternative Data Categories
    'alternativeData.bills.title': 'Bills & Receipts',
    'alternativeData.bills.description': 'Utility bills, phone bills, internet, rent payments, receipts',
    'alternativeData.shopping.title': 'Shopping History',
    'alternativeData.shopping.description': 'Online transactions, order history, spending patterns',
    'alternativeData.socialMedia.title': 'Social Media',
    'alternativeData.socialMedia.description': 'Facebook, Instagram, TikTok, LinkedIn data exports',
    'alternativeData.other.title': 'Other Documents',
    'alternativeData.other.description': 'Report cards, certificates, personal documents, medical reports',

    // Personal Property Step
    'personalProperty.title': 'Personal Property Information',
    'personalProperty.ownsRealty': 'Do you own real estate?',
    'personalProperty.ownsRealty.no': 'No',
    'personalProperty.ownsRealty.yes': 'Yes',
    'personalProperty.housingType': 'Housing Type',
    'personalProperty.housingType.placeholder': 'Choose housing type',
    'personalProperty.ownsVehicle': 'Do you own a vehicle? (car or motorcycle)',
    'personalProperty.ownsVehicle.no': 'No',
    'personalProperty.ownsVehicle.yes': 'Yes',
    'personalProperty.vehicleAge': 'How long have you used your vehicle? (months)',

    // Introduction Section
    'introduction.title': 'AI Credit Assessment',
    'introduction.subtitle': 'Smart and accurate credit scoring system',
    'introduction.description': 'We use advanced artificial intelligence to assess your credit score quickly, accurately and fairly. Simple process with just 3 steps.',
    'introduction.features.title': 'Key Features',
    'introduction.features.ai': 'Advanced AI-powered assessment',
    'introduction.features.fast': 'Fast results in minutes',
    'introduction.features.secure': 'Absolute information security',
    'introduction.features.accurate': 'High accuracy with comprehensive data',
    'introduction.button.start': 'Start Assessment',
    'introduction.steps.title': '3-step assessment process',
    'introduction.steps.personal': 'Personal information',
    'introduction.steps.propertyProfessional': 'Property & professional information',
    'introduction.steps.alternativeData': 'Alternative data upload',

    // Common
    'common.loading': 'Loading...',
    'common.searchPlaceholder': 'Search...',

    // Employment Status Options
    'employment.working': 'Working',
    'employment.stateServant': 'State Servant',
    'employment.commercialAssociate': 'Commercial Associate',
    'employment.pensioner': 'Pensioner',
    'employment.unemployed': 'Unemployed',
    'employment.student': 'Student',
    'employment.businessman': 'Businessman',
    'employment.maternityLeave': 'Maternity Leave',

    // Education Level Options
    'education.academicDegree': 'Academic Degree',
    'education.higherEducation': 'Higher Education',
    'education.incompleteHigher': 'Incomplete Higher',
    'education.lowerSecondary': 'Lower Secondary',
    'education.secondarySpecial': 'Secondary / Secondary Special',

    // Occupation Options
    'occupation.accountants': 'Accountants',
    'occupation.cleaningStaff': 'Cleaning Staff',
    'occupation.cookingStaff': 'Cooking Staff',
    'occupation.coreStaff': 'Core Staff',
    'occupation.drivers': 'Drivers',
    'occupation.hrStaff': 'HR Staff',
    'occupation.highSkillTechStaff': 'High Skill Tech Staff',
    'occupation.itStaff': 'IT Staff',
    'occupation.laborers': 'Laborers',
    'occupation.lowSkillLaborers': 'Low-skill Laborers',
    'occupation.managers': 'Managers',
    'occupation.medicineStaff': 'Medicine Staff',
    'occupation.privateServiceStaff': 'Private Service Staff',
    'occupation.realtyAgents': 'Realty Agents',
    'occupation.salesStaff': 'Sales Staff',
    'occupation.secretaries': 'Secretaries',
    'occupation.securityStaff': 'Security Staff',
    'occupation.waitersBarmenStaff': 'Waiters/Barmen Staff',

    // Organization Options
    'organization.selfEmployed': 'Self-employed',
    'organization.advertising': 'Advertising',
    'organization.agriculture': 'Agriculture',
    'organization.bank': 'Bank',
    'organization.businessEntityType1': 'Partnership / Public Company',
    'organization.businessEntityType2': 'Sole Proprietorship',
    'organization.businessEntityType3': 'Small to Medium Enterprise / LLC',
    'organization.cleaning': 'Cleaning',
    'organization.construction': 'Construction',
    'organization.electricity': 'Electricity',
    'organization.emergency': 'Emergency',
    'organization.government': 'Government',
    'organization.hotel': 'Hotel',
    'organization.housing': 'Housing',
    'organization.insurance': 'Insurance',
    'organization.kindergarten': 'Kindergarten',
    'organization.legalServices': 'Legal Services',
    'organization.medicine': 'Medicine',
    'organization.military': 'Military',
    'organization.mobile': 'Mobile',
    'organization.police': 'Police',
    'organization.postal': 'Postal',
    'organization.realtor': 'Realtor',
    'organization.religion': 'Religion',
    'organization.restaurant': 'Restaurant',
    'organization.school': 'School',
    'organization.university': 'University',
    'organization.security': 'Security',
    'organization.securityMinistries': 'Security Ministries',
    'organization.services': 'Services',
    'organization.telecom': 'Telecom',
    'organization.industryType1': 'Manufacturing',
    'organization.industryType2': 'Real Estate',
    'organization.industryType3': 'Healthcare',
    'organization.industryType4': 'Wholesale & Retail Trade',
    'organization.industryType5': 'Food Services',
    'organization.industryType6': 'Professional, Scientific & Technical Services',
    'organization.industryType7': 'Hospitality',
    'organization.industryType8': 'Water Supply & Waste Management',
    'organization.industryType9': 'Administrative & Support Services',
    'organization.industryType10': 'Mining and Quarrying',
    'organization.industryType11': 'Information Technology',
    'organization.industryType12': 'Arts & Entertainment',
    'organization.industryType13': 'Utilities',
    'organization.tradeType1': 'Retail: Food & Beverage',
    'organization.tradeType2': 'Retail: Electronics & Appliances',
    'organization.tradeType3': 'Retail: Automotive',
    'organization.tradeType4': 'Retail: Clothing & Textiles',
    'organization.tradeType5': 'Retail: Other',
    'organization.tradeType6': 'Wholesale: Consumer Goods',
    'organization.tradeType7': 'Wholesale: Raw Materials',
    'organization.transportType1': 'Transport: Road Transport & Trucking',
    'organization.transportType2': 'Transport: Warehousing and Logistics',
    'organization.transportType3': 'Transport: Passenger Transport (Bus, Rail)',
    'organization.transportType4': 'Transport: Water & Air Transport',
    'organization.xna': 'Not Applicable / Retired',

    // Housing Type Options
    'housing.houseApartment': 'House/Apartment',
    'housing.rentedApartment': 'Rented Apartment',
    'housing.withParents': 'With Parents',
    'housing.municipalApartment': 'Municipal Apartment',
    'housing.officeApartment': 'Office Apartment',
    'housing.coopApartment': 'Co-op Apartment',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('vi');

  const t = (key: string, fallback?: string): string => {
    const translation = translations[language][key as keyof typeof translations['vi']];
    return translation || fallback || key;
  };

  // Helper function for string interpolation
  const interpolate = (template: string, values: Record<string, string | number>): string => {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
      return values[key]?.toString() || match;
    });
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, interpolate }}>
      {children}
    </LanguageContext.Provider>
  );
}; 