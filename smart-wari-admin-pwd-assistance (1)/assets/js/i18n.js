/* ==========================================================================
   Smart Wari Connect — i18n (English / Marathi / Hindi)
   One dictionary, one t() helper. Sidebar, topbar and every page header
   translate automatically; dashboard content translates via data-i18n.
   ========================================================================== */

const WARI_LANGS = [
  { code: 'en', label: 'English',  native: 'English' },
  { code: 'mr', label: 'Marathi',  native: 'मराठी'   },
  { code: 'hi', label: 'Hindi',    native: 'हिंदी'    }
];

const TRANSLATIONS = {
  en: {
    nav: {
      groups: {
        overview: "Overview", people: "People", fieldServices: "Field Services",
        emergencyResponse: "Emergency Response", pwdAssistance: "PWD Assistance", safetyReports: "Safety & Reports",
        engagement: "Engagement", system: "System"
      },
      items: {
        dashboard: "Dashboard", users: "User Management", volunteers: "Volunteer Management",
        routes: "Route Management", "wari-stops": "Wari Stops", "food-camps": "Food Camps",
        "water-points": "Water Points", "medical-camps": "Medical Camps",
        hospitals: "Hospitals & Medical Centers", "sos-requests": "Emergency Requests",
        "emergency-vans": "Emergency Vans", "emergency-tracking": "Live Emergency Tracking",
        "pwd-assistance": "PWD Assistance",
        "missing-persons": "Missing Persons", notifications: "Notifications",
        chatbot: "AI Chatbot", "digital-id": "Digital Warkari IDs",
        reports: "Reports & Analytics", feedback: "Feedback",
        settings: "System Settings", logout: "Logout"
      }
    },
    topbar: {
      search: "Search users, volunteers, reports…",
      notifications: "Notifications", messages: "Messages", settings: "Settings",
      language: "Language", role: "Super Admin", brandSub: "Admin Control Center"
    },
    pages: {
      dashboard: { breadcrumb: "Admin / Dashboard", title: "Smart Wari Connect — Admin Control Center", subtitle: "Monitor and manage Wari assistance services in real time." },
      users: { breadcrumb: "Admin / People / Users", title: "User Management", subtitle: "All registered Warkaris on the platform — profiles, districts, blood groups and Digital IDs." },
      volunteers: { breadcrumb: "Admin / People / Volunteers", title: "Volunteer Management", subtitle: "Assign field areas, track availability, and coordinate the volunteer network." },
      routes: { breadcrumb: "Admin / Field Services / Routes", title: "Route Management", subtitle: "Define palkhi routes, halts, distances and expected timings." },
      "wari-stops": { breadcrumb: "Admin / Field Services / Wari Stops", title: "Wari Stop Management", subtitle: "The 14 official halts along the route, in order, with assigned volunteers, vans and active emergencies at each." },
      "food-camps": { breadcrumb: "Admin / Field Services / Food Camps", title: "Food Camp Management", subtitle: "Track annachhatra / food distribution points along every route." },
      "water-points": { breadcrumb: "Admin / Field Services / Water Points", title: "Water Point Management", subtitle: "Drinking water tankers, RO units and hand pumps along the route." },
      "medical-camps": { breadcrumb: "Admin / Field Services / Medical Camps", title: "Medical Camp Management", subtitle: "Doctors, services and emergency availability across the route." },
      hospitals: { breadcrumb: "Admin / Field Services / Hospitals & Medical Centers", title: "Hospital & Medical Center Network", subtitle: "Partnered hospitals and medical centers along the route, with Wari Stop and GPS coordinates for emergency dispatch." },
      "sos-requests": { breadcrumb: "Admin / Emergency Response / Emergency Requests", title: "Emergency Requests", subtitle: "All emergency medical requests raised across the platform, with live volunteer & van assignment." },
      "emergency-vans": { breadcrumb: "Admin / Emergency Response / Emergency Vans", title: "Emergency Van Management", subtitle: "Fleet status, assigned volunteers and live GPS state for every emergency van." },
      "emergency-tracking": { breadcrumb: "Admin / Emergency Response / Live Emergency Tracking", title: "Live Emergency Tracking", subtitle: "Select an active emergency to follow the assigned van's live location on the map." },
      "pwd-assistance": { breadcrumb: "Admin / PWD Assistance / PWD Assistance Management", title: "♿ PWD Assistance Management", subtitle: "Special assistance requests from Persons with Disabilities, with dedicated volunteer assignment — separate from the Emergency (SOS) workflow." },
      "missing-persons": { breadcrumb: "Admin / Safety & Reports / Missing Persons", title: "Missing Person Management", subtitle: "Verify new reports before they become visible to volunteers and users." },
      "lost-found": { breadcrumb: "Admin / Safety & Reports / Lost & Found", title: "Lost & Found", subtitle: "Review, approve and match reported lost items with claimants." },
      notifications: { breadcrumb: "Admin / Engagement / Notifications", title: "Notification Management", subtitle: "Compose and broadcast alerts to Warkaris, volunteers or specific routes." },
      chatbot: { breadcrumb: "Admin / Engagement / AI Chatbot", title: "AI Chatbot Analytics", subtitle: "Track how Warkaris are using the assistant and where it needs improvement." },
      "digital-id": { breadcrumb: "Admin / Engagement / Digital Warkari IDs", title: "Digital Warkari ID", subtitle: "Generate, verify and manage QR-based identity cards for every registered Warkari." },
      reports: { breadcrumb: "Admin / System / Reports & Analytics", title: "Reports & Analytics", subtitle: "Export platform data and review the full system activity log." },
      feedback: { breadcrumb: "Admin / System / Feedback", title: "Feedback", subtitle: "What Warkaris and volunteers are saying about the platform." },
      settings: { breadcrumb: "Admin / System / Settings", title: "System Settings", subtitle: "Platform configuration, admin roles and security." }
    },
    dashboard: {
      kpi: {
        totalWarkaris: "Total Warkaris", totalVolunteers: "Total Volunteers", foodCamps: "Food Camps",
        waterPoints: "Water Points", medicalCamps: "Medical Camps", activeSOS: "Active SOS",
        missingReports: "Missing Person Reports", dailyVisitors: "Daily Visitors", aiQueries: "AI Queries",
        d1: "+18.5% this week", d2: "+6.2% this week", d3: "+9 today", d4: "+14 today", d5: "+3 today",
        d6: "−2 vs yesterday", d7: "+4 today", d8: "+22.4% vs yesterday", d9: "+31% this week"
      },
      emKpi: {
        activeEmergencies: "Active Emergencies", availableVans: "Available Emergency Vans",
        vansOnWay: "Vans On The Way", availableVolunteers: "Available Volunteers",
        volunteersOnEmergency: "Volunteers On Emergency", completedEmergencies: "Completed Emergencies"
      },
      monitor: {
        title: "LIVE EMERGENCY MONITOR", updated: "Updated 12s ago",
        activeSOS: "Active SOS", pendingMedical: "Pending Medical", missingPersons: "Missing Persons", criticalAlerts: "Critical Alerts",
        type: "Type", volunteer: "Volunteer", reportedBy: "Reported by", unassigned: "Unassigned",
        typeFall: "Fall / Injury", typeDehydration: "Dehydration", byVolunteer: "Volunteer",
        critical: "Critical", pending: "Pending", searching: "Searching",
        view: "View", assign: "Assign", resolve: "Resolve"
      },
      map: {
        title: "Live Map — Route & Field Assets", refresh: "Auto-refresh every 30s",
        all: "All", warkaris: "Warkaris", volunteers: "Volunteers", sos: "SOS",
        medical: "Medical", food: "Food", water: "Water",
        legendWarkaris: "Warkaris", legendVolunteers: "Volunteers", legendSOS: "SOS",
        legendMedical: "Medical Camp", legendWater: "Water Point", legendHospital: "Hospital / Police"
      },
      charts: {
        registration: "Warkari Registration Trend", distribution: "Assistance Distribution",
        visitors: "Daily Visitors", sos: "SOS Requests (7 days)",
        route: "Route Crowd Analytics", routeSub: "Live pilgrim density per halt"
      }
    },
    common: { search: "Search" }
  },

  mr: {
    nav: {
      groups: {
        overview: "विहंगावलोकन", people: "लोक", fieldServices: "क्षेत्रीय सेवा",
        emergencyResponse: "आणीबाणी प्रतिसाद", safetyReports: "सुरक्षा आणि अहवाल",
        engagement: "सहभाग", system: "प्रणाली"
      },
      items: {
        dashboard: "डॅशबोर्ड", users: "वापरकर्ता व्यवस्थापन", volunteers: "स्वयंसेवक व्यवस्थापन",
        routes: "मार्ग व्यवस्थापन", "wari-stops": "वारी थांबे", "food-camps": "अन्नछत्र शिबिरे",
        "water-points": "पाणी केंद्रे", "medical-camps": "वैद्यकीय शिबिरे",
        hospitals: "रुग्णालये आणि वैद्यकीय केंद्रे", "sos-requests": "आणीबाणी विनंत्या",
        "emergency-vans": "आणीबाणी व्हॅन्स", "emergency-tracking": "थेट आणीबाणी ट्रॅकिंग",
        "missing-persons": "बेपत्ता व्यक्ती", notifications: "सूचना",
        chatbot: "एआय चॅटबॉट", "digital-id": "डिजिटल वारकरी ओळखपत्र",
        reports: "अहवाल आणि विश्लेषण", feedback: "अभिप्राय",
        settings: "प्रणाली सेटिंग्ज", logout: "बाहेर पडा"
      }
    },
    topbar: {
      search: "वापरकर्ते, स्वयंसेवक, अहवाल शोधा…",
      notifications: "सूचना", messages: "संदेश", settings: "सेटिंग्ज",
      language: "भाषा", role: "सुपर अ‍ॅडमिन", brandSub: "प्रशासन नियंत्रण केंद्र"
    },
    pages: {
      dashboard: { breadcrumb: "अ‍ॅडमिन / डॅशबोर्ड", title: "स्मार्ट वारी कनेक्ट — प्रशासन नियंत्रण केंद्र", subtitle: "वारी सहाय्य सेवांचे रिअल टाइममध्ये निरीक्षण आणि व्यवस्थापन करा." },
      users: { breadcrumb: "अ‍ॅडमिन / लोक / वापरकर्ते", title: "वापरकर्ता व्यवस्थापन", subtitle: "प्लॅटफॉर्मवरील सर्व नोंदणीकृत वारकरी — प्रोफाइल, जिल्हे, रक्तगट आणि डिजिटल ओळखपत्रे." },
      volunteers: { breadcrumb: "अ‍ॅडमिन / लोक / स्वयंसेवक", title: "स्वयंसेवक व्यवस्थापन", subtitle: "क्षेत्रीय भाग नेमून द्या, उपलब्धता ट्रॅक करा आणि स्वयंसेवक नेटवर्क समन्वयित करा." },
      routes: { breadcrumb: "अ‍ॅडमिन / क्षेत्रीय सेवा / मार्ग", title: "मार्ग व्यवस्थापन", subtitle: "पालखी मार्ग, थांबे, अंतर आणि अपेक्षित वेळा निश्चित करा." },
      "wari-stops": { breadcrumb: "अ‍ॅडमिन / क्षेत्रीय सेवा / वारी थांबे", title: "वारी थांबा व्यवस्थापन", subtitle: "मार्गावरील 14 अधिकृत थांबे, क्रमाने, नेमलेले स्वयंसेवक, व्हॅन्स आणि प्रत्येक ठिकाणच्या सक्रिय आणीबाणींसह." },
      "food-camps": { breadcrumb: "अ‍ॅडमिन / क्षेत्रीय सेवा / अन्नछत्र", title: "अन्नछत्र शिबिर व्यवस्थापन", subtitle: "प्रत्येक मार्गावरील अन्नछत्र / अन्न वितरण केंद्रांचा मागोवा घ्या." },
      "water-points": { breadcrumb: "अ‍ॅडमिन / क्षेत्रीय सेवा / पाणी केंद्रे", title: "पाणी केंद्र व्यवस्थापन", subtitle: "मार्गावरील पिण्याच्या पाण्याचे टँकर, आरओ युनिट्स आणि हातपंप." },
      "medical-camps": { breadcrumb: "अ‍ॅडमिन / क्षेत्रीय सेवा / वैद्यकीय शिबिरे", title: "वैद्यकीय शिबिर व्यवस्थापन", subtitle: "मार्गावरील डॉक्टर, सेवा आणि आणीबाणी उपलब्धता." },
      hospitals: { breadcrumb: "अ‍ॅडमिन / क्षेत्रीय सेवा / रुग्णालये आणि वैद्यकीय केंद्रे", title: "रुग्णालय आणि वैद्यकीय केंद्र नेटवर्क", subtitle: "मार्गावरील भागीदार रुग्णालये आणि वैद्यकीय केंद्रे, आणीबाणी पाठवण्यासाठी वारी थांबा आणि जीपीएस निर्देशांकांसह." },
      "sos-requests": { breadcrumb: "अ‍ॅडमिन / आणीबाणी प्रतिसाद / आणीबाणी विनंत्या", title: "आणीबाणी विनंत्या", subtitle: "प्लॅटफॉर्मवर नोंदवलेल्या सर्व वैद्यकीय आणीबाणी विनंत्या, थेट स्वयंसेवक आणि व्हॅन नेमणुकीसह." },
      "emergency-vans": { breadcrumb: "अ‍ॅडमिन / आणीबाणी प्रतिसाद / आणीबाणी व्हॅन्स", title: "आणीबाणी व्हॅन व्यवस्थापन", subtitle: "प्रत्येक आणीबाणी व्हॅनची ताफा स्थिती, नेमलेले स्वयंसेवक आणि थेट जीपीएस स्थिती." },
      "emergency-tracking": { breadcrumb: "अ‍ॅडमिन / आणीबाणी प्रतिसाद / थेट आणीबाणी ट्रॅकिंग", title: "थेट आणीबाणी ट्रॅकिंग", subtitle: "नेमलेल्या व्हॅनचे थेट स्थान नकाशावर पाहण्यासाठी सक्रिय आणीबाणी निवडा." },
      "missing-persons": { breadcrumb: "अ‍ॅडमिन / सुरक्षा आणि अहवाल / बेपत्ता व्यक्ती", title: "बेपत्ता व्यक्ती व्यवस्थापन", subtitle: "स्वयंसेवक आणि वापरकर्त्यांना दिसण्यापूर्वी नवीन अहवाल पडताळून पहा." },
      "lost-found": { breadcrumb: "अ‍ॅडमिन / सुरक्षा आणि अहवाल / हरवले-सापडले", title: "हरवले आणि सापडले", subtitle: "नोंदवलेल्या हरवलेल्या वस्तूंचे पुनरावलोकन, मंजुरी आणि दावेदारांशी जुळवणी करा." },
      notifications: { breadcrumb: "अ‍ॅडमिन / सहभाग / सूचना", title: "सूचना व्यवस्थापन", subtitle: "वारकरी, स्वयंसेवक किंवा विशिष्ट मार्गांना सूचना तयार करा आणि प्रसारित करा." },
      chatbot: { breadcrumb: "अ‍ॅडमिन / सहभाग / एआय चॅटबॉट", title: "एआय चॅटबॉट विश्लेषण", subtitle: "वारकरी सहाय्यकाचा कसा वापर करत आहेत आणि सुधारणा कुठे आवश्यक आहे ते पहा." },
      "digital-id": { breadcrumb: "अ‍ॅडमिन / सहभाग / डिजिटल वारकरी ओळखपत्र", title: "डिजिटल वारकरी ओळखपत्र", subtitle: "प्रत्येक नोंदणीकृत वारकरीसाठी क्यूआर-आधारित ओळखपत्रे तयार करा, पडताळा आणि व्यवस्थापित करा." },
      reports: { breadcrumb: "अ‍ॅडमिन / प्रणाली / अहवाल आणि विश्लेषण", title: "अहवाल आणि विश्लेषण", subtitle: "प्लॅटफॉर्म डेटा एक्सपोर्ट करा आणि संपूर्ण सिस्टम अ‍ॅक्टिव्हिटी लॉग पहा." },
      feedback: { breadcrumb: "अ‍ॅडमिन / प्रणाली / अभिप्राय", title: "अभिप्राय", subtitle: "वारकरी आणि स्वयंसेवक प्लॅटफॉर्मबद्दल काय म्हणत आहेत." },
      settings: { breadcrumb: "अ‍ॅडमिन / प्रणाली / सेटिंग्ज", title: "प्रणाली सेटिंग्ज", subtitle: "प्लॅटफॉर्म कॉन्फिगरेशन, प्रशासक भूमिका आणि सुरक्षा." }
    },
    dashboard: {
      kpi: {
        totalWarkaris: "एकूण वारकरी", totalVolunteers: "एकूण स्वयंसेवक", foodCamps: "अन्नछत्र शिबिरे",
        waterPoints: "पाणी केंद्रे", medicalCamps: "वैद्यकीय शिबिरे", activeSOS: "सक्रिय एसओएस",
        missingReports: "बेपत्ता व्यक्ती अहवाल", dailyVisitors: "दैनिक भेट देणारे", aiQueries: "एआय प्रश्न",
        d1: "+18.5% या आठवड्यात", d2: "+6.2% या आठवड्यात", d3: "+9 आज", d4: "+14 आज", d5: "+3 आज",
        d6: "−2 कालच्या तुलनेत", d7: "+4 आज", d8: "+22.4% कालच्या तुलनेत", d9: "+31% या आठवड्यात"
      },
      emKpi: {
        activeEmergencies: "सक्रिय आणीबाणी", availableVans: "उपलब्ध आणीबाणी व्हॅन्स",
        vansOnWay: "मार्गावर असलेल्या व्हॅन्स", availableVolunteers: "उपलब्ध स्वयंसेवक",
        volunteersOnEmergency: "आणीबाणीत असलेले स्वयंसेवक", completedEmergencies: "पूर्ण झालेल्या आणीबाणी"
      },
      monitor: {
        title: "थेट आणीबाणी मॉनिटर", updated: "12 सेकंदांपूर्वी अद्ययावत",
        activeSOS: "सक्रिय एसओएस", pendingMedical: "प्रलंबित वैद्यकीय", missingPersons: "बेपत्ता व्यक्ती", criticalAlerts: "गंभीर सूचना",
        type: "प्रकार", volunteer: "स्वयंसेवक", reportedBy: "नोंदवणारा", unassigned: "अनियुक्त",
        typeFall: "पडणे / दुखापत", typeDehydration: "डिहायड्रेशन", byVolunteer: "स्वयंसेवक",
        critical: "गंभीर", pending: "प्रलंबित", searching: "शोध सुरू",
        view: "पहा", assign: "नियुक्त करा", resolve: "निकाली काढा"
      },
      map: {
        title: "थेट नकाशा — मार्ग आणि क्षेत्रीय संसाधने", refresh: "दर 30 सेकंदांनी स्वयं-रिफ्रेश",
        all: "सर्व", warkaris: "वारकरी", volunteers: "स्वयंसेवक", sos: "एसओएस",
        medical: "वैद्यकीय", food: "अन्न", water: "पाणी",
        legendWarkaris: "वारकरी", legendVolunteers: "स्वयंसेवक", legendSOS: "एसओएस",
        legendMedical: "वैद्यकीय शिबिर", legendWater: "पाणी केंद्र", legendHospital: "रुग्णालय / पोलीस"
      },
      charts: {
        registration: "वारकरी नोंदणी कल", distribution: "सहाय्य वितरण",
        visitors: "दैनिक भेट देणारे", sos: "एसओएस विनंत्या (7 दिवस)",
        route: "मार्ग गर्दी विश्लेषण", routeSub: "प्रत्येक थांब्यावरील थेट यात्रेकरू घनता"
      }
    },
    common: { search: "शोधा" }
  },

  hi: {
    nav: {
      groups: {
        overview: "अवलोकन", people: "लोग", fieldServices: "फील्ड सेवाएं",
        emergencyResponse: "आपातकालीन प्रतिक्रिया", safetyReports: "सुरक्षा और रिपोर्ट",
        engagement: "सहभागिता", system: "सिस्टम"
      },
      items: {
        dashboard: "डैशबोर्ड", users: "उपयोगकर्ता प्रबंधन", volunteers: "स्वयंसेवक प्रबंधन",
        routes: "मार्ग प्रबंधन", "wari-stops": "वारी पड़ाव", "food-camps": "भोजन शिविर",
        "water-points": "जल केंद्र", "medical-camps": "चिकित्सा शिविर",
        hospitals: "अस्पताल और चिकित्सा केंद्र", "sos-requests": "आपातकालीन अनुरोध",
        "emergency-vans": "आपातकालीन वैन", "emergency-tracking": "लाइव आपातकालीन ट्रैकिंग",
        "missing-persons": "लापता व्यक्ति", notifications: "सूचनाएं",
        chatbot: "एआई चैटबॉट", "digital-id": "डिजिटल वारकरी पहचान पत्र",
        reports: "रिपोर्ट और विश्लेषण", feedback: "प्रतिक्रिया",
        settings: "सिस्टम सेटिंग्स", logout: "लॉगआउट"
      }
    },
    topbar: {
      search: "उपयोगकर्ता, स्वयंसेवक, रिपोर्ट खोजें…",
      notifications: "सूचनाएं", messages: "संदेश", settings: "सेटिंग्स",
      language: "भाषा", role: "सुपर एडमिन", brandSub: "एडमिन नियंत्रण केंद्र"
    },
    pages: {
      dashboard: { breadcrumb: "एडमिन / डैशबोर्ड", title: "स्मार्ट वारी कनेक्ट — एडमिन नियंत्रण केंद्र", subtitle: "वारी सहायता सेवाओं की वास्तविक समय में निगरानी और प्रबंधन करें।" },
      users: { breadcrumb: "एडमिन / लोग / उपयोगकर्ता", title: "उपयोगकर्ता प्रबंधन", subtitle: "प्लेटफ़ॉर्म पर सभी पंजीकृत वारकरी — प्रोफ़ाइल, जिले, रक्त समूह और डिजिटल आईडी।" },
      volunteers: { breadcrumb: "एडमिन / लोग / स्वयंसेवक", title: "स्वयंसेवक प्रबंधन", subtitle: "फील्ड क्षेत्र असाइन करें, उपलब्धता ट्रैक करें और स्वयंसेवक नेटवर्क समन्वयित करें।" },
      routes: { breadcrumb: "एडमिन / फील्ड सेवाएं / मार्ग", title: "मार्ग प्रबंधन", subtitle: "पालकी मार्ग, पड़ाव, दूरी और अपेक्षित समय निर्धारित करें।" },
      "wari-stops": { breadcrumb: "एडमिन / फील्ड सेवाएं / वारी पड़ाव", title: "वारी पड़ाव प्रबंधन", subtitle: "मार्ग पर 14 आधिकारिक पड़ाव, क्रम में, नियुक्त स्वयंसेवकों, वैन और प्रत्येक स्थान पर सक्रिय आपात स्थितियों के साथ।" },
      "food-camps": { breadcrumb: "एडमिन / फील्ड सेवाएं / भोजन शिविर", title: "भोजन शिविर प्रबंधन", subtitle: "हर मार्ग पर अन्नछत्र / भोजन वितरण केंद्रों को ट्रैक करें।" },
      "water-points": { breadcrumb: "एडमिन / फील्ड सेवाएं / जल केंद्र", title: "जल केंद्र प्रबंधन", subtitle: "मार्ग पर पेयजल टैंकर, आरओ यूनिट और हैंड पंप।" },
      "medical-camps": { breadcrumb: "एडमिन / फील्ड सेवाएं / चिकित्सा शिविर", title: "चिकित्सा शिविर प्रबंधन", subtitle: "मार्ग भर में डॉक्टर, सेवाएं और आपातकालीन उपलब्धता।" },
      hospitals: { breadcrumb: "एडमिन / फील्ड सेवाएं / अस्पताल और चिकित्सा केंद्र", title: "अस्पताल और चिकित्सा केंद्र नेटवर्क", subtitle: "मार्ग पर साझेदार अस्पताल और चिकित्सा केंद्र, आपातकालीन डिस्पैच के लिए वारी पड़ाव और जीपीएस निर्देशांक के साथ।" },
      "sos-requests": { breadcrumb: "एडमिन / आपातकालीन प्रतिक्रिया / आपातकालीन अनुरोध", title: "आपातकालीन अनुरोध", subtitle: "प्लेटफ़ॉर्म पर उठाए गए सभी आपातकालीन चिकित्सा अनुरोध, लाइव स्वयंसेवक और वैन असाइनमेंट के साथ।" },
      "emergency-vans": { breadcrumb: "एडमिन / आपातकालीन प्रतिक्रिया / आपातकालीन वैन", title: "आपातकालीन वैन प्रबंधन", subtitle: "प्रत्येक आपातकालीन वैन के लिए फ्लीट स्थिति, नियुक्त स्वयंसेवक और लाइव जीपीएस स्थिति।" },
      "emergency-tracking": { breadcrumb: "एडमिन / आपातकालीन प्रतिक्रिया / लाइव आपातकालीन ट्रैकिंग", title: "लाइव आपातकालीन ट्रैकिंग", subtitle: "नियुक्त वैन के लाइव स्थान को मानचित्र पर देखने के लिए एक सक्रिय आपात स्थिति चुनें।" },
      "missing-persons": { breadcrumb: "एडमिन / सुरक्षा और रिपोर्ट / लापता व्यक्ति", title: "लापता व्यक्ति प्रबंधन", subtitle: "स्वयंसेवकों और उपयोगकर्ताओं को दिखाई देने से पहले नई रिपोर्ट सत्यापित करें।" },
      "lost-found": { breadcrumb: "एडमिन / सुरक्षा और रिपोर्ट / खोया-पाया", title: "खोया और पाया", subtitle: "रिपोर्ट की गई खोई हुई वस्तुओं की समीक्षा, अनुमोदन और दावेदारों से मिलान करें।" },
      notifications: { breadcrumb: "एडमिन / सहभागिता / सूचनाएं", title: "सूचना प्रबंधन", subtitle: "वारकरी, स्वयंसेवकों या विशिष्ट मार्गों को अलर्ट लिखें और प्रसारित करें।" },
      chatbot: { breadcrumb: "एडमिन / सहभागिता / एआई चैटबॉट", title: "एआई चैटबॉट विश्लेषण", subtitle: "देखें कि वारकरी सहायक का उपयोग कैसे कर रहे हैं और सुधार की आवश्यकता कहां है।" },
      "digital-id": { breadcrumb: "एडमिन / सहभागिता / डिजिटल वारकरी पहचान पत्र", title: "डिजिटल वारकरी पहचान पत्र", subtitle: "हर पंजीकृत वारकरी के लिए क्यूआर-आधारित पहचान पत्र बनाएं, सत्यापित करें और प्रबंधित करें।" },
      reports: { breadcrumb: "एडमिन / सिस्टम / रिपोर्ट और विश्लेषण", title: "रिपोर्ट और विश्लेषण", subtitle: "प्लेटफ़ॉर्म डेटा निर्यात करें और पूरा सिस्टम गतिविधि लॉग देखें।" },
      feedback: { breadcrumb: "एडमिन / सिस्टम / प्रतिक्रिया", title: "प्रतिक्रिया", subtitle: "वारकरी और स्वयंसेवक प्लेटफ़ॉर्म के बारे में क्या कह रहे हैं।" },
      settings: { breadcrumb: "एडमिन / सिस्टम / सेटिंग्स", title: "सिस्टम सेटिंग्स", subtitle: "प्लेटफ़ॉर्म कॉन्फ़िगरेशन, एडमिन भूमिकाएं और सुरक्षा।" }
    },
    dashboard: {
      kpi: {
        totalWarkaris: "कुल वारकरी", totalVolunteers: "कुल स्वयंसेवक", foodCamps: "भोजन शिविर",
        waterPoints: "जल केंद्र", medicalCamps: "चिकित्सा शिविर", activeSOS: "सक्रिय एसओएस",
        missingReports: "लापता व्यक्ति रिपोर्ट", dailyVisitors: "दैनिक आगंतुक", aiQueries: "एआई प्रश्न",
        d1: "+18.5% इस सप्ताह", d2: "+6.2% इस सप्ताह", d3: "+9 आज", d4: "+14 आज", d5: "+3 आज",
        d6: "−2 कल की तुलना में", d7: "+4 आज", d8: "+22.4% कल की तुलना में", d9: "+31% इस सप्ताह"
      },
      emKpi: {
        activeEmergencies: "सक्रिय आपात स्थिति", availableVans: "उपलब्ध आपातकालीन वैन",
        vansOnWay: "मार्ग में वैन", availableVolunteers: "उपलब्ध स्वयंसेवक",
        volunteersOnEmergency: "आपात स्थिति में स्वयंसेवक", completedEmergencies: "पूर्ण आपात स्थितियां"
      },
      monitor: {
        title: "लाइव आपातकालीन मॉनिटर", updated: "12 सेकंड पहले अपडेट किया गया",
        activeSOS: "सक्रिय एसओएस", pendingMedical: "लंबित चिकित्सा", missingPersons: "लापता व्यक्ति", criticalAlerts: "गंभीर अलर्ट",
        type: "प्रकार", volunteer: "स्वयंसेवक", reportedBy: "रिपोर्ट करने वाला", unassigned: "अनियुक्त",
        typeFall: "गिरना / चोट", typeDehydration: "डिहाइड्रेशन", byVolunteer: "स्वयंसेवक",
        critical: "गंभीर", pending: "लंबित", searching: "खोजा जा रहा है",
        view: "देखें", assign: "असाइन करें", resolve: "समाधान करें"
      },
      map: {
        title: "लाइव मानचित्र — मार्ग और फील्ड संसाधन", refresh: "हर 30 सेकंड में ऑटो-रिफ्रेश",
        all: "सभी", warkaris: "वारकरी", volunteers: "स्वयंसेवक", sos: "एसओएस",
        medical: "चिकित्सा", food: "भोजन", water: "पानी",
        legendWarkaris: "वारकरी", legendVolunteers: "स्वयंसेवक", legendSOS: "एसओएस",
        legendMedical: "चिकित्सा शिविर", legendWater: "जल केंद्र", legendHospital: "अस्पताल / पुलिस"
      },
      charts: {
        registration: "वारकरी पंजीकरण रुझान", distribution: "सहायता वितरण",
        visitors: "दैनिक आगंतुक", sos: "एसओएस अनुरोध (7 दिन)",
        route: "मार्ग भीड़ विश्लेषण", routeSub: "प्रत्येक पड़ाव पर लाइव तीर्थयात्री घनत्व"
      }
    },
    common: { search: "खोजें" }
  }
};

function getLang(){
  return localStorage.getItem('wariLang') || 'en';
}

function setLang(code){
  localStorage.setItem('wariLang', code);
  document.documentElement.setAttribute('lang', code);
  document.documentElement.classList.toggle('lang-devanagari', code === 'mr' || code === 'hi');
}

/** t('nav.items.dashboard') -> translated string, falls back to English, then the key itself. */
function t(path){
  const lang = getLang();
  const dig = (obj) => path.split('.').reduce((o,k) => (o && o[k] !== undefined) ? o[k] : undefined, obj);
  return dig(TRANSLATIONS[lang]) ?? dig(TRANSLATIONS.en) ?? path;
}

/** Translate every [data-i18n] element on the current page (text) and [data-i18n-title] (title/tooltip attr). */
function applyDataI18n(root){
  (root || document).querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  (root || document).querySelectorAll('[data-i18n-title]').forEach(el => {
    el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
  });
  (root || document).querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
  });
}

/** Translate the shared .page-header (breadcrumb / h1 / p) using body[data-page]. */
function applyPageHeaderI18n(){
  const page = document.body.getAttribute('data-page');
  const dict = t('pages.' + page);
  if (!dict || typeof dict !== 'object') return;
  const header = document.querySelector('.page-header');
  if (!header) return;
  const bc = header.querySelector('.breadcrumb-mini');
  const h1 = header.querySelector('h1');
  const p = header.querySelector('p');
  if (bc && dict.breadcrumb) bc.textContent = dict.breadcrumb;
  if (h1 && dict.title) h1.textContent = dict.title;
  if (p && dict.subtitle) p.textContent = dict.subtitle;
}

function translatePage(){
  applyPageHeaderI18n();
  applyDataI18n();
  if (typeof onLanguageChanged === 'function') onLanguageChanged();
}

document.addEventListener('DOMContentLoaded', () => setLang(getLang()));
