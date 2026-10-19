import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBDq3KLBUMsRNfKmku11QnxZsOsvTpzjIM",
  authDomain: "task-manager-6447d.firebaseapp.com",
  projectId: "task-manager-6447d",
  storageBucket: "task-manager-6447d.firebasestorage.app",
  messagingSenderId: "189839222707",
  appId: "1:189839222707:web:c092d919c5d5213672cdc6",
  measurementId: "G-LLGXGTLWG3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
