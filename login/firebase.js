
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

// Utility: create user using a secondary app so admin stays signed in
async function createUserWithoutSwitch(email, password){
  const secondary = firebase.apps.find(a=>a.name === "Secondary") || firebase.initializeApp(firebaseConfig, "Secondary");
  try{
    const cred = await secondary.auth().createUserWithEmailAndPassword(email, password);
    return cred.user;
  } finally {
    // optional: keep secondary app for future creates; comment out to delete
    // await secondary.delete();
  }
}

