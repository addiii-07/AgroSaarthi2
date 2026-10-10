import { Language } from '../types';

// Multi-language agricultural dictionary and sentence translator
// Provides 100% full-DOM translation across letters, words, sentences, units, and numbers.

// Indic Numerals Map
export const NUMERAL_MAPS: Record<string, Record<string, string>> = {
  te: { '0': '౦', '1': '౧', '2': '౨', '3': '౩', '4': '౪', '5': '౫', '6': '౬', '7': '౭', '8': '౮', '9': '౯' },
  hi: { '0': '०', '1': '१', '2': '२', '3': '३', '4': '४', '5': '५', '6': '६', '7': '७', '8': '८', '9': '९' },
  mr: { '0': '०', '1': '१', '2': '२', '3': '३', '4': '४', '5': '५', '6': '६', '7': '७', '8': '८', '9': '९' },
  bn: { '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯' },
  gu: { '0': '૦', '1': '૧', '2': '૨', '3': '૩', '4': '૪', '5': '૫', '6': '૬', '7': '૭', '8': '૮', '9': '૯' },
  pa: { '0': '੦', '1': '੧', '2': '੨', '3': '੩', '4': '੪', '5': '੫', '6': '੬', '7': '੭', '8': '੮', '9': '੯' },
  or: { '0': '୦', '1': '୧', '2': '୨', '3': '୩', '4': '୪', '5': '୫', '6': '୬', '7': '୭', '8': '୮', '9': '୯' },
  ta: { '0': '0', '1': '௧', '2': '௨', '3': '௩', '4': '௪', '5': '௫', '6': '௬', '7': '௭', '8': '௮', '9': '௯' },
  kn: { '0': '೦', '1': '೧', '2': '೨', '3': '೩', '4': '೪', '5': '೫', '6': '೬', '7': '೭', '8': '೮', '9': '೯' },
  ml: { '0': '൦', '1': '൧', '2': '൨', '3': '൩', '4': '൪', '5': '൫', '6': '൬', '7': '൭', '8': '൮', '9': '൯' },
};

// Full sentence & phrase mappings
export const PHRASE_DICTIONARY: Record<Language, Record<string, string>> = {
  en: {},
  te: {
    // Branding & Core Headers
    'AgroSaarthi': 'అగ్రోసారథి',
    '2.0 AI Copilot': '2.0 AI వ్యవసాయ సలహాదారు',
    'Proactive Agricultural Decision Support System': 'క్రియాశీల వ్యవసాయ నిర్ణయ మద్దతు వేదిక',
    'AI-Powered Smart Agriculture Platform': 'AI ఆధారిత స్మార్ట్ వ్యవసాయ వేదిక',
    'Transparency, Reliability & Data Governance': 'పారదర్శకత, విశ్వసనీయత & డేటా పాలన',
    'No Hallucinated Data Guarantee': 'నిరూపిత సమాచార హామీ',
    'How AgroSaarthi eliminates hallucinations by anchoring every single recommendation to verified agricultural research, Doppler radar, and government APMC mandi feeds.':
      'అగ్రోసారథి ప్రతి సిఫారసును ICAR శాస్త్రీయ పరిశోధనలు, డాప్లర్ రాడార్ వాతావరణం మరియు ప్రభుత్వ APMC మార్కెట్ సమాచారంతో అనుసంధానిస్తుంది.',

    // Navigation Tabs & Labels
    'Home': 'హోమ్',
    'Dashboard': 'డాష్‌బోర్డ్',
    'My Farm': 'నా పొలం',
    'Farm Health': 'పొలం ఆరోగ్యం',
    'Market Advisor': 'మార్కెట్ సలహాదారు',
    'Weather Risk': 'వాతావరణ ముప్పు',
    'Crop Advisor': 'పంట సలహాదారు',
    'Govt Schemes': 'ప్రభుత్వ పథకాలు',
    'Government Schemes': 'ప్రభుత్వ పథకాలు',
    'Alerts': 'హెచ్చరికలు',
    'Ask Copilot': 'AI సలహాదారుని అడగండి',
    'Trust Center': 'విశ్వసనీయత కేంద్రం',
    'Backend Status': 'బ్యాకెండ్ స్థితి',
    'Profile (16 Fields)': 'రైతు ప్రొఫైల్ (16 వివరాలు)',
    'Farmer View': 'రైతు వీక్షణ',
    'Farmer Dashboard & Fields': 'రైతు డాష్‌బోర్డ్ & పొలాలు',
    'Government Officer': 'ప్రభుత్వ వ్యవసాయ అధికారి',
    'Admin Panel': 'అడ్మిన్ ప్యానెల్',
    'Switch Role': 'హోదా మార్చండి',
    'Farmer Mode': 'రైతు మోడ్',
    'Exit Farmer Mode': 'రైతు మోడ్ నుంచి నిష్క్రమించు',
    'Mobile View': 'మొబైల్ వీక్షణ',
    'Desktop View': 'డెస్క్‌టాప్ వీక్షణ',
    'Logout': 'లాగౌట్',
    'Login': 'లాగిన్',
    'Register': 'రిజిస్టర్',

    // Crops & Varieties
    'Tomato': 'టమోటా',
    'Chilli': 'మిర్చి',
    'Paddy (Rice)': 'వరి (వరి బియ్యం)',
    'Paddy': 'వరి',
    'Rice': 'వరి',
    'Cotton': 'పత్తి',
    'Maize': 'మొక్కజొన్న',
    'Sugarcane': 'చెరకు',
    'Groundnut': 'వేరుశనగ',
    'Bengal Gram': 'శనగలు',
    'Turmeric': 'పసుపు',
    'Red Gram': 'కందులు',
    'Mango': 'మామిడి',
    'Tobacco': 'పొగాకు',
    'Wheat': 'గోధుమలు',
    'Onion': 'ఉల్లిపాయ',
    'Potato': 'బంగాళాదుంప',
    'Soybean': 'సోయాబీన్',
    'Teja (S17)': 'తేజ (S17)',
    'Guntur Sanam (S4)': 'గుంటూరు సన్నం (S4)',
    'Arka Rakshak': 'అర్క రక్షక్',
    'BPT 5204 (Samba Mahsuri)': 'BPT 5204 (సాంబ మసూరి)',
    'Bt Cotton Bollgard II': 'బీటీ కాటన్ బోల్‌గార్డ్ II',

    // Farm Details & Status
    'Acreage': 'విస్తీర్ణం',
    'Acres': 'ఎకరాలు',
    'Acre': 'ఎకరం',
    'Soil Type': 'నేల రకం',
    'Irrigation': 'నీటిపారుదల',
    'Sowing Date': 'విత్తిన తేదీ',
    'Growth Stage': 'ఎదుగుదల దశ',
    'Current Stage': 'ప్రస్తుత దశ',
    'Crop Health': 'పంట ఆరోగ్యం',
    'Healthy & Flourishing': 'ఆరోగ్యంగా & చక్కగా ఉంది',
    'Good': 'మంచిది',
    'Moderate': 'మధ్యస్థం',
    'Severe': 'తీవ్రమైనది',
    'Mild': 'స్వల్పం',
    'Normal': 'సాధారణం',
    'Black Soil': 'నల్లరేగడి నేల',
    'Black Soil (Regur)': 'నల్లరేగడి నేల (రెగూర్)',
    'Red Soil': 'ఎర్ర నేల',
    'Red Soil (Sandy/Clay Loam)': 'ఎర్ర నేల (ఇసుక/బంకమట్టి)',
    'Drip Irrigation': 'డ్రిప్ బిందు సేద్యం',
    'Sprinkler Irrigation': 'స్ప్రింక్లర్ సేద్యం',
    'Canal / Borewell': 'కాలువ / బోరుబావి',
    'Rainfed (Dryland)': 'వర్షాధారం (మెట్ట భూమి)',
    'Vegetative Growth (15-45 days)': 'శాఖీయ ఎదుగుదల (15-45 రోజులు)',
    'Flowering & Budding (45-75 days)': 'పూత & మొగ్గ దశ (45-75 రోజులు)',
    'Fruit / Pod / Grain Formation (75-105 days)': 'కాయ / గింజల తయారీ దశ (75-105 రోజులు)',
    'Harvesting (Ready to pick/cut)': 'కోత దశ (కోతకు సిద్ధం)',

    // Weather Terms
    'Weather': 'వాతావరణం',
    'Temperature': 'ఉష్ణోగ్రత',
    'Humidity': 'తేమ శాతం',
    'Wind Speed': 'గాలి వేగం',
    'Rainfall': 'వర్షపాతం',
    'Rain Prediction': 'వర్ష సూచన',
    'Rain Probability': 'వర్ష సంభావ్యత',
    'Doppler Radar': 'డాప్లర్ రాడార్',
    'Clear': 'నిర్మలమైన ఆకాశం',
    'Clear Sky': 'నిర్మల ఆకాశం',
    'Sunny': 'ఎండగా ఉంది',
    'Partly Cloudy': 'పాక్షిక మేఘావృతం',
    'Cloudy': 'మేఘావృతం',
    'Scattered Clouds': 'చెదురుమదురు మేఘాలు',
    'Light Rain': 'తేలికపాటి వర్షం',
    'Moderate Rain': 'మోస్తరు వర్షం',
    'Heavy Rain': 'భారీ వర్షం',
    'Thunderstorm': 'ఉరుములతో కూడిన వర్షం',
    'Hyderabad': 'హైదరాబాద్',
    'Rangareddy': 'రంగారెడ్డి',
    'Guntur': 'గుంటూరు',
    'Warangal': 'వరంగల్',
    'Khammam': 'ఖమ్మం',
    'Karimnagar': 'కరీంనగర్',
    'Nizamabad': 'నిజామాబాద్',
    'Kurnool': 'కర్నూలు',
    'Vijayawada': 'విజయవాడ',
    'Anantapur': 'అనంతపురం',

    // Market Terms
    'Market Prices': 'మార్కెట్ ధరలు',
    'Mandi Rates': 'మండి ధరలు',
    'Mandi': 'మండి',
    'Wholesale Price': 'హోల్‌సేల్ ధర',
    'Modal Price': 'సగటు ధర (మోడల్)',
    'Min Price': 'కనిష్ట ధర',
    'Max Price': 'గరిష్ట ధర',
    'Arrivals': 'మార్కెట్ రాక',
    'Quintal': 'క్వింటాల్',
    '₹/Quintal': '₹/క్వింటాల్',
    'Price Trend': 'ధరల సరళి',
    'Rising': 'పెరుగుతోంది',
    'Falling': 'తగ్గుతోంది',
    'Stable': 'స్థిరంగా ఉంది',
    'Demand': 'గిరాకీ',
    'High Demand': 'అధిక గిరాకీ',
    'Medium Demand': 'మోస్తరు గిరాకీ',
    'Low Demand': 'తక్కువ గిరాకీ',
    'Sell Recommendation': 'అమ్మకపు సలహా',
    'Hold & Wait': 'నిల్వ చేసి ఆగండి',
    'Sell Now': 'వెంటనే అమ్మండి',
    'Guntur Mirchi Yard (Asia’s Largest)': 'గుంటూరు మిర్చి యార్డ్ (ఆసియాలోనే అతిపెద్దది)',
    'Live mandi prices are temporarily unavailable from the government data API':
      'ప్రభుత్వ డేటా API నుండి లైవ్ మండి ధరలు తాత్కాలికంగా అందుబాటులో లేవు',

    // Schemes & Claims
    'PM-KISAN Samman Nidhi': 'పీఎం-కిసాన్ సమ్మాన్ నిధి',
    'Pradhan Mantri Fasal Bima Yojana (PMFBY)': 'ప్రధాన మంత్రి ఫసల్ బీమా యోజన (PMFBY)',
    'Rythu Bandhu': 'రైతు బంధు',
    'Telangana Micro-Irrigation Project (TSMIP)': 'తెలంగాణ సూక్ష్మ నీటిపారుదల ప్రాజెక్ట్ (TSMIP)',
    'Eligible': 'అర్హత ఉంది',
    'Apply Now': 'దరఖాస్తు చేసుకోండి',
    'Application Submitted': 'దరఖాస్తు సమర్పించబడింది',
    'Claim Status': 'క్లెయిమ్ స్థితి',
    'Subsidy': 'సబ్సిడీ',
    'Documents Required': 'కావలసిన పత్రాలు',
    'Aadhaar Card': 'ఆధార్ కార్డు',
    'Pattadar Passbook': 'పట్టాదారు పాస్ బుక్',
    'Bank Account Details': 'బ్యాంకు ఖాతా వివరాలు',

    // Common Actions, Verbs & Buttons
    'Submit': 'సమర్పించండి',
    'Save': 'భద్రపరచండి',
    'Cancel': 'రద్దు చేయండి',
    'Close': 'మూసివేయండి',
    'Edit': 'సవరించండి',
    'Update': 'నవీకరించండి',
    'Refresh': 'రిఫ్రెష్ చేయండి',
    'Search': 'వెతకండి',
    'Search...': 'వెతకండి...',
    'Filter': 'ఫిల్టర్',
    'View Details': 'వివరాలు చూడండి',
    'Read More': 'మరింత చదవండి',
    'Download': 'డౌన్‌లోడ్',
    'Download PDF': 'PDF డౌన్‌లోడ్ చేయండి',
    'Upload Photo': 'ఫోటో అప్‌లోడ్ చేయండి',
    'Take Photo': 'ఫోటో తీయండి',
    'Analyze Leaf': 'ఆకును విశ్లేషించండి',
    'Diagnosis': 'వ్యాధి నిర్ధారణ',
    'Treatment': 'నివారణ చర్యలు',
    'Chemical Treatment': 'రసాయన నివారణ',
    'Organic Treatment': 'సేంద్రీయ నివారణ',
    'Dosage': 'మోతాదు',
    'Confidence': 'ఖచ్చితత్వం',
    'High': 'అధికం',
    'Low': 'తక్కువ',
    'Medium': 'మధ్యస్థం',
    'Urgent': 'అత్యవసరం',
    'Advisory': 'వ్యవసాయ సలహా',
    'Action Required': 'చర్య అవసరం',
    'Days': 'రోజులు',
    'Day': 'రోజు',
    'Hours': 'గంటలు',
    'Hour': 'గంట',
    'Today': 'ఈరోజు',
    'Tomorrow': 'రేపు',
    'Yesterday': 'నిన్న',
    'Weekly Forecast': 'వారపు వాతావరణ అంచనా',
    'Language': 'భాష',
    'English': 'ఆంగ్లం',
    'Telugu': 'తెలుగు',
    'Hindi': 'హిందీ',
    'Tamil': 'తమిళం',
    'Kannada': 'కన్నడ',
    'Marathi': 'మరాఠీ',
    'Bengali': 'బెంగాలీ',
    'Gujarati': 'గుజరాతీ',
    'Punjabi': 'పంజాబీ',
    'Odia': 'ఒడియా',
    'Malayalam': 'మలయాళం',
  },
  hi: {
    'AgroSaarthi': 'एग्रोसारथी',
    '2.0 AI Copilot': '2.0 AI कृषि साथी',
    'Proactive Agricultural Decision Support System': 'सक्रिय कृषि निर्णय सहायता प्रणाली',
    'AI-Powered Smart Agriculture Platform': 'AI-संचालित स्मार्ट कृषि प्लेटफॉर्म',
    'Transparency, Reliability & Data Governance': 'पारदर्शिता, विश्वसनीयता और डेटा प्रशासन',
    'No Hallucinated Data Guarantee': 'सत्यापित डेटा की गारंटी',
    'Home': 'होम',
    'Dashboard': 'डैशबोर्ड',
    'My Farm': 'मेरा खेत',
    'Farm Health': 'खेत का स्वास्थ्य',
    'Market Advisor': 'मंडी सलाहकार',
    'Weather Risk': 'मौसम जोखिम',
    'Crop Advisor': 'फसल सलाहकार',
    'Govt Schemes': 'सरकारी योजनाएं',
    'Government Schemes': 'सरकारी योजनाएं',
    'Alerts': 'चेतावनियाँ',
    'Ask Copilot': 'AI से पूछें',
    'Trust Center': 'भरोसा केंद्र',
    'Backend Status': 'बैकएंड स्थिति',
    'Profile (16 Fields)': 'किसान प्रोफाइल (16 विवरण)',
    'Farmer View': 'किसान व्यू',
    'Farmer Dashboard & Fields': 'किसान डैशबोर्ड और खेत',
    'Government Officer': 'कृषि अधिकारी',
    'Admin Panel': 'एडमिन पैनल',
    'Switch Role': 'भूमिका बदलें',
    'Farmer Mode': 'किसान मोड',
    'Exit Farmer Mode': 'किसान मोड से बाहर निकलें',
    'Mobile View': 'मोबाइल व्यू',
    'Desktop View': 'डेस्कटॉप व्यू',
    'Logout': 'लॉग आउट',
    'Login': 'लॉग इन',
    'Register': 'पंजीकरण',
    'Tomato': 'टमाटर',
    'Chilli': 'मिर्च',
    'Paddy (Rice)': 'धान (चावल)',
    'Paddy': 'धान',
    'Rice': 'चावल',
    'Cotton': 'कपास',
    'Maize': 'मक्का',
    'Sugarcane': 'गन्ना',
    'Groundnut': 'मूंगफली',
    'Wheat': 'गेहूं',
    'Onion': 'प्याज',
    'Potato': 'आलू',
    'Soybean': 'सोयाबीन',
    'Acres': 'एकड़',
    'Acre': 'एकड़',
    'Weather': 'मौसम',
    'Temperature': 'तापमान',
    'Humidity': 'आर्द्रता (नमी)',
    'Wind Speed': 'हवा की गति',
    'Rainfall': 'वर्षा',
    'Rain Prediction': 'बारिश का अनुमान',
    'Sunny': 'धूप',
    'Cloudy': 'बादल',
    'Partly Cloudy': 'आंशिक बादल',
    'Clear': 'साफ आसमान',
    'Light Rain': 'हल्की बारिश',
    'Heavy Rain': 'भारी बारिश',
    'Market Prices': 'मंडी भाव',
    'Mandi Rates': 'मंडी दरें',
    'Modal Price': 'औसत भाव',
    'Min Price': 'न्यूनतम भाव',
    'Max Price': 'अधिकतम भाव',
    'Quintal': 'क्विंटल',
    '₹/Quintal': '₹/क्विंटल',
    'Eligible': 'पात्र',
    'Apply Now': 'आवेदन करें',
    'Submit': 'जमा करें',
    'Save': 'सहेजें',
    'Cancel': 'रद्द करें',
    'Close': 'बंद करें',
    'Edit': 'संपादित करें',
    'Search': 'खोजें',
    'View Details': 'विवरण देखें',
    'Days': 'दिन',
    'Hours': 'घंटे',
    'Today': 'आज',
    'Tomorrow': 'कल',
  },
  ta: {
    'AgroSaarthi': 'அக்ரோசாரதி',
    'Home': 'முகப்பு',
    'Dashboard': 'டாஷ்போர்டு',
    'My Farm': 'எனது பண்ணை',
    'Farm Health': 'பண்ணை ஆரோக்கியம்',
    'Market Advisor': 'சந்தை ஆலோசகர்',
    'Weather Risk': 'வானிலை அபாயம்',
    'Crop Advisor': 'பயிர் ஆலோசகர்',
    'Govt Schemes': 'அரசு திட்டங்கள்',
    'Alerts': 'எச்சரிக்கைகள்',
    'Ask Copilot': 'AI உடன் கேளுங்கள்',
    'Trust Center': 'நம்பகத்தன்மை மையம்',
    'Backend Status': 'பின்னணி நிலை',
    'Profile (16 Fields)': 'விவசாயி விவரக்குறிப்பு',
    'Farmer View': 'விவசாயி பார்வை',
    'Tomato': 'தக்காளி',
    'Chilli': 'மிளகாய்',
    'Paddy (Rice)': 'நெல்',
    'Cotton': 'பருத்தி',
    'Weather': 'வானிலை',
    'Temperature': 'வெப்பநிலை',
    'Humidity': 'ஈரப்பதம்',
    'Wind Speed': 'காற்றின் வேகம்',
    'Market Prices': 'சந்தை விலைகள்',
    'Modal Price': 'சராசரி விலை',
    'Quintal': 'குவிண்டால்',
    'Acres': 'ஏக்கர்',
    'Apply Now': 'விண்ணப்பிக்கவும்',
    'Submit': 'சமர்ப்பிக்கவும்',
    'View Details': 'விவரங்களைக் காண்க',
    'Today': 'இன்று',
  },
  kn: {
    'AgroSaarthi': 'ಅಗ್ರೋಸಾರಥಿ',
    'Home': 'ಮುಖಪುಟ',
    'Dashboard': 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    'My Farm': 'ನನ್ನ ಜಮೀನು',
    'Farm Health': 'ಬೆಳೆ ಆರೋಗ್ಯ',
    'Market Advisor': 'ಮಾರುಕಟ್ಟೆ ಸಲಹೆಗಾರ',
    'Weather Risk': 'ಹವಾಮಾನ ಅಪಾಯ',
    'Crop Advisor': 'ಬೆಳೆ ಸಲಹೆಗಾರ',
    'Govt Schemes': 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು',
    'Alerts': 'ಎಚ್ಚರಿಕೆಗಳು',
    'Ask Copilot': 'AI ಕೇಳಿ',
    'Trust Center': 'ವಿಶ್ವಾಸಾರ್ಹತೆ ಕೇಂದ್ರ',
    'Backend Status': 'ಬ್ಯಾಕೆಂಡ್ ಸ್ಥಿತಿ',
    'Profile (16 Fields)': 'ರೈತರ ಪ್ರೊಫೈಲ್',
    'Farmer View': 'ರೈತ ನೋಟ',
    'Tomato': 'ಟೊಮೆಟೊ',
    'Chilli': 'ಮೆಣಸಿನಕಾಯಿ',
    'Paddy (Rice)': 'ಭತ್ತ',
    'Cotton': 'ಹತ್ತಿ',
    'Weather': 'ಹವಾಮಾನ',
    'Temperature': 'ತಾಪಮಾನ',
    'Humidity': 'ತೇವಾಂಶ',
    'Wind Speed': 'ಗಾಳಿಯ ವೇಗ',
    'Market Prices': 'ಮಾರುಕಟ್ಟೆ ದರ',
    'Modal Price': 'ಮಾದರಿ ದರ',
    'Quintal': 'ಕ್ವಿಂಟಾಲ್',
    'Acres': 'ಎಕರೆ',
    'Apply Now': 'ಈಗಲೇ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
    'Submit': 'ಸಲ್ಲಿಸಿ',
    'View Details': 'ವಿವರ ನೋಡಿ',
    'Today': 'ಇಂದು',
  },
  mr: {
    'AgroSaarthi': 'ॲग्रोसारथी',
    'Home': 'मुख्यपृष्ठ',
    'Dashboard': 'डॅशबोर्ड',
    'My Farm': 'माझे शेत',
    'Farm Health': 'पीक आरोग्य',
    'Market Advisor': 'बाजार सल्लागार',
    'Weather Risk': 'हवामान जोखीम',
    'Crop Advisor': 'पीक सल्लागार',
    'Govt Schemes': 'शासकीय योजना',
    'Alerts': 'सूचना',
    'Ask Copilot': 'AI ला विचारा',
    'Trust Center': 'विश्वास केंद्र',
    'Backend Status': 'बॅकएंड स्थिती',
    'Farmer View': 'शेतकरी व्ह्यू',
    'Tomato': 'टोमॅटो',
    'Chilli': 'मिरची',
    'Paddy (Rice)': 'भात (तांदूळ)',
    'Cotton': 'कापूस',
    'Weather': 'हवामान',
    'Temperature': 'तापमान',
    'Humidity': 'आर्द्रता',
    'Wind Speed': 'वाऱ्याचा वेग',
    'Market Prices': 'बाजार भाव',
    'Modal Price': 'सरासरी भाव',
    'Quintal': 'क्विंटल',
    'Acres': 'एकर',
    'Apply Now': 'अर्ज करा',
    'Submit': 'सादर करा',
    'View Details': 'तपशील पहा',
    'Today': 'आज',
  },
  bn: {
    'AgroSaarthi': 'এগ্রোসারথি',
    'Home': 'হোম',
    'Dashboard': 'ড্যাশবোর্ড',
    'My Farm': 'আমার খামার',
    'Farm Health': 'ফসলের স্বাস্থ্য',
    'Market Advisor': 'বাজার উপদেষ্টা',
    'Weather Risk': 'আবহাওয়ার ঝুঁকি',
    'Crop Advisor': 'ফসল উপদেষ্টা',
    'Govt Schemes': 'সরকারি প্রকল্প',
    'Alerts': 'সতর্কতা',
    'Tomato': 'টমেটো',
    'Chilli': 'লঙ্কা',
    'Paddy (Rice)': 'ধান',
    'Cotton': 'তুলা',
    'Weather': 'আবহাওয়া',
    'Temperature': 'তাপমাত্রা',
    'Humidity': 'আর্দ্রতা',
    'Market Prices': 'বাজার দর',
    'Modal Price': 'গড় দর',
    'Quintal': 'কুইন্টাল',
    'Acres': 'একর',
    'Apply Now': 'আবেদন করুন',
    'Submit': 'জমা দিন',
    'Today': 'আজ',
  },
  gu: {
    'AgroSaarthi': 'એગ્રોસારથી',
    'Home': 'હોમ',
    'Dashboard': 'ડેશબોર્ડ',
    'My Farm': 'મારું ખેતર',
    'Farm Health': 'પાક સ્વાસ્થ્ય',
    'Market Advisor': 'બજાર સલાહકાર',
    'Weather Risk': 'હવામાન જોખમ',
    'Crop Advisor': 'પાક સલાહકાર',
    'Govt Schemes': 'સરકારી યોજનાઓ',
    'Alerts': 'ચેતવણીઓ',
    'Tomato': 'ટામેટા',
    'Chilli': 'મરચાં',
    'Paddy (Rice)': 'ડાંગર',
    'Cotton': 'કપાસ',
    'Weather': 'હવામાન',
    'Temperature': 'તાપમાન',
    'Humidity': 'ભેજ',
    'Market Prices': 'બજાર ભાવ',
    'Modal Price': 'સરેરાશ ભાવ',
    'Quintal': 'ક્વિન્ટલ',
    'Acres': 'એકર',
    'Apply Now': 'અરજી કરો',
    'Submit': 'સબમિટ કરો',
    'Today': 'આજે',
  },
  pa: {
    'AgroSaarthi': 'ਐਗਰੋਸਾਰਥੀ',
    'Home': 'ਮੁੱਖ ਪੰਨਾ',
    'Dashboard': 'ਡੈਸ਼ਬੋਰਡ',
    'My Farm': 'ਮੇਰਾ ਖੇਤ',
    'Farm Health': 'ਫ਼ਸਲ ਦੀ ਸਿਹਤ',
    'Market Advisor': 'ਮੰਡੀ ਸਲਾਹਕਾਰ',
    'Weather Risk': 'ਮੌਸਮ ਦਾ ਖਤਰਾ',
    'Crop Advisor': 'ਫ਼ਸਲ ਸਲਾਹਕਾਰ',
    'Govt Schemes': 'ਸਰਕਾਰੀ ਸਕੀਮਾਂ',
    'Alerts': 'ਚੇਤਾਵਨੀਆਂ',
    'Tomato': 'ਟਮਾਟਰ',
    'Chilli': 'ਮਿਰਚ',
    'Paddy (Rice)': 'ਝੋਨਾ',
    'Cotton': 'ਨਰਮਾ/ਕਪਾਹ',
    'Weather': 'ਮੌਸਮ',
    'Temperature': 'ਤਾਪਮਾਨ',
    'Humidity': 'ਨਮੀ',
    'Market Prices': 'ਮੰਡੀ ਦੇ ਭਾਅ',
    'Modal Price': 'ਔਸਤ ਭਾਅ',
    'Quintal': 'ਕੁਇੰਟਲ',
    'Acres': 'ਏਕੜ',
    'Apply Now': 'ਅਰਜ਼ੀ ਦਿਓ',
    'Submit': 'ਜਮ੍ਹਾਂ ਕਰੋ',
    'Today': 'ਅੱਜ',
  },
  or: {
    'AgroSaarthi': 'ଏଗ୍ରୋସାରଥି',
    'Home': 'ମୁଖ୍ୟ ପୃଷ୍ଠା',
    'Dashboard': 'ଡ୍ୟାସବୋର୍ଡ',
    'My Farm': 'ମୋ ଜମି',
    'Farm Health': 'ଫସଲ ସ୍ୱାସ୍ଥ୍ୟ',
    'Market Advisor': 'ବଜାର ପରାମର୍ଶଦାତା',
    'Weather Risk': 'ପାଣିପାଗ ବିପଦ',
    'Crop Advisor': 'ଫସଲ ପରାମର୍ଶଦାତା',
    'Govt Schemes': 'ସରକାରୀ ଯୋଜନା',
    'Alerts': 'ସତର୍କତା',
    'Tomato': 'ଟମାଟୋ',
    'Chilli': 'ଲଙ୍କା',
    'Paddy (Rice)': 'ଧାନ',
    'Cotton': 'କପା',
    'Weather': 'ପାଣିପାଗ',
    'Temperature': 'ତାପମାତ୍ରା',
    'Humidity': 'ଆର୍ଦ୍ରତା',
    'Market Prices': 'ମଣ୍ଡି ଦର',
    'Modal Price': 'ମଧ୍ୟମ ଦର',
    'Quintal': 'କ୍ୱିଣ୍ଟାଲ',
    'Acres': 'ଏକର',
    'Apply Now': 'ଆବେଦନ କରନ୍ତୁ',
    'Submit': 'ଦାଖଲ କରନ୍ତୁ',
    'Today': 'ଆଜି',
  },
  ml: {
    'AgroSaarthi': 'അഗ്രോസാരഥി',
    'Home': 'ഹോം',
    'Dashboard': 'ഡാഷ്‌ബോർഡ്',
    'My Farm': 'എന്റെ കൃഷിയിടം',
    'Farm Health': 'വിള ആരോഗ്യം',
    'Market Advisor': 'വിപണി ഉപദേഷ്ടാവ്',
    'Weather Risk': 'കാലാവസ്ഥാ മുന്നറിയിപ്പ്',
    'Crop Advisor': 'വിള ഉപദേഷ്ടാവ്',
    'Govt Schemes': 'സർക്കാർ പദ്ധതികൾ',
    'Alerts': 'മുന്നറിയിപ്പുകൾ',
    'Tomato': 'തക്കാളി',
    'Chilli': 'മുളക്',
    'Paddy (Rice)': 'നെല്ല്',
    'Cotton': 'പരുത്തി',
    'Weather': 'കാലാവസ്ഥ',
    'Temperature': 'താപനില',
    'Humidity': 'ഈർപ്പം',
    'Market Prices': 'വിപണി വില',
    'Modal Price': 'ശരാശരി വില',
    'Quintal': 'ക്വിന്റൽ',
    'Acres': 'ഏക്കർ',
    'Apply Now': 'അപേക്ഷിക്കുക',
    'Submit': 'സമർപ്പിക്കുക',
    'Today': 'ഇന്ന്',
  },
};

// Common single words to match inside sentences (case-insensitive)
export const WORD_DICTIONARY: Record<Language, Record<string, string>> = {
  en: {},
  te: {
    'farmer': 'రైతు',
    'farmers': 'రైతులు',
    'crop': 'పంట',
    'crops': 'పంటలు',
    'field': 'పొలం',
    'fields': 'పొలాలు',
    'farm': 'పొలం',
    'village': 'గ్రామం',
    'district': 'జిల్లా',
    'state': 'రాష్ట్రం',
    'irrigation': 'నీటిపారుదల',
    'soil': 'నేల',
    'water': 'నీరు',
    'fertilizer': 'ఎరువు',
    'fertilizers': 'ఎరువులు',
    'pesticide': 'పురుగుమందు',
    'pesticides': 'పురుగుమందులు',
    'yield': 'దిగుబడి',
    'profit': 'లాభం',
    'price': 'ధర',
    'prices': 'ధరలు',
    'market': 'మార్కెట్',
    'mandi': 'మండి',
    'weather': 'వాతావరణం',
    'rain': 'వర్షం',
    'wind': 'గాలి',
    'temperature': 'ఉష్ణోగ్రత',
    'humidity': 'తేమ',
    'advisory': 'సలహా',
    'recommendation': 'సిఫారసు',
    'alert': 'హెచ్చరిక',
    'alerts': 'హెచ్చరికలు',
    'warning': 'హెచ్చరిక',
    'scheme': 'పథకం',
    'schemes': 'పథకాలు',
    'insurance': 'భీమా',
    'claim': 'క్లెయిమ్',
    'claims': 'క్లెయిమ్‌లు',
    'status': 'స్థితి',
    'active': 'క్రియాశీలకంగా ఉంది',
    'pending': 'పెండింగ్‌లో ఉంది',
    'approved': 'ఆమోదించబడింది',
    'rejected': 'తిరస్కరించబడింది',
    'low': 'తక్కువ',
    'high': 'అధికం',
    'moderate': 'మోస్తరు',
    'healthy': 'ఆరోగ్యంగా ఉంది',
    'risk': 'ముప్పు',
    'danger': 'ప్రమాదం',
    'safe': 'సురక్షితం',
    'days': 'రోజులు',
    'hours': 'గంటలు',
    'today': 'ఈరోజు',
    'yesterday': 'నిన్న',
    'tomorrow': 'రేపు',
    'acres': 'ఎకరాలు',
    'acre': 'ఎకరం',
    'quintal': 'క్వింటాల్',
    'quintals': 'క్వింటాళ్లు',
    'rupees': 'రూపాయలు',
    'doctor': 'వైద్యుడు',
    'expert': 'నిపుణుడు',
    'officer': 'అధికారి',
    'admin': 'అడ్మిన్',
    'search': 'వెతకండి',
    'submit': 'సమర్పించండి',
    'apply': 'దరఖాస్తు',
    'download': 'డౌన్‌లోడ్',
    'upload': 'అప్‌లోడ్',
    'verified': 'ధృవీకరించబడింది',
    'official': 'అధికారిక',
    'live': 'ప్రత్యక్ష',
    'connected': 'అనుసంధానమైంది',
    'ready': 'సిద్ధంగా ఉంది',
    'error': 'లోపం',
    'warning:': 'హెచ్చరిక:',
    'note:': 'గమనిక:',
  },
  hi: {
    'farmer': 'किसान',
    'farmers': 'किसान',
    'crop': 'फसल',
    'crops': 'फसलें',
    'field': 'खेत',
    'fields': 'खेत',
    'farm': 'खेत',
    'village': 'गांव',
    'district': 'जिला',
    'state': 'राज्य',
    'irrigation': 'सिंचाई',
    'soil': 'मिट्टी',
    'water': 'पानी',
    'fertilizer': 'उर्वरक/खाद',
    'pesticide': 'कीटनाशक',
    'yield': 'उपज',
    'profit': 'लाभ',
    'price': 'भाव/दाम',
    'prices': 'भाव',
    'market': 'मंडी',
    'mandi': 'मंडी',
    'weather': 'मौसम',
    'rain': 'बारिश',
    'wind': 'हवा',
    'temperature': 'तापमान',
    'humidity': 'नमी',
    'advisory': 'सलाह',
    'alert': 'चेतावनी',
    'scheme': 'योजना',
    'schemes': 'योजनाएं',
    'insurance': 'बीमा',
    'status': 'स्थिति',
    'active': 'सक्रिय',
    'pending': 'लंबित',
    'approved': 'स्वीकृत',
    'low': 'कम',
    'high': 'उच्च',
    'healthy': 'स्वस्थ',
    'risk': 'जोखिम',
    'acres': 'एकड़',
    'quintal': 'क्विंटल',
    'today': 'आज',
    'tomorrow': 'कल',
  },
  ta: {
    'farmer': 'விவசாயி',
    'farmers': 'விவசாயிகள்',
    'crop': 'பயிர்',
    'crops': 'பயிர்கள்',
    'field': 'பண்ணை',
    'village': 'கிராமம்',
    'district': 'மாவட்டம்',
    'irrigation': 'நீர்ப்பாசனம்',
    'soil': 'மண்',
    'water': 'தண்ணீர்',
    'yield': 'விளைச்சல்',
    'price': 'விலை',
    'market': 'சந்தை',
    'weather': 'வானிலை',
    'rain': 'மழை',
    'temperature': 'வெப்பநிலை',
    'alert': 'எச்சரிக்கை',
    'scheme': 'திட்டம்',
    'insurance': 'காப்பீடு',
    'status': 'நிலை',
    'today': 'இன்று',
  },
  kn: {
    'farmer': 'ರೈತ',
    'farmers': 'ರೈತರು',
    'crop': 'ಬೆಳೆ',
    'crops': 'ಬೆಳೆಗಳು',
    'field': 'ಜಮೀನು',
    'village': 'ಗ್ರಾಮ',
    'district': 'ಜಿಲ್ಲೆ',
    'irrigation': 'ನೀರಾವರಿ',
    'soil': 'ಮಣ್ಣು',
    'water': 'ನೀರು',
    'yield': 'ಇಳುವರಿ',
    'price': 'ದರ',
    'market': 'ಮಾರುಕಟ್ಟೆ',
    'weather': 'ಹವಾಮಾನ',
    'rain': 'ಮಳೆ',
    'temperature': 'ತಾಪಮಾನ',
    'alert': 'ಎಚ್ಚರಿಕೆ',
    'scheme': 'ಯೋಜನೆ',
    'insurance': 'ವಿಮೆ',
    'status': 'ಸ್ಥಿತಿ',
    'today': 'ಇಂದು',
  },
  mr: {
    'farmer': 'शेतकरी',
    'farmers': 'शेतकरी',
    'crop': 'पीक',
    'crops': 'पिके',
    'field': 'शेत',
    'village': 'गाव',
    'district': 'जिल्हा',
    'irrigation': 'सिंचन',
    'soil': 'माती',
    'water': 'पाणी',
    'yield': 'उत्पादन',
    'price': 'भाव',
    'market': 'बाजार',
    'weather': 'हवामान',
    'rain': 'पाऊस',
    'temperature': 'तापमान',
    'alert': 'सूचना',
    'scheme': 'योजना',
    'insurance': 'विमा',
    'status': 'स्थिती',
    'today': 'आज',
  },
  bn: {
    'farmer': 'কৃষক',
    'crop': 'ফসল',
    'field': 'জমি',
    'village': 'গ্রাম',
    'district': 'জেলা',
    'weather': 'আবহাওয়া',
    'price': 'দাম',
    'market': 'বাজার',
    'alert': 'সতর্কতা',
    'today': 'আজ',
  },
  gu: {
    'farmer': 'ખેડૂત',
    'crop': 'પાક',
    'field': 'ખેતર',
    'village': 'ગામ',
    'district': 'જિલ્લો',
    'weather': 'હવામાન',
    'price': 'ભાવ',
    'market': 'બજાર',
    'alert': 'ચેતવણી',
    'today': 'આજે',
  },
  pa: {
    'farmer': 'ਕਿਸਾਨ',
    'crop': 'ਫ਼ਸਲ',
    'field': 'ਖੇਤ',
    'village': 'ਪਿੰਡ',
    'district': 'ਜ਼ਿਲ੍ਹਾ',
    'weather': 'ਮੌਸਮ',
    'price': 'ਭਾਅ',
    'market': 'ਮੰਡੀ',
    'alert': 'ਚੇਤਾਵਨੀ',
    'today': 'ਅੱਜ',
  },
  or: {
    'farmer': 'କୃଷକ',
    'crop': 'ଫସଲ',
    'field': 'ଜମି',
    'village': 'ଗାଁ',
    'district': 'ଜିଲ୍ଲା',
    'weather': 'ପାଣିପାଗ',
    'price': 'ଦର',
    'market': 'ବଜାର',
    'alert': 'ସତର୍କତା',
    'today': 'ଆଜି',
  },
  ml: {
    'farmer': 'കർഷകൻ',
    'crop': 'വിള',
    'field': 'പാടം',
    'village': 'ഗ്രാമം',
    'district': 'ജില്ല',
    'weather': 'കാലാവസ്ഥ',
    'price': 'വില',
    'market': 'വിപണി',
    'alert': 'മുന്നറിയിപ്പ്',
    'today': 'ഇന്ന്',
  },
};

// Units translation
export const UNIT_DICTIONARY: Record<Language, Record<string, string>> = {
  en: {},
  te: {
    'acres': 'ఎకరాలు',
    'acre': 'ఎకరం',
    'ac': 'ఎకరాలు',
    'quintal': 'క్వింటాల్',
    'quintals': 'క్వింటాళ్లు',
    'qtl': 'క్వింటాల్',
    'kg': 'కిలో',
    'kgs': 'కిలోలు',
    'km/h': 'కిమీ/గం',
    'mm': 'మి.మీ',
    'cm': 'సెం.మీ',
    'c': '°C',
    '°c': '°C',
    '%': '%',
    'days': 'రోజులు',
    'day': 'రోజు',
    'hours': 'గంటలు',
    'hour': 'గంట',
    'mins': 'నిమిషాలు',
    'min': 'నిమిషం',
  },
  hi: {
    'acres': 'एकड़',
    'acre': 'एकड़',
    'ac': 'एकड़',
    'quintal': 'क्विंटल',
    'quintals': 'क्विंटल',
    'qtl': 'क्विंटल',
    'kg': 'किग्रा',
    'km/h': 'किमी/घंटा',
    'mm': 'मिमी',
    '°c': '°C',
    'days': 'दिन',
    'hours': 'घंटे',
  },
  ta: { 'acres': 'ஏக்கர்', 'quintal': 'குவிண்டால்', 'days': 'நாட்கள்' },
  kn: { 'acres': 'ಎಕರೆ', 'quintal': 'ಕ್ವಿಂಟಾಲ್', 'days': 'ದಿನಗಳು' },
  mr: { 'acres': 'एकर', 'quintal': 'क्विंटल', 'days': 'दिवस' },
  bn: { 'acres': 'একর', 'quintal': 'কুইন্টাল', 'days': 'দিন' },
  gu: { 'acres': 'એકર', 'quintal': 'ક્વિન્ટલ', 'days': 'દિવસ' },
  pa: { 'acres': 'ਏਕੜ', 'quintal': 'ਕੁਇੰਟਲ', 'days': 'ਦਿਨ' },
  or: { 'acres': 'ଏକର', 'quintal': 'କ୍ୱିଣ୍ଟାଲ', 'days': 'ଦିନ' },
  ml: { 'acres': 'ഏക്കർ', 'quintal': 'ക്വിന്റൽ', 'days': 'ദിവസങ്ങൾ' },
};

// Store original pristine texts to allow clean re-translation and restoring English
const originalTextMap = new WeakMap<Node, string>();
const originalAttrMap = new WeakMap<Element, Record<string, string>>();

/**
 * Translates numbers in a text string into the native script or localized numbers
 */
export function translateNumbers(text: string, lang: Language): string {
  if (lang === 'en' || !NUMERAL_MAPS[lang]) return text;
  const numMap = NUMERAL_MAPS[lang];
  return text.replace(/[0-9]/g, (digit) => numMap[digit] || digit);
}

/**
 * Intelligently translates a string of text into the target language.
 * Handles exact phrases, partial phrases, words, units, and numbers.
 */
export function translateString(rawText: string, lang: Language): string {
  if (!rawText || lang === 'en') return rawText;

  // Trim whitespace for matching while preserving edge whitespace
  const match = rawText.match(/^(\s*)([\s\S]*?)(\s*)$/);
  if (!match) return rawText;

  const leadingSpace = match[1];
  const content = match[2];
  const trailingSpace = match[3];

  if (!content) return rawText;

  // 1. Check exact phrase match in PHRASE_DICTIONARY
  const phraseDict = PHRASE_DICTIONARY[lang] || {};
  if (phraseDict[content]) {
    const translatedPhrase = phraseDict[content];
    return `${leadingSpace}${translateNumbers(translatedPhrase, lang)}${trailingSpace}`;
  }

  // Check case-insensitive exact phrase match
  const lowerContent = content.toLowerCase();
  for (const [k, v] of Object.entries(phraseDict)) {
    if (k.toLowerCase() === lowerContent) {
      return `${leadingSpace}${translateNumbers(v, lang)}${trailingSpace}`;
    }
  }

  // 2. Multi-word phrase replacement within longer sentences
  let result = content;

  // Replace longest matching phrases first
  const sortedPhrases = Object.entries(phraseDict).sort((a, b) => b[0].length - a[0].length);
  for (const [enPhrase, localPhrase] of sortedPhrases) {
    if (enPhrase.length > 2 && result.toLowerCase().includes(enPhrase.toLowerCase())) {
      const regex = new RegExp(`\\b${escapeRegExp(enPhrase)}\\b`, 'gi');
      result = result.replace(regex, localPhrase);
    }
  }

  // 3. Translate units (e.g. "2.0 Acres" -> "2.0 ఎకరాలు")
  const unitDict = UNIT_DICTIONARY[lang] || {};
  for (const [enUnit, localUnit] of Object.entries(unitDict)) {
    const regex = new RegExp(`(\\d+(?:\\.\\d+)?)\\s*\\b${escapeRegExp(enUnit)}\\b`, 'gi');
    result = result.replace(regex, `$1 ${localUnit}`);
  }

  // 4. Translate standalone words
  const wordDict = WORD_DICTIONARY[lang] || {};
  for (const [enWord, localWord] of Object.entries(wordDict)) {
    const regex = new RegExp(`\\b${escapeRegExp(enWord)}\\b`, 'gi');
    result = result.replace(regex, localWord);
  }

  // 5. Translate numerals if appropriate
  result = translateNumbers(result, lang);

  return `${leadingSpace}${result}${trailingSpace}`;
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Recursively translates an HTML node and all its child text nodes.
 */
function translateNode(node: Node, lang: Language) {
  // Ignore scripts, styles, iframes, code tags, and inputs with user text
  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as HTMLElement;
    const tagName = el.tagName.toLowerCase();
    if (
      tagName === 'script' ||
      tagName === 'style' ||
      tagName === 'noscript' ||
      tagName === 'code' ||
      el.classList?.contains('notranslate') ||
      el.getAttribute('data-no-translate') === 'true'
    ) {
      return;
    }

    // Translate attributes like placeholder, title, aria-label
    const translatableAttrs = ['placeholder', 'title', 'aria-label'];
    for (const attr of translatableAttrs) {
      const val = el.getAttribute(attr);
      if (val && val.trim()) {
        if (!originalAttrMap.has(el)) {
          originalAttrMap.set(el, {});
        }
        const attrs = originalAttrMap.get(el)!;
        if (!attrs[attr]) {
          attrs[attr] = val;
        }

        if (lang === 'en') {
          el.setAttribute(attr, attrs[attr]);
        } else {
          el.setAttribute(attr, translateString(attrs[attr], lang));
        }
      }
    }
  }

  if (node.nodeType === Node.TEXT_NODE) {
    const textNode = node as Text;
    const currentVal = textNode.nodeValue || '';

    // Ignore pure whitespace
    if (!currentVal.trim()) return;

    if (!originalTextMap.has(textNode)) {
      originalTextMap.set(textNode, currentVal);
    }

    const originalVal = originalTextMap.get(textNode) || currentVal;

    if (lang === 'en') {
      textNode.nodeValue = originalVal;
    } else {
      const translated = translateString(originalVal, lang);
      if (translated !== currentVal) {
        textNode.nodeValue = translated;
      }
    }
  } else {
    // Traverse children
    for (let i = 0; i < node.childNodes.length; i++) {
      translateNode(node.childNodes[i], lang);
    }
  }
}

let activeObserver: MutationObserver | null = null;
let currentLanguage: Language = 'en';

/**
 * Traverses the entire DOM tree and translates every single text node,
 * attribute, sentence, letter, word, and numeral.
 */
export function applyFullDOMTranslation(targetLang: Language) {
  currentLanguage = targetLang;
  const root = document.getElementById('root') || document.body;
  if (!root) return;

  // Temporarily disconnect observer to prevent recursive loops
  if (activeObserver) {
    activeObserver.disconnect();
  }

  // Walk the entire tree and translate
  translateNode(root, targetLang);

  // Re-attach persistent MutationObserver to catch React re-renders, modals, data loads
  activeObserver = new MutationObserver((mutations) => {
    if (currentLanguage === 'en') return;

    // Disconnect while modifying DOM
    activeObserver?.disconnect();

    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          translateNode(mutation.addedNodes[i], currentLanguage);
        }
      } else if (mutation.type === 'characterData') {
        translateNode(mutation.target, currentLanguage);
      }
    }

    // Re-observe
    activeObserver?.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  });

  activeObserver.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });
}
