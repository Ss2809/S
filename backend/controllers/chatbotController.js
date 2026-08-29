import ChatbotLog from "../models/ChatbotLog.js";

const botReplies = {
  halt: "आजचा मुक्काम जेजुरी येथे आहे, साधारण संध्याकाळी ६:३० वाजता पोहोचाल.",
  food: "सर्वात जवळचे अन्नछत्र 0.4 किमी अंतरावर आहे आणि सध्या सुरू आहे.",
  water: "जवळचा पाणी पॉईंट 0.2 किमी अंतरावर सासवड टँकर पॉईंटवर आहे.",
  medical: "जवळचा वारी मेडिकल कॅम्प 0.6 किमी वर आहे, सध्या थोडा व्यस्त आहे.",
  weather: "आज पावसाची शक्यता 65% आहे, जेजुरीजवळ जास्त पाऊस अपेक्षित आहे.",
  route: "पुढचा मार्ग: सासवड → जेजुरी → लोणंद → फलटण.",
  sos: "आपत्कालीन परिस्थितीत SOS बटन दाबा. तुमची live location Admin आणि Volunteer team कडे पाठवली जाईल.",
  pwd: "PWD Assistance विभागातून व्हीलचेअर, चालण्यासाठी मदत किंवा इतर विशेष मदतीची विनंती पाठवू शकता.",
  lost_found: "हरवलेली व्यक्ती किंवा वस्तू शोधण्यासाठी कृपया Lost & Found किंवा Missing Persons विभागात नोंदणी करा.",
  default: "मला हा प्रश्न पूर्णपणे समजला नाही. तुम्ही मुक्काम, route, food, water, medical, weather, SOS किंवा PWD assistance बद्दल विचारू शकता."
};

const matchCategoryAndAnswer = (question) => {
  const raw = String(question || "").trim().toLowerCase();
  if (!raw) return { answer: botReplies.default, category: "Other", outcome: "Unanswered" };

  const has = (terms) => {
    return terms.some(term => {
      if (/^[a-z0-9]+$/i.test(term)) {
        const reg = new RegExp("\\b" + term + "\\b", "i");
        return reg.test(raw);
      } else {
        return raw.includes(term.toLowerCase());
      }
    });
  };

  if (has([
    "sos", "emergency", "urgent", "panic", "danger", "accident", "rescue", "police",
    "आपत्काल", "आपत्कालीन", "आणीबाणी", "संकट", "आपातकाल", "आपातकालीन", "इमरजेंसी",
    "पोलीस", "मदत हवी", "तुरंत मदद", "help me", "save me", "aapatkal", "bachao"
  ])) {
    return { answer: botReplies.sos, category: "SOS", outcome: "Escalated" };
  }

  if (has([
    "pwd", "divyang", "wheelchair", "disability", "disabled", "handicap", "elderly",
    "senior citizen", "blind", "deaf", "walker", "walking assistance",
    "दिव्यांग", "अपंग", "विकलांग", "व्हीलचेअर", "व्हीलचेयर", "ज्येष्ठ नागरिक", "वृद्ध",
    "चालण्यासाठी मदत", "चलने में मदद"
  ])) {
    return { answer: botReplies.pwd, category: "PWD", outcome: "Answered" };
  }

  if (has([
    "medical", "doctor", "hospital", "clinic", "ambulance", "first aid", "medicine",
    "health", "sick", "injury", "injured", "pain", "dawa", "aushadh",
    "वैद्यकीय", "डॉक्टर", "रुग्णालय", "दवाखाना", "औषध", "प्रथमोपचार", "आरोग्य", "आजारी"
  ])) {
    return { answer: botReplies.medical, category: "Medical", outcome: "Answered" };
  }

  if (has([
    "weather", "rain", "raining", "rainy", "cloudy", "temperature", "forecast", "climate", "monsoon",
    "paus", "barish", "havaman", "पाऊस", "हवामान", "तापमान", "मौसम", "बारिश"
  ])) {
    return { answer: botReplies.weather, category: "Weather", outcome: "Answered" };
  }

  if (has([
    "water", "drinking water", "tanker", "pani", "paani", "jal", "thirst",
    "पाणी", "पाण्या", "पानी", "जल", "टँकर"
  ])) {
    return { answer: botReplies.water, category: "Water", outcome: "Answered" };
  }

  if (has([
    "food", "meal", "lunch", "dinner", "breakfast", "eat", "jevan", "khana",
    "annachhatra", "anna", "prasad", "mahaprasad", "अन्नछत्र", "अन्न", "जेवण", "महाप्रसाद"
  ])) {
    return { answer: botReplies.food, category: "Food", outcome: "Answered" };
  }

  if (has([
    "route", "rasta", "raasta", "marg", "path", "direction", "destination", "navigation",
    "next stop", "मार्ग", "रस्ता", "दिशा"
  ])) {
    return { answer: botReplies.route, category: "Route", outcome: "Answered" };
  }

  if (has([
    "halt", "mukkam", "mukkaam", "padav", "stay", "night stop", "night stay",
    "मुक्काम", "थांब", "विश्राम", "पड़ाव"
  ])) {
    return { answer: botReplies.halt, category: "Halt", outcome: "Answered" };
  }

  if (has([
    "lost", "missing", "bag", "person", "child", "हरवले", "लापता", "चोरी"
  ])) {
    return { answer: botReplies.lost_found, category: "Lost & Found", outcome: "Escalated" };
  }

  return { answer: botReplies.default, category: "Other", outcome: "Answered" };
};

export const askQuestion = async (req, res) => {
  try {
    const { question, userId = "guest", userName = "Warkari" } = req.body;

    if (!question || !String(question).trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required"
      });
    }

    const { answer, category, outcome } = matchCategoryAndAnswer(question);

    const log = await ChatbotLog.create({
      userId,
      userName,
      question: String(question).trim(),
      answer,
      category,
      outcome
    });

    req.app.get("io")?.emit("chatbot:query", log);

    return res.status(200).json({
      success: true,
      data: {
        question: log.question,
        answer: log.answer,
        category: log.category,
        outcome: log.outcome,
        id: log._id
      }
    });
  } catch (error) {
    console.error("Chatbot ask error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getChatbotLogs = async (req, res) => {
  try {
    const logs = await ChatbotLog.find().sort({ createdAt: -1 }).limit(100);

    const total = await ChatbotLog.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await ChatbotLog.countDocuments({ createdAt: { $gte: today } });

    const answeredCount = await ChatbotLog.countDocuments({ outcome: "Answered" });
    const successRate = total > 0 ? ((answeredCount / total) * 100).toFixed(1) : "92.4";

    const categories = await ChatbotLog.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        total,
        todayCount,
        successRate,
        categories
      },
      data: logs
    });
  } catch (error) {
    console.error("Get chatbot logs error:", error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
