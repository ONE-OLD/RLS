
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

// ===== DROPBOX API TOKEN =====
// Get your token from: https://www.dropbox.com/developers/apps
// Create app > Generate token and paste here
const DROPBOX_ACCESS_TOKEN = "sl.u.AGVGSuRYRCoMZFB1Ln46B8jaZqTaUJ0aGoOQWJlivUsp0bo2zDh84TyzKAzqaFRf922ZcX-uO3Hi6mY6P5jULnxW1jywMMtvYwXy0_ZWPSeu9ar8Xgs2iixxNU90duXPq-FdXwS8maxC-fsLRzYWAVV5l7tpGRxeE6-R80eN34TdrFA4JUjCXwC82TiMBKSSggrjYC4YapHmcWGW20gKcZcXIS7Uavkho_Ml9WxgZKvXNFU9SCiZeLP3eWzxDoEXIN0ugqk4LR238abE2IJ4NZPfoQavn3Zmw9fukWF8HO8byLgHit8gVLDVmIf2iOpGYUCQxHZ1zyqZe3W4CFqdtmtyBpSXNeNQ7eQAoJIfDWeG_ENH-D7oNgW-wSxsz-lc3GBMGDf7dVWnwWvAbnlFKSDpnfMGfamO-kl0JKsGCwVuxk1yX6YboisbV_ZRtMlxsPnAkVxCj1hJWcH9S4v9Vaf3f28kUiC_566MM9k6Ah6WBOPKHxQEUUAnC7xPF2HUHhbRQ9PCx7wKWoIJqUcdd4gGj1AfoGWLV2_s4d-fd6rfV_51yf7eK0x7kc-jRIJ7_ae6qZdg0DOoi6klV_8RaMU32cYtvEJHOo8_Fo6Ecfwo_rr32tzk6VOrX_VIVTAlVltmVTIq3bK_LRpJmTmAs8xz0A_ibCHFwkjWnseZclnG3KpYJ_tWa9P6AEizOVTCuHIKfkBysFjHCSspEw5UDjUSPVkBCWSeY2t7xLFoXtmGyIrrFVYy1TfdfI_rrESPJUqV5rDbvSdIgMxRiUIw5nGWqzzoVNevbtE1GVjHS8WAMdhq-6swnBCihDosokiXhQffRtcHncg8a_yFWaSFMAyNQO_LbI-u9NGO-9aIK1Do0_N_I602n1Gm0eexaIFBBlWBs0MKVbh5e-xlmaT9ez3C3T-4hLnjsjaZ-JOH6ARJQdgsz93ierBVZaS872HsMEhPdwtb9oss4KldRsMdCMjkHErEfpnaq85PfxKJj8MumsoG2X4pMKzypHn3tVoC61M2Wb1b5xzLXDh4tDaztFNMkI5UtNoIYptvM6Gev7TP45X3SDdP3T22r2qHUZMvi_chPU5OA80kkK_CzIedRz-FtXfU4Jo7drUn4-TLPrY71V0NLrv-Sm-xvtG7OmSNbHREtPaIbnRJuhn8OT-UENJDvso8e8-x1LgvjOu_A45YEleZQ2WBByiroqvHj4Aa1XFiwIFyTxnnANDwh5jshBc57_5dYvk8Vn0UhAwEZOksfzwDVe0RNKBliRHkE0S6KW1PASRPM5hxLZk94imGq1uVFHIZjuBFQ26-kfr1GJTkEzWgJmvsAnt57F20GpIM_RvF_GCNB4tXXbgapzqgSBhc_c-RjjKGlO2MTCa4tlvpMokdKQwZRBqPmQnZrWYp6Kxhewwwim0_vsFTwsaW8xElOVQEU-7hlxgH7nYUten39e9lz5U7mrCG4SbnBP17rC8";

