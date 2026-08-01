// Firebase v9 compat initialization
const firebaseConfig = {
  apiKey: "AIzaSyD0JQhgoWcyJBOaOaXH-xMsed9V25FA184",
  authDomain: "rls2025-6f364.firebaseapp.com",
  databaseURL: "https://rls2025-6f364-default-rtdb.firebaseio.com",
  projectId: "rls2025-6f364",
  storageBucket: "rls2025-6f364.firebasestorage.app",
  messagingSenderId: "662069598409",
  appId: "1:662069598409:web:7fcf245a20cd1e0537d518",
  measurementId: "G-T1P0FEYNYW"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();
const storage = firebase.storage();

const ONESIGNAL_APP_ID = "de9afd09-6dfb-4299-abd9-761671383942";

async function sendOneSignalPushNotification({ title, message, url, type }) {
  const restApiKeyInput = document.getElementById("onesignalRestApiKey");
  const restApiKey = (restApiKeyInput?.value || window.ONESIGNAL_REST_API_KEY || "").trim();

  if (!restApiKey) {
    console.warn("OneSignal REST API key is not configured. Push notification skipped.");
    return { sent: false, reason: "missing-api-key" };
  }

  const payload = {
    app_id: ONESIGNAL_APP_ID,
    headings: { en: title || "RLS Update" },
    contents: { en: message || "A new update has been published." },
    url: url || "https://rls.ac.rw/",
    included_segments: ["Subscribed Users"],
    data: { type: type || "general", source: "admin" },
    chrome_web_icon: "https://rls.ac.rw/image/logo.png",
    web_icon: "https://rls.ac.rw/image/logo.png"
  };

  try {
    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": `Basic ${restApiKey}`
      },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();
    let responseData = {};
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = { raw: responseText };
    }

    if (!response.ok) {
      throw new Error(`OneSignal push failed: ${response.status} ${responseText}`);
    }

    return { sent: true, response: responseData };
  } catch (error) {
    console.error("OneSignal admin push failed:", error);
    throw error;
  }
}

// Utility: create user using a secondary app instance so current admin remains signed in
async function createUserWithoutSwitch(email, password) {
  const secondary = firebase.apps.find(a => a.name === "Secondary") || firebase.initializeApp(firebaseConfig, "Secondary");
  try {
    const cred = await secondary.auth().createUserWithEmailAndPassword(email, password);
    return cred.user;
  } finally {
    // Keeps secondary session isolated
  }
}