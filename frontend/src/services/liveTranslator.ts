/**
 * AgriSphere Unified Live Real-Time DOM & Dynamic Content Translation Engine
 * Amazon/Flipkart-Style Multi-Pass Tokenized Substring & Full-Sentence Translation
 * 0ms Instantaneous In-Memory Switching across 6 Indian Languages
 */

export const CLIENT_TRANSLATION_MAP: Record<string, Record<string, string>> = {
  // Navigation & Branding
  "AgriSphere AI": { hi: "एग्रीस्फीयर एआई", te: "అగ్రిస్పియర్ AI", ta: "அக்ரிஸ்பியர் AI", mr: "अ‍ॅग्रीस्फिअर एआय", pa: "ਐਗਰੀਸਫੀਅਰ AI" },
  "SIH 2026": { hi: "एसआईएच 2026", te: "SIH 2026", ta: "SIH 2026", mr: "एसआयएच 2026", pa: "ਐਸਆਈਐਚ 2026" },
  "Unified Agricultural Intelligence & Cloud SRM": {
    hi: "एकीकृत कृषि बुद्धिमत्ता और क्लाउड एसआरएम",
    te: "సమగ్ర వ్యవసాయ మేధస్సు & క్లౌడ్ SRM",
    ta: "ஒருங்கிணைந்த வேளாண் நுண்ணறிவு & கிளவுட் SRM",
    mr: "एकीकृत कृषी बुद्धिमत्ता आणि क्लाउड एसआरएम",
    pa: "ਯੂਨੀਫਾਈਡ ਖੇਤੀਬਾੜੀ ਇੰਟੈਲੀਜੈਂਸ ਅਤੇ ਕਲਾਉਡ SRM"
  },
  "Command Center": { hi: "कमांड सेंटर", te: "కమాండ్ సెంటర్", ta: "கட்டளை மையம்", mr: "कमांड सेंटर", pa: "ਕਮਾਂਡ ਸੈਂਟਰ" },
  "Satellite SRM": { hi: "सैटेलाइट उपग्रह विश्लेषण", te: "ఉపగ్రహ పరిశీలన", ta: "செயற்கைக்கோள் பகுப்பாய்வு", mr: "उपग्रह विश्लेषण", pa: "ਸੈਟੇਲਾਈਟ ਵਿਸ਼ਲੇਸ਼ਣ" },
  "Soil Precision": { hi: "मृदा परीक्षण व विश्लेषण", te: "నేల విశ్లేషణ", ta: "மண் துல்லியம்", mr: "माती अचूकता", pa: "ਮਿੱਟੀ ਵਿਸ਼ਲੇਸ਼ਣ" },
  "Weather Radar": { hi: "मौसम रडार", te: "వాతావరణ రాడార్", ta: "வானிலை ரேடார்", mr: "हवामान रडार", pa: "ਮੌਸਮ ਰਾਡਾਰ" },
  "National Analytics": { hi: "राष्ट्रीय फसल विश्लेषण", te: "జాతీయ వ్యవసాయ విశ్లేషణ", ta: "தேசிய வேளாண் பகுப்பாய்வு", mr: "राष्ट्रीय कृषी विश्लेषण", pa: "ਰਾਸ਼ਟਰੀ ਖੇਤੀ ਵਿਸ਼ਲੇਸ਼ਣ" },
  "Home Overview": { hi: "मुख्य अवलोकन", te: "హోమ్ అవలోకనం", ta: "முகப்பு மேலோட்டம்", mr: "मुख्य आढावा", pa: "ਮੁੱਖ ਝਲਕ" },
  "Home": { hi: "मुख्य पृष्ठ", te: "హోమ్", ta: "முகப்பு", mr: "मुख्य", pa: "ਘਰ" },
  "Dashboard": { hi: "डैशबोर्ड", te: "డాష్‌బోర్డ్", ta: "டாஷ்போர்டு", mr: "डॅशबोर्ड", pa: "ਡੈਸ਼ਬੋਰਡ" },
  "Farm Dashboard": { hi: "खेत डैशबोर्ड", te: "ఫామ్ డాష్‌బోర్డ్", ta: "பண்ணை டாஷ்போர்டு", mr: "शेत डॅशबोर्ड", pa: "ਖੇਤ ਡੈਸ਼ਬੋਰਡ" },
  "Login Dashboard": { hi: "लॉगिन डैशबोर्ड", te: "లాగిన్ డాష్‌బోర్డ్", ta: "உள்நுழைவு டாஷ்போர்டு", mr: "लॉगिन डॅशबोर्ड", pa: "ਲਾਗਇਨ ਡੈਸ਼ਬੋਰਡ" },
  "Sign In": { hi: "साइन इन", te: "సైన్ ఇన్", ta: "உள்நுழைக", mr: "साइन इन", pa: "ਸਾਈਨ ਇਨ" },
  "Sign Out": { hi: "लॉग आउट", te: "లాగౌట్", ta: "வெளியேறு", mr: "बाहेर पडा", pa: "ਲੌਗਆਊਟ" },
  "Logout": { hi: "लॉग आउट", te: "లాగౌట్", ta: "வெளியேறு", mr: "बाहेर पडा", pa: "ਲੌਗਆਊਟ" },
  "Farmer Account": { hi: "किसान खाता", te: "రైతు ఖాతా", ta: "விவசாயி கணக்கு", mr: "शेतकरी खाते", pa: "ਕਿਸਾਨ ਖਾਤਾ" },

  // Farm Map & Cadastral Controls
  "Interactive Farm Boundary & Satellite Remote Sensing Basemap": {
    hi: "इंटरैक्टिव खेत सीमा और उपग्रह रिमोट सेंसिंग बेसमेप",
    te: "ఇంటరాక్టివ్ పొలం సరిహద్దు & ఉపగ్రహ రిమోట్ సెన్సింగ్ మ్యాప్",
    ta: "ஊடாடும் பண்ணை எல்லை & செயற்கைக்கோள் அடிப்படை வரைபடம்",
    mr: "परस्परसंवादी शेत सीमा आणि उपग्रह नकाशा",
    pa: "ਇੰਟਰਐਕਟਿਵ ਖੇਤ ਦੀ ਹੱਦ ਅਤੇ ਸੈਟੇਲਾਈਟ ਨਕਸ਼ਾ"
  },
  "High-Resolution Optical Earth Observation": {
    hi: "उच्च-रिज़ॉल्यूशन ऑप्टिकल पृथ्वी अवलोकन",
    te: "హై-రిజల్యూషన్ ఆప్టికల్ భూ పరిశీలన",
    ta: "உயர் தெளிவுத்திறன் ஆப்டிகல் பூமி கண்காணிப்பு",
    mr: "हाय-रिझोल्यूशन ऑप्टिकल पृथ्वी निरीक्षण",
    pa: "ਹਾਈ-ਰੈਜ਼ੋਲਿਊਸ਼ਨ ਆਪਟੀਕਲ ਧਰਤੀ ਨਿਰੀਖਣ"
  },
  "Satellite": { hi: "उपग्रह", te: "ఉపగ్రహం", ta: "செயற்கைக்கோள்", mr: "उपग्रह", pa: "ਸੈਟੇਲਾਈਟ" },
  "Street": { hi: "सड़क", te: "రహదారి", ta: "சாலை", mr: "रस्ता", pa: "ਸੜਕ" },
  "Pinpoint": { hi: "स्थान पिन करें", te: "లొకేషన్ పిన్", ta: "பாயிண்ட் குறி", mr: "स्थान दर्शवा", pa: "ਪਿੰਨ ਪੁਆਇੰਟ" },
  "Targeting...": { hi: "स्थान चुना जा रहा है...", te: "లక్ష్యం చేస్తోంది...", ta: "குறிவைக்கிறது...", mr: "लक्ष्य करत आहे...", pa: "ਟਾਰਗੇਟ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ..." },
  "Add Corners": { hi: "कोने जोड़ें", te: "మూలలు జోడించండి", ta: "மூலைகளைச் சேர்", mr: "कोने जोडा", pa: "ਕੋਨੇ ਜੋੜੋ" },
  "Adding...": { hi: "जोड़ रहे हैं...", te: "జోడిస్తోంది...", ta: "சேர்க்கிறது...", mr: "जोडत आहे...", pa: "ਜੋੜ ਰਿਹਾ ਹੈ..." },
  "Reset": { hi: "रीसेट", te: "రీసెట్", ta: "மீட்டமை", mr: "रीसेट", pa: "ਰੀਸੈਟ" },
  "GeoJSON": { hi: "जियोजेसन", te: "GeoJSON", ta: "GeoJSON", mr: "जियोजेसन", pa: "GeoJSON" },
  "KML": { hi: "केएमएल", te: "KML", ta: "KML", mr: "केएमएल", pa: "KML" },
  "Area:": { hi: "क्षेत्रफल:", te: "వైశాల్యం:", ta: "பரப்பளவு:", mr: "क्षेत्रफळ:", pa: "ਖੇਤਰਫਲ:" },
  "Perimeter:": { hi: "परिधि:", te: "చుట్టుకొలత:", ta: "சுற்றளவு:", mr: "परिमिती:", pa: "ਘੇਰਾ:" },
  "Presets:": { hi: "आकार:", te: "ప్రిసెట్లు:", ta: "முன்னமைவுகள்:", mr: "आकार पर्याय:", pa: "ਸੈੱਟਿੰਗਾਂ:" },
  "Acres": { hi: "एकड़", te: "ఎకరాలు", ta: "ஏக்கர்", mr: "एकर", pa: "ਏਕੜ" },
  "Ac": { hi: "एकड़", te: "ఎకరాలు", ta: "ஏக்கர்", mr: "एकर", pa: "ਏਕੜ" },
  "Ha": { hi: "हेक्टेयर", te: "హెక్టార్లు", ta: "ஹெக்டேர்", mr: "हेक्टर", pa: "ਹੈਕਟੇਅਰ" },
  "Hectares": { hi: "हेक्टेयर", te: "హెక్టార్లు", ta: "ஹெக்டேர்", mr: "हेक्टर", pa: "ਹੈਕਟੇਅਰ" },
  "Move Farm Plot Here": { hi: "🎯 खेत को यहाँ स्थानांतरित करें", te: "🎯 పొలాన్ని ఇక్కడికి తరలించండి", ta: "🎯 பண்ணையை இங்கே நகர்த்தவும்", mr: "🎯 शेत येथे हलवा", pa: "🎯 ਖੇਤ ਨੂੰ ਇੱਥੇ ਭੇਜੋ" },
  "Clear Pin": { hi: "पिन हटाएं", te: "పిన్ తొలగించు", ta: "பின்கலை அகற்று", mr: "पिन काढा", pa: "ਪਿੰਨ ਹਟਾਓ" },
  "Click anywhere on map to pinpoint": { hi: "पिन लगाने के लिए नक्शे पर कहीं भी क्लिक करें", te: "పిన్ చేయడానికి మ్యాప్‌లో ఎక్కడైనా క్లిక్ చేయండి", ta: "குறிக்க வரைபடத்தில் எங்கு வேண்டுமானாலும் கிளிக் செய்யவும்", mr: "पिन करण्यासाठी नकाशावर कुठेही क्लिक करा", pa: "ਪਿੰਨ ਕਰਨ ਲਈ ਨਕਸ਼ੇ 'ਤੇ ਕਿਤੇ ਵੀ ਕਲਿੱਕ ਕਰੋ" },

  // Live Scientific Telemetry & Gauges
  "100% Real Live Telemetry & Soil Physics Feed": {
    hi: "100% वास्तविक लाइव टेलीमेट्री और मृदा भौतिकी",
    te: "100% రియల్ లైవ్ టెలిమెట్రీ & నేల భౌతిక డేటా",
    ta: "100% உண்மையான நேரலை டெலிமெட்ரி & மண் இயற்பியல்",
    mr: "100% वास्तविक थेट माहिती व माती भौतिकशास्त्र",
    pa: "100% ਅਸਲ ਲਾਈਵ ਟੈਲੀਮੈਟਰੀ ਅਤੇ ਮਿੱਟੀ ਭੌਤਿਕ ਵਿਗਿਆਨ"
  },
  "Live API Synchronization Active": {
    hi: "लाइव एपीआई सिंक्रनाइज़ेशन सक्रिय",
    te: "లైవ్ API సింక్రొనైజేషన్ సక్రియం",
    ta: "நேரலை API ஒத்திசைவு செயலில் உள்ளது",
    mr: "थेट एपीआय समन्वय सक्रिय",
    pa: "ਲਾਈਵ API ਸਿੰਕ੍ਰੋਨਾਈਜ਼ੇਸ਼ਨ ਸਰਗਰਮ"
  },
  "Live Satellite SRM": { hi: "लाइव उपग्रह एसआरएम", te: "లైవ్ శాటిలైట్ SRM", ta: "நேரலை செயற்கைக்கோள் SRM", mr: "थेट उपग्रह एसआरएम", pa: "ਲਾਈਵ ਸੈਟੇਲਾਈਟ SRM" },
  "Real Optical": { hi: "वास्तविक ऑप्टिकल", te: "రియల్ ఆప్టికల్", ta: "உண்மையான ஆப்டிகல்", mr: "वास्तविक ऑप्टिकल", pa: "ਅਸਲ ਆਪਟੀਕਲ" },
  "Mean NDVI Biomass": { hi: "औसत एनडीवीआई बायोमास", te: "సగటు NDVI బయోమాస్", ta: "சராசரி NDVI பயோமாஸ்", mr: "सरासरी एनडीव्हीआय बायोमास", pa: "ਔਸਤ NDVI ਬਾਇਓਮਾਸ" },
  "Canopy Density": { hi: "कैनोपी घनत्व", te: "పంట పందిరి సాంద్రత", ta: "மேற்கூரை அடர்த்தி", mr: "पिकाची घनता", pa: "ਕੈਨੋਪੀ ਘਣਤਾ" },
  "NDWI (Moisture)": { hi: "एनडीडब्ल्यूआई (नमी सूचकांक)", te: "NDWI (తేమ సూచిక)", ta: "NDWI (ஈரப்பதம்)", mr: "एनडीडब्ल्यूआय (ओलावा)", pa: "NDWI (ਨਮੀ)" },
  "Healthy Dense Vegetation": { hi: "स्वस्थ सघन फसल हरियाली", te: "ఆరోగ్యకరమైన దట్టమైన పంట", ta: "ஆரோக்கியமான அடர்ந்த பயிர்", mr: "निरोगी दाट पीक", pa: "ਸਿਹਤਮੰਦ ਸੰਘਣੀ ਫਸਲ" },
  "Moderate Vegetation": { hi: "मध्यम फसल हरियाली", te: "మధ్యస్థ పంట", ta: "மிதமான பயிர்", mr: "मध्यम पीक", pa: "ਦਰਮਿਆਨੀ ਫਸਲ" },
  "Sparse / Early Emergence": { hi: "विरल / शुरुआती अंकुरण", te: "తక్కువ / ప్రారంభ మొలక", ta: "குறைந்த / ஆரம்ப நிலை", mr: "विरळ / प्राथमिक अवस्था", pa: "ਘੱਟ / ਸ਼ੁਰੂਆਤੀ ਫਸਲ" },
  "View Satellite Tile ↗": { hi: "सैटेलाइट टाइल देखें ↗", te: "ఉపగ్రహ టైల్ చూడండి ↗", ta: "செயற்கைக்கோள் படத்தைப் பார்க்க ↗", mr: "उपग्रह प्रतिमा पहा ↗", pa: "ਸੈਟੇਲਾਈਟ ਟਾਇਲ ਦੇਖੋ ↗" },

  // Soil & Weather Gauges
  "4-Layer Soil Moisture": { hi: "4-परत मृदा नमी", te: "4-పొరల నేల తేమ", ta: "4-அடுக்கு மண் ஈரப்பதம்", mr: "4-थर मातीचा ओलावा", pa: "4-ਪੱਧਰੀ ਮਿੱਟੀ ਦੀ ਨਮੀ" },
  "Volumetric": { hi: "आयतन आधारित", te: "వాల్యూమెట్రిక్", ta: "அளவீட்டு முறை", mr: "घनफळ आधारित", pa: "ਆਇਤਨ ਅਧਾਰਿਤ" },
  "Vertical Moisture Profile (m³/m³):": { hi: "लंबवत नमी प्रोफाइल (m³/m³):", te: "నిలువు తేమ ప్రొఫైల్ (m³/m³):", ta: "செங்குத்து ஈரப்பத விவரம் (m³/m³):", mr: "उभा ओलावा प्रोफाइल (m³/m³):", pa: "ਲੰਬਕਾਰੀ ਨਮੀ ਪ੍ਰੋਫਾਈਲ (m³/m³):" },
  "Root Zone": { hi: "जड़ क्षेत्र (रूट ज़ोन)", te: "వేరు ప్రాంతం", ta: "வேர் மண்டலம்", mr: "मूळ क्षेत्र", pa: "ਜੜ੍ਹ ਖੇਤਰ" },
  "Subsoil": { hi: "उप-मृदा (सबसॉइल)", te: "ఉప నేల", ta: "அடிமண்", mr: "उप-माती", pa: "ਹੇਠਲੀ ਮਿੱਟੀ" },
  "Deep Core": { hi: "गहरा कोर", te: "లోతైన కోర్", ta: "ஆழ்ந்த அடுக்கு", mr: "खोल थर", pa: "ਡੂੰਘਾ ਕੋਰ" },
  "Aquifer": { hi: "भूजल स्तर (एक्विफर)", te: "భూగర్భ జలం", ta: "நிலத்தடி நீர்", mr: "भूजल पातळी", pa: "ਧਰਤੀ ਹੇਠਲਾ ਪਾਣੀ" },
  "14d Rain": { hi: "14 दिन की वर्षा", te: "14 రోజుల వర్షం", ta: "14 நாள் மழை", mr: "14 दिवसांचा पाऊस", pa: "14 ਦਿਨਾਂ ਦਾ ਮੀਂਹ" },
  "Daily ET0": { hi: "दैनिक वाष्पोत्सर्जन (ET₀)", te: "రోజువారీ బాష్పీభవనం", ta: "தினசரி ஆவியாதல்", mr: "दैनिक बाष्पीभवन", pa: "ਰੋਜ਼ਾਨਾ ਵਾਸ਼ਪੀਕਰਨ" },
  "Status:": { hi: "स्थिति:", te: "స్థితి:", ta: "நிலை:", mr: "स्थिती:", pa: "ਸਥਿਤੀ:" },
  "Optimal Moisture": { hi: "अनुकूल नमी", te: "అనుకూలమైన తేమ", ta: "உகந்த ஈரப்பதம்", mr: "योग्य ओलावा", pa: "ਸਹੀ ਨਮੀ" },
  "Adequate Root Moisture": { hi: "पर्याप्त जड़ नमी", te: "సరిపడా వేరు తేమ", ta: "போதுமான வேர் ஈரப்பதம்", mr: "पुरेसा ओलावा", pa: "ਲੋੜੀਂਦੀ ਜੜ੍ਹ ਨਮੀ" },
  "Water Stressed": { hi: "पानी की कमी (तनाव)", te: "నీటి కొరత", ta: "நீர் பற்றாக்குறை", mr: "पाण्याची टंचाई", pa: "ਪਾਣੀ ਦੀ ਘਾਟ" },

  // Soil Chemistry
  "ISRIC Soil Chemistry": { hi: "आईएसआरआईसी मृदा रसायन", te: "ISRIC నేల రసాయన శాస్త్రం", ta: "ISRIC மண் வேதியியல்", mr: "आयएसआरआयसी माती रसायनशास्त्र", pa: "ISRIC ਮਿੱਟੀ ਰਸਾਇਣ" },
  "+ Soil Health Card": { hi: "+ मृदा स्वास्थ्य कार्ड", te: "+ నేల ఆరోగ్య కార్డు", ta: "+ மண் சுகாதார அட்டை", mr: "+ मृदा आरोग्य पत्रिका", pa: "+ ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ" },
  "Soil Health Card": { hi: "मृदा स्वास्थ्य कार्ड", te: "నేల ఆరోగ్య కార్డు", ta: "மண் சுகாதார அட்டை", mr: "मृदा आरोग्य पत्रिका", pa: "ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ" },
  "Soil pH Level": { hi: "मृदा सामू (pH) स्तर", te: "నేల pH విలువ", ta: "மண் pH அளவு", mr: "मातीचा सामू (pH)", pa: "ਮਿੱਟੀ ਦਾ pH ਪੱਧਰ" },
  "Organic Carbon (OC)": { hi: "जैविक कार्बन (SOC)", te: "సేంద్రీయ కార్బన్", ta: "கரிம கார்பன்", mr: "सेंद्रिय कर्ब", pa: "ਜੈਵਿਕ ਕਾਰਬਨ" },
  "Optimal": { hi: "उत्तम (अनुकूल)", te: "అనుకూలం", ta: "உகந்தது", mr: "उत्कृष्ट", pa: "ਵਧੀਆ" },
  "Acidic": { hi: "अम्लीय", te: "ఆమ్ల", ta: "அமில", mr: "आम्लधर्मी", pa: "ਤੇਜ਼ਾਬੀ" },
  "Alkaline": { hi: "क्षारीय", te: "క్షార", ta: "கார", mr: "अल्कलीधर्मी", pa: "ਖਾਰਾ" },
  "High": { hi: "उच्च", te: "ఎక్కువ", ta: "அதிகம்", mr: "जास्त", pa: "ਉੱਚਾ" },
  "Medium": { hi: "मध्यम", te: "మధ్యస్థం", ta: "நடுத்தரம்", mr: "मध्यम", pa: "ਦਰਮਿਆਨਾ" },
  "Low": { hi: "निम्न (कम)", te: "తక్కువ", ta: "குறைவு", mr: "कमी", pa: "ਘੱਟ" },
  "Clay:": { hi: "चिकनी मिट्टी (Clay):", te: "బంకమట్టి:", ta: "களிமண்:", mr: "काळी चिकणमाती:", pa: "ਚੀਕਣੀ ਮਿੱਟੀ:" },
  "Sand:": { hi: "रेत (Sand):", te: "ఇసుక:", ta: "மணல்:", mr: "रेती:", pa: "ਰੇਤ:" },
  "Silt:": { hi: "गाद (Silt):", te: "ఒండ్రుమట్టి:", ta: "வண்டல்:", mr: "गाळ:", pa: "ਗਲ:" },

  // Soil NPK & Rotation Ledger
  "Soil NPK Fertility & Economic Rotation Ledger": {
    hi: "मृदा एनपीके उर्वरता एवं आर्थिक फसल चक्र बहीखाता",
    te: "నేల NPK సారవంతత & ఆర్థిక పంట మార్పిడి వివరాలు",
    ta: "மண் NPK வளம் & பொருளாதார பயிர் சுழற்சி விவரம்",
    mr: "माती एनपीके सुपीकता व आर्थिक पीक फेरपालट वही",
    pa: "ਮਿੱਟੀ NPK ਉਪਜਾਊ ਸ਼ਕਤੀ ਅਤੇ ਆਰਥਿਕ ਫਸਲੀ ਚੱਕਰ ਖਾਤਾ"
  },
  "Nitrogen (N)": { hi: "नाइट्रोजन (N)", te: "నత్రజని (N)", ta: "நைட்ரஜன் (N)", mr: "नायट्रोजन (N)", pa: "ਨਾਈਟ੍ਰੋਜਨ (N)" },
  "Phosphorus (P₂O₅)": { hi: "फास्फोरस (P₂O₅)", te: "భాస్వరం (P₂O₅)", ta: "பாஸ்பரஸ் (P₂O₅)", mr: "फॉस्फरस (P₂O₅)", pa: "ਫਾਸਫੋਰਸ (P₂O₅)" },
  "Potassium (K₂O)": { hi: "पोटाश / पोटैशियम (K₂O)", te: "పొటాషియం (K₂O)", ta: "பொட்டாசியம் (K₂O)", mr: "पोटॅश (K₂O)", pa: "ਪੋਟਾਸ਼ੀਅਮ (K₂O)" },
  "Rotation Profit Boost": { hi: "फसल चक्र से अतिरिक्त मुनाफा", te: "పంట మార్పిడి లాభం", ta: "பயிர் சுழற்சி கூடுதல் லாபம்", mr: "पीक फेरपालट नफा वाढ", pa: "ਫਸਲੀ ਚੱਕਰ ਮੁਨਾਫਾ ਵਾਧਾ" },
  "Legume Nitrogen savings": { hi: "दलहनी फसलों से नाइट्रोजन बचत", te: "పప్పుధాన్యాల నత్రజని ఆదా", ta: "பருப்பு பயிர் நைட்ரஜன் சேமிப்பு", mr: "कडधान्यांमुळे खतांची बचत", pa: "ਦਾਲਾਂ ਤੋਂ ਨਾਈਟ੍ਰੋਜਨ ਬੱਚਤ" },
  "Adequate": { hi: "पर्याप्त", te: "తగినంత", ta: "போதுமானது", mr: "पुरेसे", pa: "ਲੋੜੀਂਦਾ" },
  "Moderate": { hi: "मध्यम", te: "మధ్యస్థం", ta: "மிதமானது", mr: "मध्यम", pa: "ਦਰਮਿਆਨਾ" },

  // AI Decision Engine & Mandi Ledger
  "Gemini 3.6 Multimodal Agronomic Decision Plan": {
    hi: "जेमिनी 3.6 मल्टीमॉडल कृषि निर्णय योजना",
    te: "జెమిని 3.6 మల్టీమోడల్ వ్యవసాయ నిర్ణయ ప్రణాళిక",
    ta: "ஜெமினி 3.6 மல்டிமாடல் வேளாண் திட்ட முடிவு",
    mr: "जेमिनी 3.6 मल्टिमॉडेल कृषी निर्णय सल्ला",
    pa: "ਜੈਮਿਨੀ 3.6 ਮਲਟੀਮੋਡਲ ਖੇਤੀਬਾੜੀ ਫੈਸਲਾ ਯੋਜਨਾ"
  },
  "Plan Generated Successfully": {
    hi: "योजना सफलतापूर्वक तैयार की गई",
    te: "ప్రణాళిక విజయవంతంగా రూపొందించబడింది",
    ta: "திட்டம் வெற்றிகரமாக உருவாக்கப்பட்டது",
    mr: "सल्ला यशस्वीरित्या तयार झाला",
    pa: "ਯੋਜਨਾ ਸਫਲਤਾਪੂਰਵਕ ਤਿਆਰ ਕੀਤੀ ਗਈ"
  },
  "Recommended Crop": { hi: "अनुशंसित फसल", te: "సిఫార్సు చేసిన పంట", ta: "பரிந்துரைக்கப்பட்ட பயிர்", mr: "शिफारस केलेले पीक", pa: "ਸਿਫਾਰਸ਼ ਕੀਤੀ ਫਸਲ" },
  "Recommended Seed Variety": { hi: "अनुशंसित बीज किस्म", te: "విత్తనం రకం", ta: "விதை ரகம்", mr: "शिफारस केलेली वाण", pa: "ਸਿਫਾਰਸ਼ ਕੀਤੀ ਬੀਜ ਕਿਸਮ" },
  "Model Confidence": { hi: "सटीकता स्कोर", te: "ఖచ్చితత్వం", ta: "துல்லியத்தன்மை", mr: "मॉडेल अचूकता", pa: "ਸ਼ੁੱਧਤਾ ਸਕੋਰ" },
  "Expected Yield": { hi: "अनुमानित पैदावार", te: "అంచనా దిగుబడి", ta: "எதிர்பார்க்கப்படும் மகசூல்", mr: "अपेक्षित उत्पादन", pa: "ਅਨੁਮਾਨਿਤ ਝਾੜ" },
  "Stage-by-Stage Fertilizer Schedule": { hi: "चरण-दर-चरण उर्वरक अनुसूची", te: "దశలవారీ ఎరువుల ప్రణాళిక", ta: "படி-படியான உர அட்டவணை", mr: "टप्प्याटप्प्याने खत व्यवस्थापन", pa: "ਪੜਾਅ-ਦਰ-ਪੜਾਅ ਖਾਦ ਪ੍ਰੋਗਰਾਮ" },
  "Soil Rehabilitation Protocol": { hi: "मृदा सुधार एवं जैविक उपचार", te: "నేల పునరుద్ధరణ", ta: "மண் சீரமைப்பு நெறிமுறை", mr: "जमीन सुधारणा उपाय", pa: "ਮਿੱਟੀ ਸੁਧਾਰ ਪ੍ਰੋਟੋਕੋਲ" },
  "Irrigation & Climate Advisory": { hi: "सिंचाई और मौसम सलाह", te: "సాగునీరు & వాతావరణ సలహా", ta: "நீர்ப்பாசனம் & காலநிலை ஆலோசனை", mr: "पाणी व हवामान सल्ला", pa: "ਸਿੰਚਾਈ ਅਤੇ ਮੌਸਮ ਸਲਾਹ" },
  "Biological Pest & Disease Warning": { hi: "जैविक कीट एवं रोग चेतावनी", te: "పురుగు & తెగుళ్ల నివారణ", ta: "உயிரியல் பூச்சி & நோய் எச்சரிக்கை", mr: "रोग व कीड नियंत्रण", pa: "ਕੀਟ ਅਤੇ ਬਿਮਾਰੀ ਚੇਤਾਵਨੀ" },

  // Mandi Financials & Schemes
  "Live APMC Mandi Modal Price": { hi: "लाइव एपीएमसी मंडी भाव", te: "లైవ్ APMC మార్కెట్ ధర", ta: "நேரலை APMC மண்டி விலை", mr: "थेट कृषी उत्पन्न बाजार समिती भाव", pa: "ਲਾਈਵ APMC ਮੰਡੀ ਭਾਅ" },
  "Est. Gross Revenue": { hi: "अनुमानित कुल आय", te: "మొత్తం రాబడి", ta: "மொத்த வருவாய்", mr: "अपेक्षित एकूण उत्पन्न", pa: "ਅਨੁਮਾਨਿਤ ਕੁੱਲ ਆਮਦਨ" },
  "Est. Input Costs": { hi: "लागत खर्च (बीज/खाद)", te: "పెట్టుబడి ఖర్చు", ta: "உள்ளீட்டு செலவு", mr: "खते व बियाणे खर्च", pa: "ਖਾਦ ਤੇ ਬੀਜ ਖਰਚਾ" },
  "Est. Net Profit / Acre": { hi: "शुद्ध मुनाफा प्रति एकड़", te: "ఎకరాకు నికర లాభం", ta: "ஏக்கருக்கு நிகர லாபம்", mr: "प्रति एकर निव्वळ नफा", pa: "ਪ੍ਰਤੀ ਏਕੜ ਸ਼ੁੱਧ ਮੁਨਾਫਾ" },
  "3-Season Regenerative Crop Rotation Strategy": {
    hi: "3-मौसम पुनर्योजी फसल चक्र रणनीति",
    te: "3-సీజన్ల పంట మార్పిడి వ్యూహం",
    ta: "3-பருவ பயிர் சுழற்சி உத்தி",
    mr: "3-हंगामांची पीक फेरपालट योजना",
    pa: "3-ਸੀਜ਼ਨ ਫਸਲੀ ਚੱਕਰ ਰਣਨੀਤੀ"
  },
  "Central & State Government Subsidies Dossier": {
    hi: "केंद्र व राज्य सरकार कृषि सब्सिडी योजनाएं",
    te: "కేంద్ర & రాష్ట్ర ప్రభుత్వ సబ్సిడీ పథకాలు",
    ta: "மத்திய & மாநில அரசு மானிய திட்டங்கள்",
    mr: "केंद्र व राज्य शासन कृषी अनुदान योजना",
    pa: "ਕੇਂਦਰ ਅਤੇ ਰਾਜ ਸਰਕਾਰੀ ਸਬਸਿਡੀ ਯੋਜਨਾਵਾਂ"
  },

  // Krishi Mitra Assistant
  "Krishi Mitra AI": { hi: "कृषि मित्र एआई", te: "కృషి మిత్ర AI", ta: "வேளாண் நண்பன் AI", mr: "कृषी मित्र एआय", pa: "ਕ੍ਰਿਸ਼ੀ ਮਿੱਤਰ AI" },
  "Voice-Enabled • 6 Indian Languages • ICAR Grounded": {
    hi: "आवाज सक्षम • 6 भारतीय भाषाएं • आईसीएआर आधारित",
    te: "వాయిస్ సపోర్ట్ • 6 భారతీయ భాషలు • ICAR ఆధారితం",
    ta: "குரல் ஆதரவு • 6 இந்திய மொழிகள் • ICAR அங்கீகரிக்கப்பட்டது",
    mr: "व्हॉईस सपोर्ट • 6 भारतीय भाषा • आयसीएआर आधारित",
    pa: "ਆਵਾਜ਼ ਸਮਰਥਿਤ • 6 ਭਾਰਤੀ ਭਾਸ਼ਾਵਾਂ • ICAR ਅਧਾਰਿਤ"
  },
  "Ask anything about your crop...": {
    hi: "अपनी फसल के बारे में कुछ भी पूछें...",
    te: "మీ పంట గురించి ఏదైనా అడగండి...",
    ta: "உங்கள் பயிரைப் பற்றி எதையும் கேளுங்கள்...",
    mr: "आपल्या पिकाबद्दल काहीही विचारा...",
    pa: "ਆਪਣੀ ਫਸਲ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ..."
  },
  "Listening (Speak now)...": {
    hi: "सुन रहा हूँ (अब बोलें)...",
    te: "వింటున్నాను (ఇప్పుడు మాట్లాడండి)...",
    ta: "கேட்கிறேன் (இப்போது பேசவும்)...",
    mr: "ऐकत आहे (आता बोला)...",
    pa: "ਸੁਣ ਰਿਹਾ ਹਾਂ (ਹੁਣ ਬੋਲੋ)..."
  }
};

// Sorted list of translation keys by descending length for multi-pass token replacement
let sortedKeysCache: string[] | null = null;
function getSortedKeys(): string[] {
  if (!sortedKeysCache) {
    sortedKeysCache = Object.keys(CLIENT_TRANSLATION_MAP).sort((a, b) => b.length - a.length);
  }
  return sortedKeysCache;
}

export function lookupFastTranslation(text: string, targetLang: string): string | null {
  if (!text || targetLang === "en") return text;
  const trimmed = text.trim();
  if (!trimmed) return text;

  // 1. Direct exact match
  if (CLIENT_TRANSLATION_MAP[trimmed]?.[targetLang]) {
    return CLIENT_TRANSLATION_MAP[trimmed][targetLang];
  }

  // 2. Tokenized Substring multi-pass replacement for compound sentences & badges
  const keys = getSortedKeys();
  let translated = trimmed;
  let hasMatch = false;

  for (const key of keys) {
    if (translated.includes(key)) {
      const repl = CLIENT_TRANSLATION_MAP[key]?.[targetLang];
      if (repl) {
        translated = translated.split(key).join(repl);
        hasMatch = true;
      }
    }
  }

  return hasMatch ? translated : null;
}

function shouldSkipNode(node: Node): boolean {
  const parent = node.parentElement;
  if (!parent) return true;
  const tag = parent.tagName;
  if (["SCRIPT", "STYLE", "CODE", "PRE", "SVG", "PATH", "IFRAME", "INPUT", "TEXTAREA"].includes(tag)) {
    return true;
  }
  if (
    parent.classList.contains("notranslate") ||
    parent.getAttribute("translate") === "no" ||
    parent.hasAttribute("data-no-translate")
  ) {
    return true;
  }
  return false;
}

export function translateTextNode(node: Node, targetLang: string) {
  if (shouldSkipNode(node)) return;
  const rawValue = node.nodeValue;
  if (!rawValue || !rawValue.trim()) return;

  const extNode = node as any;
  if (!extNode.__agriOrigText) {
    extNode.__agriOrigText = rawValue;
  }

  const orig = extNode.__agriOrigText as string;

  if (targetLang === "en") {
    if (node.nodeValue !== orig) {
      node.nodeValue = orig;
    }
    return;
  }

  const fast = lookupFastTranslation(orig, targetLang);
  if (fast) {
    if (node.nodeValue !== fast) {
      node.nodeValue = fast;
    }
  }
}

export function translateSubtree(rootNode: Node, targetLang: string) {
  if (!rootNode || typeof window === "undefined") return;

  const walker = document.createTreeWalker(
    rootNode,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        if (shouldSkipNode(node)) return NodeFilter.FILTER_REJECT;
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  let cur = walker.nextNode();
  while (cur) {
    translateTextNode(cur, targetLang);
    cur = walker.nextNode();
  }
}

class LiveDOMTranslator {
  private observer: MutationObserver | null = null;
  private currentLang: string = "en";
  private isActive: boolean = false;

  start(targetLang: string = "en") {
    this.currentLang = targetLang;
    this.isActive = true;

    if (typeof document !== "undefined") {
      translateSubtree(document.body, targetLang);

      if (this.observer) {
        this.observer.disconnect();
      }

      this.observer = new MutationObserver((mutations) => {
        if (!this.isActive || this.currentLang === "en") return;

        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.TEXT_NODE) {
                translateTextNode(node, this.currentLang);
              } else if (node.nodeType === Node.ELEMENT_NODE) {
                translateSubtree(node, this.currentLang);
              }
            });
          } else if (mutation.type === "characterData" && mutation.target) {
            translateTextNode(mutation.target, this.currentLang);
          }
        });
      });

      this.observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }
  }

  setLanguage(newLang: string) {
    this.currentLang = newLang;
    if (typeof document !== "undefined") {
      if (newLang === "en") {
        this.stop();
      } else {
        this.isActive = true;
        translateSubtree(document.body, newLang);
      }
    }
  }

  stop() {
    this.isActive = false;
    if (this.observer) {
      this.observer.disconnect();
    }
    if (typeof document !== "undefined") {
      translateSubtree(document.body, "en");
    }
  }
}

export const liveTranslatorEngine = new LiveDOMTranslator();
