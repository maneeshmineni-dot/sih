"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "hi" | "mr" | "te" | "ta" | "pa";

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    app_name: "AgriSense AI",
    tagline: "Multimodal Precision Agriculture Decision System",
    real_data_badge: "100% Real Data",
    command_center: "Command Center",
    soil_precision: "Soil Precision",
    satellite_srm: "Satellite SRM",
    weather_radar: "Weather Radar",
    national_analytics: "National Analytics",
    draw_plot: "Draw Farm Plot",
    inspector: "Live Coordinate Inspector",
    sign_in_google: "Sign in with Google",
    sign_out: "Sign Out",
    refresh_telemetry: "Refresh Telemetry",
    mean_ndvi: "Mean NDVI (Vegetation Vigor)",
    soil_moisture_root: "Root-Zone Soil Moisture (0-7cm)",
    soil_ph: "Soil pH Level",
    generate_plan: "GENERATE MULTIMODAL AGRONOMIC PLAN (GEMINI 3.6)",
    generating_plan: "Gemini Multimodal Reasoning in Progress...",
    recommended_crop: "Recommended Crop",
    seed_variety: "Recommended Seed Variety",
    confidence_score: "Model Confidence",
    expected_yield: "Expected Yield",
    fertilizer_schedule: "Stage-by-Stage Fertilizer Schedule",
    soil_restoration: "Soil Rehabilitation Protocol",
    irrigation_advisory: "Irrigation & Climate Advisory",
    pest_warning: "Biological Pest & Disease Warning",
    voice_note: "Record Voice Note",
    soil_card: "+ Soil Health Card",
    compare_layers: "Compare True Optical vs NDVI Vegetation Mask",
  },
  hi: {
    app_name: "एग्रीसेंस एआई",
    tagline: "मल्टीमॉडल प्रिसिजन एग्रीकल्चर निर्णय प्रणाली",
    real_data_badge: "100% प्रामाणिक डेटा",
    command_center: "कमांड सेंटर",
    soil_precision: "मृदा विश्लेषण",
    satellite_srm: "सैटेलाइट उपग्रह विश्लेषण",
    weather_radar: "मौसम रडार",
    national_analytics: "राष्ट्रीय कृषि विश्लेषिकी",
    draw_plot: "खेत की सीमा बनाएं",
    inspector: "लाइव निर्देशांक खोज",
    sign_in_google: "गूगल से लॉगिन करें",
    sign_out: "लॉग आउट",
    refresh_telemetry: "टेलीमेट्री रिफ्रेश करें",
    mean_ndvi: "औसत एनडीवीआई (फसल हरियाली)",
    soil_moisture_root: "जड़ क्षेत्र मृदा नमी (0-7 सेमी)",
    soil_ph: "मृदा पीएच स्तर",
    generate_plan: "मल्टीमॉडल कृषि योजना तैयार करें (जेमिनी 3.6)",
    generating_plan: "जेमिनी मल्टीमॉडल विश्लेषण जारी है...",
    recommended_crop: "अनुशंसित फसल",
    seed_variety: "अनुशंसित बीज किस्म",
    confidence_score: "सटीकता स्कोर",
    expected_yield: "अनुमानित पैदावार",
    fertilizer_schedule: "चरण-दर-चरण उर्वरक अनुसूची",
    soil_restoration: "मृदा सुधार एवं जैविक उपचार",
    irrigation_advisory: "सिंचाई और मौसम सलाह",
    pest_warning: "कीट एवं रोग सुरक्षा चेतावनी",
    voice_note: "आवाज में समस्या बताएं",
    soil_card: "+ मृदा स्वास्थ्य कार्ड",
    compare_layers: "मूल सैटेलाइट छवि बनाम एनडीवीआई तुलना",
  },
  mr: {
    app_name: "अ‍ॅग्रीसेन्स एआय",
    tagline: "मल्टिमॉडेल अचूक कृषी निर्णय प्रणाली",
    real_data_badge: "100% खरा डेटा",
    command_center: "कमांड सेंटर",
    soil_precision: "माती परीक्षण व अचूकता",
    satellite_srm: "उपग्रह विश्लेषण",
    weather_radar: "हवामान रडार",
    national_analytics: "राष्ट्रीय कृषी आकडेवारी",
    draw_plot: "शेत नकाशा आखा",
    inspector: "थेट स्थान तपासणी",
    sign_in_google: "गुगलने लॉगिन करा",
    sign_out: "बाहेर पडा",
    refresh_telemetry: "माहिती अद्ययावत करा",
    mean_ndvi: "सरासरी एनडीव्हीआय (पिकाची हिरवळ)",
    soil_moisture_root: "मुळातील मातीचा ओलावा (0-7 सेमी)",
    soil_ph: "मातीचा सामू (pH)",
    generate_plan: "मल्टिमॉडेल कृषी सल्ला मिळवा (जेमिनी 3.6)",
    generating_plan: "जेमिनी मल्टिमॉडेल विश्लेषण चालू आहे...",
    recommended_crop: "शिफारस केलेले पीक",
    seed_variety: "शिफारस केलेली वाण/बियाणे",
    confidence_score: "मॉडेल अचूकता",
    expected_yield: "अपेक्षित उत्पादन",
    fertilizer_schedule: "टप्प्याटप्प्याने खत व्यवस्थापन",
    soil_restoration: "जमीन सुधारणा व सेंद्रिय उपाय",
    irrigation_advisory: "पाणी व्यवस्थापन व हवामान सल्ला",
    pest_warning: "रोग व कीड नियंत्रण चेतावणी",
    voice_note: "व्हॉईस नोट रेकॉर्ड करा",
    soil_card: "+ सॉईल हेल्थ कार्ड",
    compare_layers: "मूळ उपग्रह चित्र व एनडीव्हीआय तुलना",
  },
  te: {
    app_name: "అగ్రిసెన్స్ AI",
    tagline: "మల్టీమోడల్ ప్రెసిషన్ వ్యవసాయ నిర్ణయ వ్యవస్థ",
    real_data_badge: "100% నిజమైన డేటా",
    command_center: "కమాండ్ సెంటర్",
    soil_precision: "నేల విశ్లేషణ",
    satellite_srm: "ఉపగ్రహ పరిశీలన",
    weather_radar: "వాతావరణ రాడార్",
    national_analytics: "జాతీయ వ్యవసాయ విశ్లేషణ",
    draw_plot: "పొలం సరిహద్దు గీయండి",
    inspector: "ప్రత్యక్ష కోఆర్డినేట్ తనిఖీ",
    sign_in_google: "గూగుల్ లాగిన్",
    sign_out: "లాగౌట్",
    refresh_telemetry: "రిఫ్రెష్ చేయండి",
    mean_ndvi: "సగటు NDVI (పంట పచ్చదనం)",
    soil_moisture_root: "వేరు ప్రాంత తేమ (0-7 సెం.మీ)",
    soil_ph: "నేల pH విలువ",
    generate_plan: "మల్టీమోడల్ ప్రణాళిక రూపొందించండి (జెమిని 3.6)",
    generating_plan: "జెమిని విశ్లేషణ జరుగుతోంది...",
    recommended_crop: "సిఫార్సు చేయబడిన పంట",
    seed_variety: "సిఫార్సు చేయబడిన విత్తనం రకం",
    confidence_score: "ఖచ్చితత్వ స్కోరు",
    expected_yield: "అంచనా దిగుబడి",
    fertilizer_schedule: "ఎరువుల ప్రణాళిక",
    soil_restoration: "నేల పునరుద్ధరణ",
    irrigation_advisory: "సాగునీటి సలహా",
    pest_warning: "పురుగుల నివారణ హెచ్చరిక",
    voice_note: "వాయిస్ రికార్డ్ చేయండి",
    soil_card: "+ సాయిల్ హెల్త్ కార్డు",
    compare_layers: "ఉపగ్రహ చిత్రం vs NDVI పోలిక",
  },
  ta: {
    app_name: "அக்ரிசென்ஸ் AI",
    tagline: "மல்டிமாடல் துல்லிய வேளாண்மை முடிவெடுக்கும் அமைப்பு",
    real_data_badge: "100% உண்மையான தரவு",
    command_center: "கட்டளை மையம்",
    soil_precision: "மண் துல்லியம்",
    satellite_srm: "செயற்கைக்கோள் பகுப்பாய்வு",
    weather_radar: "வானிலை ரேடார்",
    national_analytics: "தேசிய வேளாண்மை பகுப்பாய்வு",
    draw_plot: "நில எல்லையை வரைக",
    inspector: "நேரடி இட ஆய்வு",
    sign_in_google: "கூகிள் உள்நுழைவு",
    sign_out: "வெளியேறு",
    refresh_telemetry: "புதுப்பிக்கவும்",
    mean_ndvi: "சராசரி NDVI (பயிர் பசுமை)",
    soil_moisture_root: "வேர் பகுதி மண் ஈரப்பதம் (0-7 செ.மீ)",
    soil_ph: "மண் pH அளவு",
    generate_plan: "பயிர் திட்டத்தை உருவாக்குங்கள் (ஜெமினி 3.6)",
    generating_plan: "ஜெமினி பகுப்பாய்வு நடக்கிறது...",
    recommended_crop: "பரிந்துரைக்கப்பட்ட பயிர்",
    seed_variety: "பரிந்துரைக்கப்பட்ட விதை வகை",
    confidence_score: "துல்லிய மதிப்பீடு",
    expected_yield: "எதிர்பார்க்கப்படும் மகசூல்",
    fertilizer_schedule: "உரமிடுதல் அட்டவணை",
    soil_restoration: "மண் சீரமைப்பு வழிகாட்டுதல்",
    irrigation_advisory: "நீர்ப்பாசன ஆலோசனை",
    pest_warning: "பூச்சி மற்றும் நோய் எச்சரிக்கை",
    voice_note: "குரல் பதிவு செய்க",
    soil_card: "+ மண் சுகாதார அட்டை",
    compare_layers: "செயற்கைக்கோள் மற்றும் NDVI ஒப்பீடு",
  },
  pa: {
    app_name: "ਐਗਰੀਸੈਂਸ ਏਆਈ",
    tagline: "ਮਲਟੀਮੋਡਲ ਸ਼ੁੱਧ ਖੇਤੀਬਾੜੀ ਫੈਸਲਾ ਪ੍ਰਣਾਲੀ",
    real_data_badge: "100% ਅਸਲੀ ਡੇਟਾ",
    command_center: "ਕਮਾਂਡ ਸੈਂਟਰ",
    soil_precision: "ਮਿੱਟੀ ਵਿਸ਼ਲੇਸ਼ਣ",
    satellite_srm: "ਸੈਟੇਲਾਈਟ ਵਿਸ਼ਲੇਸ਼ਣ",
    weather_radar: "ਮੌਸਮ ਰਾਡਾਰ",
    national_analytics: "ਰਾਸ਼ਟਰੀ ਖੇਤੀਬਾੜੀ ਅੰਕੜੇ",
    draw_plot: "ਖੇਤ ਦੀ ਹੱਦਬੰਦੀ ਕਰੋ",
    inspector: "ਲਾਈਵ ਲੋਕੇਸ਼ਨ ਜਾਂਚ",
    sign_in_google: "ਗੂਗਲ ਨਾਲ ਲੌਗਇਨ ਕਰੋ",
    sign_out: "ਲੌਗਆਊਟ",
    refresh_telemetry: "ਤਾਜ਼ਾ ਕਰੋ",
    mean_ndvi: "ਔਸਤ ਐਨ.ਡੀ.ਵੀ.ਆਈ (ਹਰਿਆਵਲ)",
    soil_moisture_root: "ਜੜ੍ਹ ਖੇਤਰ ਮਿੱਟੀ ਨਮੀ (0-7 ਸੈ.ਮੀ.)",
    soil_ph: "ਮਿੱਟੀ ਪੀ.ਐਚ. ਪੱਧਰ",
    generate_plan: "ਖੇਤੀਬਾੜੀ ਯੋਜਨਾ ਤਿਆਰ ਕਰੋ (ਜੇਮਿਨੀ 3.6)",
    generating_plan: "ਜੇਮਿਨੀ ਵਿਸ਼ਲੇਸ਼ਣ ਜਾਰੀ ਹੈ...",
    recommended_crop: "ਸਿਫਾਰਸ਼ ਕੀਤੀ ਫਸਲ",
    seed_variety: "ਸਿਫਾਰਸ਼ ਕੀਤੀ ਬੀਜ ਕਿਸਮ",
    confidence_score: "ਮਾਡਲ ਸ਼ੁੱਧਤਾ",
    expected_yield: "ਅੰਦਾਜ਼ਨ ਝਾੜ",
    fertilizer_schedule: "ਖਾਦ ਪ੍ਰਬੰਧਨ ਸਮਾਂ-ਸਾਰਣੀ",
    soil_restoration: "ਮਿੱਟੀ ਸੁਧਾਰ ਪ੍ਰੋਟੋਕੋਲ",
    irrigation_advisory: "ਸਿੰਚਾਈ ਅਤੇ ਮੌਸਮ ਸਲਾਹ",
    pest_warning: "ਕੀਟ ਅਤੇ ਬਿਮਾਰੀ ਚੇਤਾਵਨੀ",
    voice_note: "ਆਵਾਜ਼ ਰਿਕਾਰਡ ਕਰੋ",
    soil_card: "+ ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ",
    compare_layers: "ਸੈਟੇਲਾਈਟ ਤਸਵੀਰ ਅਤੇ ਐਨ.ਡੀ.ਵੀ.ਆਈ ਤੁਲਨਾ",
  },
};

import { liveTranslatorEngine, CLIENT_TRANSLATION_MAP, lookupFastTranslation } from "@/services/liveTranslator";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    try {
      localStorage.setItem("agrisense_user_lang", newLang);
    } catch (e) {}

    if (typeof window !== "undefined") {
      if (newLang === "en") {
        liveTranslatorEngine.stop();
      } else {
        liveTranslatorEngine.start(newLang);
      }
    }
  };

  React.useEffect(() => {
    try {
      const savedLang = localStorage.getItem("agrisense_user_lang") as Language;
      if (savedLang && ["en", "hi", "mr", "te", "ta", "pa"].includes(savedLang)) {
        setLanguage(savedLang);
      }
    } catch (e) {}
  }, []);

  const t = (key: string): string => {
    // 1. Direct translation table
    if (translations[language]?.[key]) {
      return translations[language][key];
    }
    // 2. High-coverage liveTranslator dictionary
    const fast = lookupFastTranslation(key, language);
    if (fast) return fast;

    // 3. English or key fallback
    return translations["en"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
